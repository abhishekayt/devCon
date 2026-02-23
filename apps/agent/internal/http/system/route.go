package system

import (
	"github.com/gin-gonic/gin"
)

type SystemRouter struct {
	handler *SystemHandler
}

func NewSystemRouter(handler *SystemHandler) *SystemRouter {
	return &SystemRouter{handler: handler}

}

func (h *SystemRouter) SetupSysterRouter(router *gin.Engine) {
	router.GET("/stats", h.handler.SystemStatsHandler)
}
