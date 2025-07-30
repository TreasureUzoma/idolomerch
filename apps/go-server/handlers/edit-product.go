package handlers

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/treasureuzoma/idolomerch-api/db"
	"github.com/treasureuzoma/idolomerch-api/models"
	"github.com/treasureuzoma/idolomerch-api/utils"
)

func EditProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Product ID is required"})
	}

	var input models.ProductInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Fetch current image (if new one isn't provided)
	var currentImage string
	err := db.DB.QueryRow(`SELECT image FROM products WHERE id = $1`, id).Scan(&currentImage)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	}

	imageURL := currentImage

	// Upload new main image if base64 provided
	if strings.HasPrefix(input.ImageBase64, "data:") {
		imageURL, err = utils.UploadBase64ToCloudinary(input.ImageBase64)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to upload main image"})
		}
	}

	// Upload new color images if any are base64
	for i, color := range input.Options.Colors {
		if strings.HasPrefix(color.Image, "data:") {
			uploadedURL, err := utils.UploadBase64ToCloudinary(color.Image)
			if err != nil {
				return c.Status(500).JSON(fiber.Map{
					"error": fmt.Sprintf("Failed to upload image for color: %s", color.Name),
				})
			}
			input.Options.Colors[i].Image = uploadedURL
		}
	}

	// Marshal fields for DB
	optionsJSON, _ := json.Marshal(input.Options)
	tagsJSON, _ := json.Marshal(input.Tags)
	moreDetailsJSON, _ := json.Marshal(input.MoreDetails)

	// Update product
	_, err = db.DB.Exec(`
		UPDATE products
		SET title = $1, description = $2, price = $3, currency = $4,
			category = $5, image = $6, status = $7, stock = $8,
			options = $9, tags = $10, more_details = $11
		WHERE id = $12
	`,
		input.Title, input.Description, input.Price, input.Currency,
		input.Category, imageURL, input.Status, input.Stock,
		optionsJSON, tagsJSON, moreDetailsJSON, id,
	)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update product"})
	}

	return c.JSON(fiber.Map{
		"message": "Product updated successfully",
		"id":      id,
		"image":   imageURL,
	})
}
