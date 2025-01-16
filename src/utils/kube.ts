import * as k8s from '@kubernetes/client-node';

// The api doesn't return the kind of the resource, so we need to enrich the response https://github.com/kubernetes/kubernetes/issues/3030
export const enrichKubernetesObject = (obj: k8s.KubernetesObject, kind: string): k8s.KubernetesObject => {
  return {
    ...obj,
    kind,
  };
};
