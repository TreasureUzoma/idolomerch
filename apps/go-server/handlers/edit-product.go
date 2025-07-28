package handlers

import (
	"encoding/json"
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

	// fetch current image (in case a new one isn't provided)
	var currentImage string
	err := db.DB.QueryRow(`SELECT image FROM products WHERE id = $1`, id).Scan(&currentImage)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	}

	imageURL := currentImage

	// Upload main product image if a new base64 is provided
	if input.ImageBase64 != "" {
		imageURL, err = utils.UploadBase64ToCloudinary(input.ImageBase64)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to upload main image"})
		}
	}

	// Upload variant images if they contain base64 strings
	for i := range input.Options.Variants {
		if input.Options.Variants[i].ImageBase64 != "" {
			url, err := utils.UploadBase64ToCloudinary(input.Options.Variants[i].ImageBase64)
			if err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Failed to upload variant image"})
			}
			input.Options.Variants[i].Image = url
		}
	}

	// Marshal fields to JSON for DB
	optionsJSON, _ := json.Marshal(input.Options)
	tagsJSON, _ := json.Marshal(input.Tags)
	moreDetailsJSON, _ := json.Marshal(input.MoreDetails)

	// Update the product record in DB
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
