package kubernetes

import (
	"errors"

	"github.com/timmyjinks/tysoncloud/util"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	gatewayclient "sigs.k8s.io/gateway-api/pkg/client/clientset/versioned"
)

type KubernetesService struct {
	ClusterIP     string
	clientset     *kubernetes.Clientset
	gatewayClient *gatewayclient.Clientset
	dynamicClient *dynamic.DynamicClient
}

func NewKubernetesService(kubeconfigPath string) (*KubernetesService, error) {
	config, err := rest.InClusterConfig()
	if err != nil {
		return nil, err
	}

	clientset := kubernetes.NewForConfigOrDie(config)
	gatewayClient := gatewayclient.NewForConfigOrDie(config)
	dynamicClient := dynamic.NewForConfigOrDie(config)

	ip, err := util.GetLocalIP()
	if err != nil {
		return nil, errors.New("Cluster IP not found")
	}

	return &KubernetesService{
		ClusterIP:     ip + ":6443",
		clientset:     clientset,
		gatewayClient: gatewayClient,
		dynamicClient: dynamicClient,
	}, nil
}
