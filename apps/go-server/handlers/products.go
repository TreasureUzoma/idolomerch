import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/treasureuzoma/idolomerch-api/store"
	"github.com/treasureuzoma/idolomerch-api/utils"
)

func GetProducts(c *fiber.Ctx) error {
	products := store.GetCachedProducts()
	search := strings.ToLower(c.Query("search"))

	if search != "" {
		filtered := make([]map[string]interface{}, 0)

		for _, product := range products {
			matched := false
			for _, value := range product {
				if strings.Contains(strings.ToLower(utils.ToString(value)), search) {
					matched = true
					break
				}
			}
			if matched {
				filtered = append(filtered, product)
			}
		}
		return c.JSON(filtered)
	}

	return c.JSON(products)
}
