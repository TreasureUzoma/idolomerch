package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/treasureuzoma/idolomerch-api/store"
)

func GetProducts(c *fiber.Ctx) error {
	products := store.GetCachedProducts()
	return c.JSON(products)
}