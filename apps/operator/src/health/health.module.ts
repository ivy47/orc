import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { KubeHealthIndicator } from './indicators/kube.indicator';
import { KubeModule } from '../kube/kube.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule, KubeModule],
  controllers: [HealthController],
  providers: [KubeHealthIndicator],
})
export class HealthModule {}
