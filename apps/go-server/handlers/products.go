package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/treasureuzoma/idolomerch-api/db"
)

func GetProducts(c *fiber.Ctx) error {
	products := db.GetCachedProducts()
	return c.JSON(products)
}
