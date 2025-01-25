import { Injectable } from '@nestjs/common';

@Injectable()
export class OrcConfig {
  dryRun: boolean = true;
  ageThresholdDays: number = 7;
  batchSize: number = 10;
  ignoreAnnotations: string[] = ['orc/ignore-resource'];
  schedule: string = '0 0 * * *'; // Every day at midnight

  constructor(config?: Partial<OrcConfig>) {
    if (config) {
      Object.assign(this, config);
    }
  }
}
