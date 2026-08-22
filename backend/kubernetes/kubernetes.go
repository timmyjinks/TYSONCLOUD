package kubernetes

import (
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	gatewayclient "sigs.k8s.io/gateway-api/pkg/client/clientset/versioned"
)

type KubernetesService struct {
	ClusterIP     string
	clientset     *kubernetes.Clientset
	gatewayClient *gatewayclient.Clientset
	dynamicClient *dynamic.DynamicClient
}

func NewKubernetesService(kubeconfigPath string, clusterIp string) (*KubernetesService, error) {
	config, err := clientcmd.BuildConfigFromFlags("", kubeconfigPath)
	if err != nil {
		return nil, err
	}

	clientset := kubernetes.NewForConfigOrDie(config)
	gatewayClient := gatewayclient.NewForConfigOrDie(config)
	dynamicClient := dynamic.NewForConfigOrDie(config)

	return &KubernetesService{
		ClusterIP:     clusterIp,
		clientset:     clientset,
		gatewayClient: gatewayClient,
		dynamicClient: dynamicClient,
	}, nil
}
