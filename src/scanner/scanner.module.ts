import { Module } from '@nestjs/common';
import { NamespaceScanner } from './scanners/namespace.scanner';
import { KubeModule } from '../kube/kube.module';
import { ScannerService } from './scanner.service';

@Module({
  imports: [KubeModule],
  providers: [ScannerService, NamespaceScanner],
  exports: [ScannerService],
})
export class ScannerModule {}
