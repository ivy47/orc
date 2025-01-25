import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ScannerService } from './scanner/scanner.service';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly scannerService: ScannerService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    // const schedule = this.configService.get().schedule;
    // const job = new CronJob(schedule, this.runScan.bind(this));
    // this.schedulerRegistry.addCronJob('scan', job);
    // job.start();

    this.runScan();
  }

  private async runScan() {
    try {
      this.logger.log(`Running scan at ${new Date().toISOString()}`);
      const results = await this.scannerService.scan();
      this.logger.log(`Scan completed. Found ${results.summary.totalOrphaned} orphaned resources`);
      return results;
    } catch (error) {
      this.logger.error(`Scan failed: ${error.message}`);
    }
  }
}
