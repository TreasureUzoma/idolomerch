package handlers

import (
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/treasureuzoma/idolomerch-api/db"
	"github.com/treasureuzoma/idolomerch-api/models"
	"github.com/treasureuzoma/idolomerch-api/utils"
)

func UploadProduct(c *fiber.Ctx) error {
	// Parse text fields
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

	// Parse main image file
	mainImageFile, err := c.FormFile("image")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Main image is required"})
	}
	mainImageURL, err := utils.UploadFileToCloudinary(mainImageFile)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to upload main image"})
	}

	// Parse tags
	var tags []string
	if tagsJSON != "" {
		if err := json.Unmarshal([]byte(tagsJSON), &tags); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid tags format"})
		}
	}

	// Parse moreDetails
	var moreDetails []string
	if moreDetailsJSON != "" {
		if err := json.Unmarshal([]byte(moreDetailsJSON), &moreDetails); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid moreDetails format"})
		}
	}

	// Parse options (including color names)
	var options models.ProductOptions
	if err := json.Unmarshal([]byte(optionsJSON), &options); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid options format"})
	}

	// Upload color images
	for i, color := range options.Colors {
		// The file input name must be in this format: options.colors.0.image, options.colors.1.image, etc.
		fieldName := fmt.Sprintf("options.colors.%d.image", i)
		file, err := c.FormFile(fieldName)
		if err == nil && file != nil {
			imageURL, err := utils.UploadFileToCloudinary(file)
			if err != nil {
				return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("Failed to upload image for color: %s", color.Name)})
			}
			options.Colors[i].Image = imageURL
		}
	}

	// Generate unique product ID
	baseID := utils.GenerateSlug(title)
	finalID := baseID
	counter := 1
	for {
		var exists bool
		err := db.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM products WHERE id = $1)`, finalID).Scan(&exists)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to check ID uniqueness"})
		}
		if !exists {
			break
		}
		finalID = fmt.Sprintf("%s-%d", baseID, counter)
		counter++
	}

	// Marshal options to JSON for DB
	optionsBytes, _ := json.Marshal(options)
	tagsBytes, _ := json.Marshal(tags)
	moreDetailsBytes, _ := json.Marshal(moreDetails)

	// Insert into DB
	_, err = db.DB.Exec(`
		INSERT INTO products (id, title, description, price, currency, category, image, status, stock, options, tags, more_details)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
	`,
		finalID, title, description, price, currency,
		category, mainImageURL, status, stock,
		optionsBytes, tagsBytes, moreDetailsBytes,
	)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "DB insert failed"})
	}

	return c.JSON(fiber.Map{
		"message": "Product uploaded successfully",
		"id":      finalID,
		"image":   mainImageURL,
	})
}
