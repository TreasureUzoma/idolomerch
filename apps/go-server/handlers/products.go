package handlers

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/treasureuzoma/idolomerch-api/models"
	"github.com/treasureuzoma/idolomerch-api/store"
)

func GetProducts(c *fiber.Ctx) error {
	products := store.GetCachedProducts()
	search := strings.ToLower(c.Query("search"))

	if search != "" {
		filtered := make([]models.Product, 0)

		for _, product := range products {
			// manually check relevant fields (adjust as needed)
			if strings.Contains(strings.ToLower(product.Title), search) ||
				strings.Contains(strings.ToLower(product.Description), search) ||
				strings.Contains(strings.ToLower(product.Category), search) ||
				strings.Contains(strings.ToLower(product.Currency), search) {
				filtered = append(filtered, product)
			}
		}
		return c.JSON(filtered)
	}

	return c.JSON(products)
}
