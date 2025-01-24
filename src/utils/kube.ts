import * as k8s from '@kubernetes/client-node';

// The api doesn't return the kind of the resource, so we need to enrich the response https://github.com/kubernetes/kubernetes/issues/3030
export const enrichKubernetesObject = (obj: k8s.KubernetesObject, kind: string): k8s.KubernetesObject => {
  return {
    ...obj,
    kind,
  };
};

export function getLabelSelector(labels: Record<string, string>): string {
  return Object.entries(labels)
    .map(([key, value]) => `${key}=${value}`)
    .join(',');
}
