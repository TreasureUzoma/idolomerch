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
	var input struct {
		Title       string              `json:"title"`
		Description string              `json:"description"`
		Price       float64             `json:"price"`
		Currency    string              `json:"currency"`
		Category    string              `json:"category"`
		ImageBase64 string              `json:"imageBase64"`
		Status      string              `json:"status"`
		Stock       int                 `json:"stock"`
		Options     models.ProductOptions `json:"options"`
		Tags        []string            `json:"tags"`
		MoreDetails []string            `json:"moreDetails"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Upload image
	imageURL, err := utils.UploadBase64ToCloudinary(input.ImageBase64)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to upload image"})
	}

	// Generate slugified ID
	baseID := utils.GenerateSlug(input.Title)
	finalID := baseID

	// Ensure uniqueness
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

	// Convert complex fields to JSON
	optionsJSON, _ := json.Marshal(input.Options)
	tagsJSON, _ := json.Marshal(input.Tags)
	moreDetailsJSON, _ := json.Marshal(input.MoreDetails)

	// Insert into DB
	_, err = db.DB.Exec(`
		INSERT INTO products (id, title, description, price, currency, category, image, status, stock, options, tags, more_details)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
	`,
		finalID, input.Title, input.Description, input.Price, input.Currency,
		input.Category, imageURL, input.Status, input.Stock,
		optionsJSON, tagsJSON, moreDetailsJSON,
	)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "DB insert failed"})
	}

	return c.JSON(fiber.Map{
		"message": "Product uploaded successfully",
		"id":      finalID,
		"image":   imageURL,
	})
}
