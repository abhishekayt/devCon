package cli

import (
	"os"

	"github.com/abhishekkkk-15/devcon/agent/internal/cli/commands"
	"github.com/spf13/cobra"
)

var verion = "0.1.0"

var rootCmd = &cobra.Command{
	Use:     "devcon",
	Short:   "local/cloud dev controll panel for docker",
	Long:    "DevCon a local-first developer control plane for managing containers via an agent, built to simulate real-world PaaS workflows.",
	Version: verion,
}

func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
	rootCmd.AddCommand(commands.ListCmd)
}
