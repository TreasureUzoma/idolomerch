package handlers

import (
	"encoding/json"
	"fmt"
	
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

	// Parse form fields
	title := c.FormValue("title")
	description := c.FormValue("description")
	price := c.FormValue("price")
	currency := c.FormValue("currency")
	category := c.FormValue("category")
	status := c.FormValue("status")
	stock := c.FormValue("stock")
	tagsJSON := c.FormValue("tags")
	moreDetailsJSON := c.FormValue("moreDetails")
	optionsJSON := c.FormValue("options")

	// Get current image
	var currentImage string
	err := db.DB.QueryRow(`SELECT image FROM products WHERE id = $1`, id).Scan(&currentImage)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	}
	imageURL := currentImage

	// Handle new image upload (if any)
	mainImageFile, err := c.FormFile("image")
	if err == nil && mainImageFile != nil {
		imageURL, err = utils.UploadFileToCloudinary(mainImageFile)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to upload main image"})
		}
	}

	// Parse JSON fields
	var tags []string
	if tagsJSON != "" {
		if err := json.Unmarshal([]byte(tagsJSON), &tags); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid tags format"})
		}
	}

	var moreDetails []string
	if moreDetailsJSON != "" {
		if err := json.Unmarshal([]byte(moreDetailsJSON), &moreDetails); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid moreDetails format"})
		}
	}

	var options models.ProductOptions
	if err := json.Unmarshal([]byte(optionsJSON), &options); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid options format"})
	}

	// Upload new color images (if any)
	for i, color := range options.Colors {
		fieldName := fmt.Sprintf("options.colors.%d.image", i)
		colorImageFile, err := c.FormFile(fieldName)
		if err == nil && colorImageFile != nil {
			uploadedURL, err := utils.UploadFileToCloudinary(colorImageFile)
			if err != nil {
				return c.Status(500).JSON(fiber.Map{
					"error": fmt.Sprintf("Failed to upload image for color: %s", color.Name),
				})
			}
			options.Colors[i].Image = uploadedURL
		}
	}

	// Marshal for DB
	optionsBytes, _ := json.Marshal(options)
	tagsBytes, _ := json.Marshal(tags)
	moreDetailsBytes, _ := json.Marshal(moreDetails)

	// Update DB
	_, err = db.DB.Exec(`
		UPDATE products
		SET title = $1, description = $2, price = $3, currency = $4,
			category = $5, image = $6, status = $7, stock = $8,
			options = $9, tags = $10, more_details = $11
		WHERE id = $12
	`,
		title, description, price, currency,
		category, imageURL, status, stock,
		optionsBytes, tagsBytes, moreDetailsBytes, id,
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
