package app

import (
	"fmt"
	"time"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/host"
	"github.com/shirou/gopsutil/v3/mem"
)

func CpuStats() {
	info, _ := cpu.Info()
	for _, cpu := range info {
		fmt.Println("Model:", cpu.ModelName)
		fmt.Println("Cores:", cpu.Cores)
		fmt.Println("Mhz:", cpu.Mhz)
	}
}

func MemStats() {
	v, _ := mem.VirtualMemory()

	fmt.Println("Total:", v.Total/1024/1024, "MB")
	fmt.Println("Available:", v.Available/1024/1024, "MB")
	fmt.Println("Used Percent:", v.UsedPercent)
}

func DistStats() {
	partitions, err := disk.Partitions(false)
	if err != nil {
		panic(err)
	}

	var total uint64
	var used uint64

	for _, p := range partitions {
		usage, err := disk.Usage(p.Mountpoint)
		if err != nil {
			continue
		}

		total += usage.Total
		used += usage.Used
	}

	fmt.Println("Total Storage:", total/1024/1024/1024, "GB")
	fmt.Println("Used Storage:", used/1024/1024/1024, "GB")
	fmt.Println("Free Storage:", (total-used)/1024/1024/1024, "GB")
}

func HostStats() {
	info, _ := host.Info()

	fmt.Println("Hostname:", info.Hostname)
	fmt.Println("OS:", info.OS)
	fmt.Println("Platform:", info.Platform)
	fmt.Println("Platform Version:", info.PlatformVersion)
	fmt.Println("Kernel Version:", info.KernelVersion)
}

func LiveStats() {
	for {
		percent, _ := cpu.Percent(time.Second, false)
		fmt.Println("CPU Usage:", percent[0], "%")
	}
}
