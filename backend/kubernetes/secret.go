package kubernetes

import (
	"context"
	"strings"

	"github.com/timmyjinks/tysoncloud/util"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	appcorev1 "k8s.io/client-go/applyconfigurations/core/v1"
	appmetav1 "k8s.io/client-go/applyconfigurations/meta/v1"
)

func (d *KubernetesService) CreateSecret(ctx context.Context, resource Resource) error {
	_, err := d.clientset.CoreV1().Secrets(resource.Namespace).Apply(ctx, &appcorev1.SecretApplyConfiguration{
		TypeMetaApplyConfiguration: appmetav1.TypeMetaApplyConfiguration{
			Kind:       util.StringPtr("Secret"),
			APIVersion: util.StringPtr("v1"),
		},
		ObjectMetaApplyConfiguration: &appmetav1.ObjectMetaApplyConfiguration{
			Namespace: &resource.Namespace,
			Name:      &resource.Name,
		},
		Data: resource.Env,
	}, metav1.ApplyOptions{
		FieldManager: "tysoncloud",
	})
	if err != nil {
		return err
	}
	return nil
}

func (d *KubernetesService) DeleteSecret(ctx context.Context, resource Resource) error {
	return d.clientset.CoreV1().Secrets(resource.Namespace).Delete(ctx, resource.Name, metav1.DeleteOptions{})
}

func (d *KubernetesService) GetSecret(ctx context.Context, resource Resource) (map[string]string, error) {
	secret, err := d.clientset.CoreV1().Secrets(resource.Namespace).Get(ctx, resource.Name, metav1.GetOptions{})
	if err != nil {
		if apierrors.IsNotFound(err) {
			return map[string]string{}, nil
		}
		return nil, err
	}

	env := make(map[string]string, len(secret.Data))
	for k, v := range secret.Data {
		env[k] = strings.TrimRight(string(v), "\r\n")
	}
	return env, nil
}
