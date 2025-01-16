import { Injectable, Logger } from '@nestjs/common';
import { BaseResourceScanner } from './base.scanner';
import { NamespaceScanner } from './scanners/namespace.scanner';
import { ConfigService } from '../config/config.service';
import { K8sResource, BatchScanReport, ScanReport } from '../types';

@Injectable()
export class ScannerService {
  private readonly logger = new Logger(ScannerService.name);
  private readonly scanners: BaseResourceScanner<K8sResource>[];

  constructor(private readonly namespaceScanner: NamespaceScanner, private readonly configService: ConfigService) {
    this.scanners = [this.namespaceScanner];
  }

  async scan(): Promise<BatchScanReport> {
    const startTime = Date.now();
    const scanPromises = this.scanners.map((scanner) => this.processScannerResources(scanner));
    const reports = await Promise.all(scanPromises);

    const summary = {
      totalScanned: reports.reduce((sum, report) => sum + report.totalResources, 0),
      totalOrphaned: reports.reduce((sum, report) => sum + report.orphanedResources.length, 0),
      totalSkipped: reports.reduce((sum, report) => sum + report.skippedResources.length, 0),
      totalErrors: reports.reduce((sum, report) => sum + report.errors.length, 0),
      scanDuration: Date.now() - startTime,
    };

    return {
      reports,
      summary,
      timestamp: new Date(),
    };
  }

  private async processScannerResources<T extends K8sResource>(scanner: BaseResourceScanner<T>): Promise<ScanReport<T>> {
    try {
      const resources = await scanner.scan();
      const orphanedResources: T[] = [];
      const processedResources: T[] = [];
      const skippedResources: T[] = [];
      const errors: string[] = [];

      const batchSize = this.configService.get().batchSize;
      const resourceBatches = this.chunkArray(resources, batchSize);

      for (const batch of resourceBatches) {
        const batchResults = await Promise.all(batch.map((resource) => this.processResource(scanner, resource)));

        batchResults.forEach((result) => {
          if (result.skipped) {
            skippedResources.push(result.resource);
          } else {
            processedResources.push(result.resource);
            if (result.isOrphaned) {
              orphanedResources.push(result.resource);
            }
          }
          if (result.error) {
            errors.push(result.error);
          }
        });
      }

      return {
        resourceType: scanner.constructor.name,
        totalResources: resources.length,
        orphanedResources,
        processedResources,
        skippedResources,
        errors,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        resourceType: scanner.constructor.name,
        totalResources: 0,
        orphanedResources: [],
        processedResources: [],
        skippedResources: [],
        errors: [`Scanner failed: ${error.message}`],
        timestamp: new Date(),
      };
    }
  }

  private async processResource<T extends K8sResource>(
    scanner: BaseResourceScanner<T>,
    resource: T,
  ): Promise<{
    resource: T;
    isOrphaned: boolean;
    skipped: boolean;
    error?: string;
  }> {
    try {
      if (!scanner.shouldProcess(resource)) {
        return { resource, isOrphaned: false, skipped: true };
      }

      const isOrphaned = await scanner.isOrphaned(resource);

      if (isOrphaned) {
        this.logger.debug(`${resource.metadata.namespace || 'cluster-wide'}: (${resource.kind}) ${resource.metadata.name} is orphaned`);

        if (!this.configService.get().dryRun) {
          await scanner.cleanup(resource, false);
        }
      }

      return {
        resource,
        isOrphaned,
        skipped: false,
      };
    } catch (error) {
      this.logger.debug(`Failed to process ${resource.metadata?.name}: ${error.message}`);
      return {
        resource,
        isOrphaned: false,
        skipped: false,
        error: error.message,
      };
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) => array.slice(index * size, (index + 1) * size));
  }
}
