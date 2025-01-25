import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';

const IS_DEFAULT_STORAGE_CLASS_ANNOTATION = 'storageclass.kubernetes.io/is-default-class';

@Injectable()
export class StorageClassScanner extends BaseResourceScanner<k8s.V1StorageClass> {
  private usedStorageClasses: Set<string>;

  constructor(private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async preScan(): Promise<void> {
    const pvs = await this.kubeService.coreApi.listPersistentVolume();
    this.usedStorageClasses = new Set(pvs.items.map((pv) => pv.spec?.storageClassName));
  }

  async scan(): Promise<k8s.V1StorageClass[]> {
    try {
      const response = await this.kubeService.storageApi.listStorageClass();
      return response.items.map((sc) => enrichKubernetesObject(sc, 'StorageClass') as k8s.V1StorageClass);
    } catch (error) {
      this.logger.error(`Failed to scan StorageClasses: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(sc: k8s.V1StorageClass): Promise<boolean> {
    try {
      return !(
        (sc.metadata.annotations && sc.metadata.annotations[IS_DEFAULT_STORAGE_CLASS_ANNOTATION] === 'true') ||
        this.usedStorageClasses.has(sc.metadata.name)
      );
    } catch (error) {
      this.logger.error(`Failed to check StorageClass ${sc.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(sc: k8s.V1StorageClass): Promise<CleanupResult<k8s.V1StorageClass>> {
    try {
      await this.kubeService.storageApi.deleteStorageClass({
        name: sc.metadata.name,
      });

      return {
        resource: sc,
        success: true,
      };
    } catch (error) {
      return {
        resource: sc,
        success: false,
        error: error.message,
      };
    }
  }
}
