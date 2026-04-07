package domain

import (
	"context"

	dockerclient "github.com/moby/moby/client"
)

type ContainerRepository interface {
	Ping(ctx context.Context) error
	ListContainers(ctx context.Context) (dockerclient.ContainerListResult, error)
	StartContainer(ctx context.Context, id string) error
	StopContainer(ctx context.Context, id string) error
	DeleteContainer(ctx context.Context, id string) error
	CreateContainer(ctx context.Context, cfg *ContainerCfg) (*dockerclient.ContainerCreateResult, error)
	InsepectContainer(ctx context.Context, ID string) (dockerclient.ContainerInspectResult, error)
}

type ContainerCfg struct {
	Image         string
	Name          string
	ContainerPort string // "3000"
	HostPort      string // "3000"
	Env           []string
}
type Container struct {
	ID     string
	Image  string
	Status string
}

type DevconStatus struct {
	ID             string
	Name           string
	Image          string
	State          string
	HostPort       string
	ContainerPort  string
	AlreadyExisted bool
}

type Resource struct {
	ID            string   `json:"id"`
	Name          string   `json:"name"`
	Image         string   `json:"image"`
	Type          string   `json:"type"`
	Status        string   `json:"status"`
	CreatedAt     int64    `json:"created_at"`
	HostPorts     []string `json:"host_ports"`
	ContainerPort []string `json:"container_ports"`
}
