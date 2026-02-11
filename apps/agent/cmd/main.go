package main

import (
	"github.com/abhishekkkk-15/devcon/agent/internal/app"
	"github.com/abhishekkkk-15/devcon/agent/internal/docker"
)

func main() {
	deamon, _ := docker.NewDeamon()
	dockerApp := app.NewContainerApp(deamon)
	dockerApp.List()
}
