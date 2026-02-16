package commands

import (
	"github.com/spf13/cobra"
)

var ListCmd = &cobra.Command{
	Use:   "list",
	Short: "List running containers",
	RunE: func(cmd *cobra.Command, args []string) error {

		return nil
	},
}
