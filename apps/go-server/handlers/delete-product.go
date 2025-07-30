package handlers

import (
	"fmt"
	"net/url"
	"path"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/treasureuzoma/idolomerch-api/db"
	// "github.com/treasureuzoma/idolomerch-api/utils"
)

func DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Product ID is required"})
	}

	var imageURL string
	err := db.DB.QueryRow(`SELECT image FROM products WHERE id = $1`, id).Scan(&imageURL)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Product not found"})
	}

	publicID, err := extractCloudinaryPublicID(imageURL)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to extract image public ID"})
	}

	/* err = utils.DeleteImageFromCloudinary(publicID)
	 if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete image from Cloudinary"})
	} */

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

func extractCloudinaryPublicID(imageURL string) (string, error) {
	parsedURL, err := url.Parse(imageURL)
	if err != nil {
		return "", err
	}

	fileName := path.Base(parsedURL.Path)
	ext := path.Ext(fileName)
	publicID := strings.TrimSuffix(fileName, ext)

	dir := path.Dir(parsedURL.Path)
	if dir != "/" {
		publicID = strings.TrimPrefix(dir, "/") + "/" + publicID
	}

	return publicID, nil
}
