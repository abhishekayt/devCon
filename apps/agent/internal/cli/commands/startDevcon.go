package commands

import (
	"context"
	"fmt"

	"github.com/abhishekkkk-15/devcon/agent/internal/app"
	"github.com/abhishekkkk-15/devcon/agent/internal/domain"
	"github.com/spf13/cobra"
)

func NewDevconCommand(containerApp *app.ContainerApp) *cobra.Command {

	image := "abhishekkkk-15/devcon:latest"
	var hostPort string
	var containerPort string = "3000"
	var name string = "devcon"

	cmd := &cobra.Command{
		Use:   "start",
		Short: "Start devcon local agent",
		RunE: func(cmd *cobra.Command, args []string) error {

			ctx := context.Background()

			cfg := &domain.ContainerCfg{
				Image:         image,
				Name:          name,
				ContainerPort: containerPort,
				HostPort:      hostPort,
			}

			id, err := containerApp.StartDevconWeb(ctx, cfg)
			if err != nil {
				return fmt.Errorf("failed to start devcon: %w", err)
			}

			fmt.Printf("🚀 Devcon started (container: %s)\n", id[:12])
			return nil
		},
	}

	cmd.Flags().StringVar(&hostPort, "p", "3000", "Host port")

	return cmd
}
