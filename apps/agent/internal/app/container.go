package app

import "fmt"

type Container struct {
	ID     string
	Image  string
	Status string
}

type DockerManager interface {
	ListContainers() ([]Container, error)
	StartContainers(id string) error
	StopContainers(id string) error
}

type ContainerApp struct {
	docker DockerManager
}

func NewContainerApp(d DockerManager) *ContainerApp {
	return &ContainerApp{
		docker: d,
	}
}

func (d *ContainerApp) List() {
	container, err := d.docker.ListContainers()
	if err != nil {
		fmt.Printf("error while listing container")
	}
	fmt.Print(container)
}
