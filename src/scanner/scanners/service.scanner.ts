import { Injectable, Logger } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';

@Injectable()
export class ServiceScanner extends BaseResourceScanner<k8s.V1Service> {
  constructor(private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1Service[]> {
    try {
      const response = await this.kubeService.coreApi.listServiceForAllNamespaces();
      return response.items;
    } catch (error) {
      this.logger.error(`Failed to scan services: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(svc: k8s.V1Service): Promise<boolean> {
    try {
      return false;
    } catch (error) {
      this.logger.error(`Failed to check service ${svc.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(svc: k8s.V1Service, dryRun: boolean): Promise<CleanupResult<k8s.V1Service>> {
    try {
      if (!dryRun) {
        await this.kubeService.coreApi.deleteNamespacedService({
          name: svc.metadata.name,
          namespace: svc.metadata.namespace,
        });
      }

      return {
        resource: svc,
        success: true,
        dryRun,
      };
    } catch (error) {
      return {
        resource: svc,
        success: false,
        error: error.message,
        dryRun,
      };
    }
  }
}
