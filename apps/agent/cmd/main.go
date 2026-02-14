package main

import (
	"fmt"

	"github.com/abhishekkkk-15/devcon/agent/internal/app"
	"github.com/abhishekkkk-15/devcon/agent/internal/docker"
	"github.com/abhishekkkk-15/devcon/agent/internal/service"
)

func main() {
	daemon, _ := docker.NewDaemon()
	dockerApp := app.NewContainerApp(daemon)
	dockerApp.List()
	// cfg := domain.ContainerCfg{
	// 	Image:         "abhishekkkk-15/devcon",
	// 	Name:          "devcon-frontend",
	// 	ContainerPort: "3000",
	// 	HostPort:      "3000",
	// }
	// id, err := dockerApp.StartDevconWeb(&cfg)
	// if err != nil {
	// 	fmt.Errorf("Error while starting devcon %w", err)
	// }
	// fmt.Printf("ID: %s", id)
	// dockerApp.Start(id)
	fmt.Println()
	systemApp := service.NewSystenService()
	stats, _ := systemApp.GetSystemStats()
	fmt.Print(stats)
}
