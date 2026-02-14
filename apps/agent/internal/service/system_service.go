package service

import (
	"time"

	"github.com/abhishekkkk-15/devcon/agent/internal/domain"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/host"
	"github.com/shirou/gopsutil/v3/mem"
)

type SystemService struct{}

func NewSystenService() *SystemService {
	return &SystemService{}
}

func (s *SystemService) GetSystemStats() (*domain.SystemStats, error) {
	// CPU Info
	cpuInfo, err := cpu.Info()
	if err != nil {
		return nil, err
	}
	cpuUsage, err := cpu.Percent(time.Second, false)
	if err != nil {
		return nil, err
	}
	// Memory
	memInfo, err := mem.VirtualMemory()
	if err != nil {
		return nil, err
	}
	// Disk (root only to avoid double count)
	diskInfo, err := disk.Usage("C:\\")
	if err != nil {
		return nil, err
	}
	// Host
	hostInfo, err := host.Info()
	if err != nil {
		return nil, err
	}
	stats := &domain.SystemStats{
		CPU: domain.CPUInfo{
			Model: cpuInfo[0].ModelName,
			Cores: cpuInfo[0].Cores,
			Mhz:   cpuInfo[0].Mhz,
			Usage: cpuUsage[0],
		},
		Memory: domain.MemoryInfo{
			TotalGB:     float64(memInfo.Total) / 1024 / 1024 / 1024,
			UsedGB:      float64(memInfo.Used) / 1024 / 1024 / 1024,
			UsedPercent: memInfo.UsedPercent,
		},
		Disk: domain.DiskInfo{
			TotalGB:     float64(diskInfo.Total) / 1024 / 1024 / 1024,
			UsedGB:      float64(diskInfo.Used) / 1024 / 1024 / 1024,
			FreeGB:      float64(diskInfo.Free) / 1024 / 1024 / 1024,
			UsedPercent: diskInfo.UsedPercent,
		},
		Host: domain.HostInfo{
			Hostname: hostInfo.Hostname,
			OS:       hostInfo.OS,
			Platform: hostInfo.Platform,
			Version:  hostInfo.PlatformVersion,
		},
	}
	return stats, nil
}
