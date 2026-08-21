package kubernetes

import (
	"bufio"
	"context"
	"fmt"
	"sort"
	"strings"

	"github.com/timmyjinks/tysoncloud/util"
	corev1 "k8s.io/api/core/v1"
	resourcev1 "k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	appsv1apply "k8s.io/client-go/applyconfigurations/apps/v1"
	appcorev1 "k8s.io/client-go/applyconfigurations/core/v1"
	appmetav1 "k8s.io/client-go/applyconfigurations/meta/v1"
)

func (d *KubernetesService) CreateDeployment(ctx context.Context, resource Resource) error {
	container := []appcorev1.ContainerApplyConfiguration{
		{
			Name:  &resource.Name,
			Image: &resource.Image,
			Resources: &appcorev1.ResourceRequirementsApplyConfiguration{
				Limits: &corev1.ResourceList{
					corev1.ResourceCPU:    resourcev1.MustParse("500m"),
					corev1.ResourceMemory: resourcev1.MustParse("1Gi"),
				},
				Requests: &corev1.ResourceList{
					corev1.ResourceCPU:    resourcev1.MustParse("100m"),
					corev1.ResourceMemory: resourcev1.MustParse("100Mi"),
				},
			},
			Ports: []appcorev1.ContainerPortApplyConfiguration{
				{
					Protocol:      (*corev1.Protocol)(util.StringPtr(string(corev1.ProtocolTCP))),
					ContainerPort: &resource.Port,
				},
			},
		},
	}

	if len(resource.Env) != 0 {
		container[0].EnvFrom = []appcorev1.EnvFromSourceApplyConfiguration{
			{
				SecretRef: &appcorev1.SecretEnvSourceApplyConfiguration{
					LocalObjectReferenceApplyConfiguration: appcorev1.LocalObjectReferenceApplyConfiguration{
						Name: &resource.Name,
					},
				},
			},
		}
	}

	spec := &appsv1apply.DeploymentSpecApplyConfiguration{
		Selector: &appmetav1.LabelSelectorApplyConfiguration{
			MatchLabels: map[string]string{
				"app": resource.Name,
			},
		},
		Template: &appcorev1.PodTemplateSpecApplyConfiguration{
			ObjectMetaApplyConfiguration: &appmetav1.ObjectMetaApplyConfiguration{
				Name: &resource.Name,
				Labels: map[string]string{
					"app": resource.Name,
				},
			},
			Spec: &appcorev1.PodSpecApplyConfiguration{
				Containers: container,
			},
		},
	}

	_, err := d.clientset.AppsV1().Deployments(resource.Namespace).Apply(ctx, &appsv1apply.DeploymentApplyConfiguration{
		TypeMetaApplyConfiguration: appmetav1.TypeMetaApplyConfiguration{
			Kind:       util.StringPtr("Deployment"),
			APIVersion: util.StringPtr("apps/v1"),
		},
		ObjectMetaApplyConfiguration: &appmetav1.ObjectMetaApplyConfiguration{
			Name: &resource.Name,
			Labels: map[string]string{
				"app": resource.Name,
			},
			Annotations: map[string]string{
				"reloader.stakater.com/auto": "true",
			},
		},
		Spec: spec,
	}, metav1.ApplyOptions{
		FieldManager: "tysoncloud",
	})
	if err != nil {
		return err
	}
	return nil
}

func (d *KubernetesService) GetDeploymentLogs(ctx context.Context, resource Resource, lines chan string) error {
	pods, err := d.clientset.CoreV1().Pods(resource.Namespace).List(ctx, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("app=%s", resource.Name),
	})
	if err != nil {
		return err
	}
	if len(pods.Items) == 0 {
		return fmt.Errorf("no pods found for %s", resource.Name)
	}

	sortPodsByCreation(pods.Items)

	pod := pods.Items[0]
	var tail int64 = 200
	req := d.clientset.CoreV1().Pods(resource.Namespace).GetLogs(pod.Name, &corev1.PodLogOptions{
		Container: resource.Name,
		Follow:    true,
		TailLines: &tail,
	})
	stream, err := req.Stream(ctx)
	if err != nil {
		return err
	}
	defer stream.Close()

	scanner := bufio.NewScanner(stream)
	for scanner.Scan() {
		select {
		case lines <- scanner.Text():
		case <-ctx.Done():
			return ctx.Err()
		}
	}
	return scanner.Err()
}

func (d *KubernetesService) GetDeploymentDiagnosticLogs(ctx context.Context, resource Resource, lines chan string) error {
	var tail int64 = 200
	emitted := 0

	send := func(msg string) bool {
		select {
		case lines <- msg:
			emitted++
			return true
		case <-ctx.Done():
			return false
		}
	}

	pods, err := d.clientset.CoreV1().Pods(resource.Namespace).List(ctx, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("app=%s", resource.Name),
	})
	if err != nil {
		_ = send(fmt.Sprintf("unable to list pods for %s: %v", resource.Name, err))
	} else if len(pods.Items) == 0 {
		_ = send(fmt.Sprintf("no pods found for %s — deployment may still be scheduling or failed to create pods", resource.Name))
	} else {
		sortPodsByCreation(pods.Items)
		pod := pods.Items[0]

		shouldTryPrevious := false
		for _, cs := range pod.Status.ContainerStatuses {
			if cs.Name == resource.Name {
				if cs.RestartCount > 0 || (cs.LastTerminationState.Terminated != nil) || (cs.State.Terminated != nil) || (cs.State.Waiting != nil && isWaitingFailure(cs.State.Waiting.Reason)) {
					shouldTryPrevious = true
				}
				break
			}
		}
		if len(pod.Status.ContainerStatuses) == 0 {
			shouldTryPrevious = true
		}

		if shouldTryPrevious {
			if ok := d.streamPodLogs(ctx, resource.Namespace, pod.Name, resource.Name, &corev1.PodLogOptions{
				Container: resource.Name,
				Previous:  true,
				TailLines: &tail,
			}, lines, &emitted); ok {
			}
		}

		d.streamPodLogs(ctx, resource.Namespace, pod.Name, resource.Name, &corev1.PodLogOptions{
			Container: resource.Name,
			Follow:    false,
			TailLines: &tail,
		}, lines, &emitted)

		if evLines := d.collectPodEvents(ctx, resource.Namespace, pod.Name); len(evLines) > 0 {
			if emitted > 0 {
				_ = send("--- pod events ---")
			}
			for _, l := range evLines {
				if !send(l) {
					return ctx.Err()
				}
			}
		}

		for _, cs := range pod.Status.ContainerStatuses {
			if cs.Name != resource.Name {
				continue
			}
			if cs.State.Waiting != nil && cs.State.Waiting.Reason != "" {
				_ = send(fmt.Sprintf("container waiting: %s — %s", cs.State.Waiting.Reason, cs.State.Waiting.Message))
			}
			if cs.State.Terminated != nil && cs.State.Terminated.Reason != "" {
				_ = send(fmt.Sprintf("container terminated: %s (exit %d) — %s", cs.State.Terminated.Reason, cs.State.Terminated.ExitCode, cs.State.Terminated.Message))
			}
			if cs.LastTerminationState.Terminated != nil && cs.LastTerminationState.Terminated.Reason != "" {
				lt := cs.LastTerminationState.Terminated
				_ = send(fmt.Sprintf("last termination: %s (exit %d) — %s", lt.Reason, lt.ExitCode, lt.Message))
			}
		}
		for _, cs := range pod.Status.InitContainerStatuses {
			if cs.State.Waiting != nil && cs.State.Waiting.Reason != "" {
				_ = send(fmt.Sprintf("init container %s waiting: %s — %s", cs.Name, cs.State.Waiting.Reason, cs.State.Waiting.Message))
			}
			if cs.State.Terminated != nil && cs.State.Terminated.ExitCode != 0 {
				_ = send(fmt.Sprintf("init container %s terminated: %s (exit %d) — %s", cs.Name, cs.State.Terminated.Reason, cs.State.Terminated.ExitCode, cs.State.Terminated.Message))
			}
		}
		for _, cond := range pod.Status.Conditions {
			if cond.Status != corev1.ConditionTrue && cond.Reason != "" {
				_ = send(fmt.Sprintf("pod condition %s: %s — %s", cond.Type, cond.Reason, cond.Message))
			}
		}
	}

	if depLines := d.collectDeploymentDiagnostics(ctx, resource); len(depLines) > 0 {
		if emitted > 0 {
			_ = send("--- deployment status ---")
		}
		for _, l := range depLines {
			if !send(l) {
				return ctx.Err()
			}
		}
	}
	if depEvents := d.collectDeploymentEvents(ctx, resource); len(depEvents) > 0 {
		if emitted > 0 {
			_ = send("--- deployment events ---")
		}
		for _, l := range depEvents {
			if !send(l) {
				return ctx.Err()
			}
		}
	}

	if emitted == 0 {
		_ = send(fmt.Sprintf("no diagnostic output available for %s — check deployment configuration and image", resource.Name))
	}

	if ctx.Err() != nil {
		return ctx.Err()
	}

	pods, err = d.clientset.CoreV1().Pods(resource.Namespace).List(ctx, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("app=%s", resource.Name),
	})
	if err == nil && len(pods.Items) > 0 {
		sortPodsByCreation(pods.Items)
		pod := pods.Items[0]
		var followTail int64 = 0
		_ = d.streamPodLogs(ctx, resource.Namespace, pod.Name, resource.Name, &corev1.PodLogOptions{
			Container: resource.Name,
			Follow:    true,
			TailLines: &followTail,
		}, lines, &emitted)
	}

	<-ctx.Done()
	return ctx.Err()
}

func (d *KubernetesService) streamPodLogs(ctx context.Context, namespace, podName, container string, opts *corev1.PodLogOptions, lines chan string, emitted *int) bool {
	req := d.clientset.CoreV1().Pods(namespace).GetLogs(podName, opts)
	stream, err := req.Stream(ctx)
	if err != nil {
		if opts.Previous {
			return false
		}
		select {
		case lines <- fmt.Sprintf("unable to fetch container logs for %s: %v", podName, err):
			*emitted++
		case <-ctx.Done():
		}
		return false
	}
	defer stream.Close()

	hadLines := false
	scanner := bufio.NewScanner(stream)
	buf := make([]byte, 0, 64*1024)
	scanner.Buffer(buf, 1024*1024)
	for scanner.Scan() {
		hadLines = true
		select {
		case lines <- scanner.Text():
			*emitted++
		case <-ctx.Done():
			return true
		}
	}
	if hadLines && opts.Previous {
		select {
		case lines <- "--- previous container logs end ---":
			*emitted++
		case <-ctx.Done():
		}
	}
	return hadLines
}

func (d *KubernetesService) collectPodEvents(ctx context.Context, namespace, podName string) []string {
	events, err := d.clientset.CoreV1().Events(namespace).List(ctx, metav1.ListOptions{
		FieldSelector: fmt.Sprintf("involvedObject.name=%s", podName),
	})
	if err != nil || len(events.Items) == 0 {
		return nil
	}
	sort.Slice(events.Items, func(i, j int) bool {
		return events.Items[i].LastTimestamp.Time.Before(events.Items[j].LastTimestamp.Time)
	})
	if len(events.Items) > 20 {
		events.Items = events.Items[len(events.Items)-20:]
	}
	var out []string
	for _, ev := range events.Items {
		msg := strings.TrimSpace(ev.Message)
		if len(msg) > 300 {
			msg = msg[:300]
		}
		count := ""
		if ev.Count > 1 {
			count = fmt.Sprintf(" (x%d)", ev.Count)
		}
		reason := ev.Reason
		if reason == "" {
			reason = string(ev.Type)
		}
		out = append(out, fmt.Sprintf("[%s]%s %s", sanitizeReason(reason), count, msg))
	}
	return out
}

func (d *KubernetesService) collectDeploymentDiagnostics(ctx context.Context, resource Resource) []string {
	dep, err := d.clientset.AppsV1().Deployments(resource.Namespace).Get(ctx, resource.Name, metav1.GetOptions{})
	if err != nil {
		return nil
	}
	var out []string
	for _, cond := range dep.Status.Conditions {
		if cond.Status == corev1.ConditionTrue {
			continue
		}
		msg := strings.TrimSpace(cond.Message)
		if len(msg) > 300 {
			msg = msg[:300]
		}
		if msg == "" {
			msg = cond.Reason
		}
		out = append(out, fmt.Sprintf("deployment %s: %s — %s", cond.Type, cond.Reason, msg))
	}
	if dep.Status.Replicas == 0 && dep.Status.AvailableReplicas == 0 {
		if len(out) == 0 && dep.Status.UnavailableReplicas > 0 {
			out = append(out, fmt.Sprintf("deployment %s has %d unavailable replica(s) — pods may be failing to schedule or start", resource.Name, dep.Status.UnavailableReplicas))
		}
	}
	return out
}

func (d *KubernetesService) collectDeploymentEvents(ctx context.Context, resource Resource) []string {
	events, err := d.clientset.CoreV1().Events(resource.Namespace).List(ctx, metav1.ListOptions{
		FieldSelector: fmt.Sprintf("involvedObject.name=%s", resource.Name),
	})
	if err != nil || len(events.Items) == 0 {
		return nil
	}
	sort.Slice(events.Items, func(i, j int) bool {
		return events.Items[i].LastTimestamp.Time.Before(events.Items[j].LastTimestamp.Time)
	})
	if len(events.Items) > 20 {
		events.Items = events.Items[len(events.Items)-20:]
	}
	var out []string
	for _, ev := range events.Items {
		if strings.EqualFold(ev.Reason, "ScalingReplicaSet") {
			continue
		}
		msg := strings.TrimSpace(ev.Message)
		if len(msg) > 300 {
			msg = msg[:300]
		}
		count := ""
		if ev.Count > 1 {
			count = fmt.Sprintf(" (x%d)", ev.Count)
		}
		out = append(out, fmt.Sprintf("[%s]%s %s", sanitizeReason(ev.Reason), count, msg))
	}
	return out
}

func sortPodsByCreation(pods []corev1.Pod) {
	sort.Slice(pods, func(i, j int) bool {
		return pods[i].CreationTimestamp.After(pods[j].CreationTimestamp.Time)
	})
}

func isWaitingFailure(reason string) bool {
	switch reason {
	case "ImagePullBackOff", "ErrImagePull", "CrashLoopBackOff", "CreateContainerConfigError", "InvalidImageName", "CreateContainerError":
		return true
	default:
		return false
	}
}

func sanitizeReason(reason string) string {
	reason = strings.TrimSpace(reason)
	if reason == "" {
		return "Unknown"
	}
	if strings.Contains(reason, "://") {
		return "Event"
	}
	if len(reason) > 64 {
		return reason[:64]
	}
	return reason
}

func (d *KubernetesService) DeleteDeployment(ctx context.Context, resource Resource) error {
	return d.clientset.AppsV1().Deployments(resource.Namespace).Delete(ctx, resource.Name, metav1.DeleteOptions{})
}
