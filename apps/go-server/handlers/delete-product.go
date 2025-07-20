package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/treasureuzoma/idolomerch-api/db"
)

func DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")

	if id == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Product ID is required"})
	}

	result, err := db.DB.Exec(`DELETE FROM products WHERE id = $1`, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete product"})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	}

	return c.JSON(fiber.Map{"message": "Product deleted successfully", "id": id})
}
