package commands

import (
	"context"
	"fmt"

	"github.com/abhishekkkk-15/devcon/agent/internal/app"
	"github.com/spf13/cobra"
)

func NewListCmd(containerApp *app.ContainerApp) *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List containers",
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := context.Background()

			containers, err := containerApp.List(ctx)
			if err != nil {
				return err
			}

			for _, c := range containers {
				fmt.Println(c.ID, c.Image, c.Status)
			}

			return nil
		},
	}
}
