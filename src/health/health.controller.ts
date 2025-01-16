import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { KubeHealthIndicator } from './indicators/kube.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private kubeHealth: KubeHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.kubeHealth.isHealthy('kubernetes'),
    ]);
  }
}