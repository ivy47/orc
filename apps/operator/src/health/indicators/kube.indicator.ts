import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { KubeService } from '../../kube/kube.service';

type KubeHealthResult = {
  connected: boolean;
  error?: string;
};

@Injectable()
export class KubeHealthIndicator extends HealthIndicator {
  constructor(private readonly kubeService: KubeService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const health: KubeHealthResult = {
      connected: false,
    };

    try {
      await this.kubeService.coreApi.listNamespace();
      health.connected = true;

      return this.getStatus(key, true, health);
    } catch (error: unknown) {
      health.error = error instanceof Error ? error.message : 'Unknown error';

      return this.getStatus(key, false, health);
    }
  }
}
