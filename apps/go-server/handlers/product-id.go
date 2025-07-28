package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/treasureuzoma/idolomerch-api/store"
)

func GetProductByID(c *fiber.Ctx) error {
	id := c.Params("id")
	products := store.GetCachedProducts()

	for _, product := range products {
		if product.ID == id {
			return c.JSON(product)
		}
	}

	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"error": "Product not found",
	})
}
