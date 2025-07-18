package store

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/treasureuzoma/idolomerch-api/db"
	"github.com/treasureuzoma/idolomerch-api/models"
)

var (
	productCache     []models.Product
	cacheMutex       sync.RWMutex
	cacheLastUpdated time.Time
	cacheTTL         = 60 * time.Second
)

func GetCachedProducts() []models.Product {
	cacheMutex.RLock()
	if time.Since(cacheLastUpdated) < cacheTTL {
		defer cacheMutex.RUnlock()
		return productCache
	}
	cacheMutex.RUnlock()

	cacheMutex.Lock()
	defer cacheMutex.Unlock()

	rows, err := db.DB.Query(`SELECT id, title, description, price, currency, category, image, status, stock, options, tags, more_details, created_at FROM products`)
	if err != nil {
		log.Println("Failed to fetch products from DB:", err)
		return []models.Product{}
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		var optionsJSON, tagsJSON, moreDetailsJSON string

		err := rows.Scan(
			&p.ID, &p.Title, &p.Description, &p.Price, &p.Currency,
			&p.Category, &p.Image, &p.Status, &p.Stock,
			&optionsJSON, &tagsJSON, &moreDetailsJSON, &p.CreatedAt,
		)
		if err != nil {
			log.Println("Error scanning product:", err)
			continue
		}

		_ = json.Unmarshal([]byte(optionsJSON), &p.Options)
		_ = json.Unmarshal([]byte(tagsJSON), &p.Tags)
		_ = json.Unmarshal([]byte(moreDetailsJSON), &p.MoreDetails)

		products = append(products, p)
	}

	productCache = products
	cacheLastUpdated = time.Now()

	return productCache
}
