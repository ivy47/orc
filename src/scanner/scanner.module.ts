import { Module } from '@nestjs/common';
import { NamespaceScanner } from './scanners/namespace.scanner';
import { KubeModule } from '../kube/kube.module';
import { ScannerService } from './scanner.service';
import { ServiceScanner } from './scanners/service.scanner';
import { IngressScanner } from './scanners/ingress.scanner';

@Module({
  imports: [KubeModule],
  providers: [ScannerService, NamespaceScanner, ServiceScanner, IngressScanner],
  exports: [ScannerService],
})
export class ScannerModule {}
