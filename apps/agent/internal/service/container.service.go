package service

import (
	"context"
	"fmt"

	"github.com/abhishekkkk-15/devcon/agent/internal/domain"
)

type ContainerService struct {
	repo domain.ContainerRepository
}

func NewContainerService(repo domain.ContainerRepository) *ContainerService {
	return &ContainerService{repo: repo}
}

func (c *ContainerService) PingDaemon(ctx context.Context) error {
	return c.repo.Ping(ctx)
}

func (c *ContainerService) ListContainers(ctx context.Context) ([]domain.Container, error) {
	return c.repo.ListContainers(ctx)
}

func (c *ContainerService) StartContainer(ctx context.Context, id string) error {
	return c.repo.StartContainer(ctx, id)
}
func (c *ContainerService) StopContainer(ctx context.Context, id string) error {
	return c.repo.StopContainer(ctx, id)
}

func (c *ContainerService) CreateContainer(ctx context.Context, cfg *domain.ContainerCfg) (string, error) {
	res, err := c.repo.CreateContainer(ctx, cfg)
	if err != nil {
		return "", err
	}

	return res.ID, nil
}

func (c *ContainerService) IsContainerRunning(ctx context.Context, identifier string) (bool, error) {
	containers, err := c.repo.ListContainers(ctx)
	if err != nil {
		return false, err
	}

	for _, cont := range containers {
		if cont.Image == identifier || cont.ID == identifier {
			return true, nil
		}
	}
	return false, nil
}
func (s *ContainerService) StartDevconIfNotRunning(
	ctx context.Context,
	cfg *domain.ContainerCfg,
) (string, error) {

	running, err := s.IsContainerRunning(ctx, cfg.Image)
	if err != nil {
		return "", err
	}

	if running {
		return "", fmt.Errorf("devcon container is already running")
	}

	res, err := s.repo.CreateContainer(ctx, cfg)
	if err != nil {
		return "", err
	}

	return res.ID, nil
}
