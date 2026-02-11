package docker

import (
	"context"
	"fmt"

	"github.com/moby/moby/client"
)

type DockerClient struct {
	Clx *client.Client
}

func (d *DockerClient) NewClient() (*DockerClient, error) {
	cli, err := client.New(client.FromEnv)
	if err != nil {
		return nil, err
	}
	_, pingError := cli.Ping(context.Background(), client.PingOptions{})
	if pingError != nil {
		return nil, fmt.Printf("cannot connect to docker demon")
	}
	return &DockerClient{Clx: cli}, nil
}
