package docker

import (
	"context"
	"fmt"

	dockerclient "github.com/moby/moby/client"
)

type Deamon struct {
	client *dockerclient.Client
}

func NewDeamon() (*Deamon, error) {
	cli, err := dockerclient.New(dockerclient.FromEnv)
	if err != nil {
		return nil, fmt.Errorf("failed to create docker client: %w", err)
	}

	_, err = cli.Ping(context.Background(), dockerclient.PingOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to ping docker daemon: %w", err)
	}

	return &Deamon{client: cli}, nil
}
