package app

import (
	"context"
	"fmt"
	"strings"

	"github.com/abhishekkkk-15/devcon/agent/internal/core/domain"
	"github.com/abhishekkkk-15/devcon/agent/internal/core/service"
	dockerclient "github.com/moby/moby/client"
)

type ContainerApp struct {
	containerService service.ContainerService
}

func NewContainerApp(c service.ContainerService) *ContainerApp {
	return &ContainerApp{
		containerService: c,
	}
}

func (a *ContainerApp) List(ctx context.Context) (dockerclient.ContainerListResult, error) {
	return a.containerService.ListContainers(ctx)
}

func (a *ContainerApp) ListResources(ctx context.Context) ([]domain.Resource, error) {
	containers, err := a.containerService.ListContainers(ctx)
	if err != nil {
		return nil, err
	}

	resources := make([]domain.Resource, 0, len(containers.Items))
	for _, container := range containers.Items {
		resource := domain.Resource{
			ID:        container.ID,
			Name:      firstContainerName(container.Names),
			Image:     container.Image,
			Type:      inferResourceType(container.Image),
			Status:    strings.ToUpper(string(container.State)),
			CreatedAt: container.Created,
		}

		for _, port := range container.Ports {
			if port.PublicPort != 0 {
				resource.HostPorts = append(resource.HostPorts, fmt.Sprintf("%d", port.PublicPort))
			}
			if port.PrivatePort != 0 {
				resource.ContainerPort = append(resource.ContainerPort, fmt.Sprintf("%d", port.PrivatePort))
			}
		}

		resources = append(resources, resource)
	}

	return resources, nil
}

func (a *ContainerApp) Start(ctx context.Context, id string) error {
	if id == "" {
		return fmt.Errorf("container id cannot be empty")
	}

	return a.containerService.StartContainer(ctx, id)
}

func (a *ContainerApp) Stop(ctx context.Context, id string) error {
	if id == "" {
		return fmt.Errorf("container id cannot be empty")
	}

	return a.containerService.StopContainer(ctx, id)
}

func (a *ContainerApp) Delete(ctx context.Context, id string) error {
	if id == "" {
		return fmt.Errorf("container id cannot be empty")
	}

	return a.containerService.DeleteContainer(ctx, id)
}

func (a *ContainerApp) StartDevconWeb(
	ctx context.Context,
	cfg *domain.ContainerCfg,
) (*domain.DevconStatus, error) {

	if err := a.containerService.PingDaemon(ctx); err != nil {
		return nil, err
	}

	container, err := a.containerService.FindContainer(ctx, cfg.Name)
	if err != nil {
		return nil, err
	}

	if container.ID != "" {

		if container.State != "running" {
			if err := a.containerService.StartContainer(ctx, container.ID); err != nil {
				return nil, err
			}
		}

		inspect, err := a.containerService.InsepectContainer(ctx, container.ID)
		if err != nil {
			return nil, err
		}

		return buildDevconStatus(inspect, true), nil
	}

	created, err := a.containerService.CreateContainer(ctx, cfg)
	if err != nil {
		return nil, err
	}

	if err := a.containerService.StartContainer(ctx, created.ID); err != nil {
		return nil, err
	}

	inspect, err := a.containerService.InsepectContainer(ctx, created.ID)
	if err != nil {
		return nil, err
	}

	return buildDevconStatus(inspect, false), nil
}

func (a *ContainerApp) EnsureRunning(ctx context.Context, identifier string) error {
	running, err := a.containerService.IsContainerRunning(ctx, identifier)
	if err != nil {
		return err
	}

	if running.ID != "" {
		return nil
	}

	return fmt.Errorf("container %s is not running", identifier)
}
func buildDevconStatus(
	inspect dockerclient.ContainerInspectResult,
	existed bool,
) *domain.DevconStatus {

	c := inspect.Container

	status := &domain.DevconStatus{
		ID:             c.ID,
		Name:           strings.TrimPrefix(c.Name, "/"),
		Image:          c.Config.Image,
		State:          string(c.State.Status),
		AlreadyExisted: existed,
	}

	for port, bindings := range c.NetworkSettings.Ports {
		if len(bindings) > 0 {
			status.ContainerPort = string(port.String())
			status.HostPort = bindings[0].HostPort
			break
		}
	}

	return status
}

func firstContainerName(names []string) string {
	for _, name := range names {
		if name != "" {
			return strings.TrimPrefix(name, "/")
		}
	}
	return ""
}

func inferResourceType(image string) string {
	normalized := strings.ToLower(image)

	switch {
	case strings.Contains(normalized, "postgres"):
		return "postgres"
	case strings.Contains(normalized, "redis"):
		return "redis"
	default:
		return "compute"
	}
}
