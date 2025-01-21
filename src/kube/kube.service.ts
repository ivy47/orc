import { Injectable } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';

@Injectable()
export class KubeService {
  private kc: k8s.KubeConfig;
  private _coreApi: k8s.CoreV1Api;
  private _appsApi: k8s.AppsV1Api;
  private _networkingApi: k8s.NetworkingV1Api;

  constructor() {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromDefault();

    this._coreApi = this.kc.makeApiClient(k8s.CoreV1Api);
    this._appsApi = this.kc.makeApiClient(k8s.AppsV1Api);
    this._networkingApi = this.kc.makeApiClient(k8s.NetworkingV1Api);
  }

  get client() {
    return this.kc;
  }

  get coreApi() {
    return this._coreApi;
  }

  get appsApi() {
    return this._appsApi;
  }

  get networkingApi() {
    return this._networkingApi;
  }
}
