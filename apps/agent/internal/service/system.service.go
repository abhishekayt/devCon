package service

import (
	"context"

	"github.com/abhishekkkk-15/devcon/agent/internal/domain"
)

type SystemService struct {
	repo domain.SystemRepository
}

func NewSystemService(repo domain.SystemRepository) *SystemService {
	return &SystemService{repo: repo}
}

func (s *SystemService) GetSystemStats(ctx context.Context) (*domain.SystemStats, error) {
	return s.repo.GetSystemStats(ctx)
}
