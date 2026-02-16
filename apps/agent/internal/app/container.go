package app

import (
	"context"
	"fmt"

	"github.com/abhishekkkk-15/devcon/agent/internal/domain"
	"github.com/abhishekkkk-15/devcon/agent/internal/service"
)

type ContainerApp struct {
	containerService service.ContainerService
}

func NewContainerApp(c service.ContainerService) *ContainerApp {
	return &ContainerApp{
		containerService: c,
	}
}

func (a *ContainerApp) List(ctx context.Context) ([]domain.Container, error) {
	return a.containerService.ListContainers(ctx)
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

func (a *ContainerApp) StartDevconWeb(ctx context.Context, cfg *domain.ContainerCfg) (string, error) {
	if err := a.containerService.PingDaemon(ctx); err != nil {
		return "", err
	}

	id, err := a.containerService.CreateContainer(ctx, cfg)
	if err != nil {
		return "", err
	}

	if err := a.containerService.StartContainer(ctx, id); err != nil {
		return "", err
	}

	return id, nil
}

func (a *ContainerApp) EnsureRunning(ctx context.Context, identifier string) error {
	running, err := a.containerService.IsContainerRunning(ctx, identifier)
	if err != nil {
		return err
	}

	if running {
		return nil
	}

	return fmt.Errorf("container %s is not running", identifier)
}
