package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/treasureuzoma/idolomerch-api/db"
)

func GetSummary(c *fiber.Ctx) error {
	var totalProducts, totalOrders int
	var totalRevenue float64

	err := db.DB.QueryRow(`SELECT COUNT(*) FROM products`).Scan(&totalProducts)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to count products"})
	}

	err = db.DB.QueryRow(`SELECT COUNT(*), COALESCE(SUM(amount_paid), 0) FROM orders`).Scan(&totalOrders, &totalRevenue)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to summarize orders"})
	}

	// sales grouped by day for the last 7 days
	rows, err := db.DB.Query(`
		SELECT DATE(created_at) AS day, SUM(amount_paid)
		FROM orders
		WHERE created_at >= NOW() - INTERVAL '7 days'
		GROUP BY day
		ORDER BY day ASC
	`)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch sales chart data"})
	}
	defer rows.Close()

	type SalesPoint struct {
		Date   string  `json:"date"`
		Amount float64 `json:"amount"`
	}

	var sales []SalesPoint
	for rows.Next() {
		var day time.Time
		var amount float64
		if err := rows.Scan(&day, &amount); err == nil {
			sales = append(sales, SalesPoint{
				Date:   day.Format("2006-01-02"),
				Amount: amount,
			})
		}
	}

	return c.JSON(fiber.Map{
		"totalProducts": totalProducts,
		"totalOrders":   totalOrders,
		"totalRevenue":  totalRevenue,
		"salesOverTime": sales,
	})
}
