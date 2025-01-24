import { Module } from '@nestjs/common';
import { KubeModule } from '../kube/kube.module';
import { ScannerService } from './scanner.service';
import { ServiceScanner, IngressScanner, NamespaceScanner, PdbScanner } from './scanners';

@Module({
  imports: [KubeModule],
  providers: [ScannerService, NamespaceScanner, ServiceScanner, IngressScanner, PdbScanner],
  exports: [ScannerService],
})
export class ScannerModule {}
