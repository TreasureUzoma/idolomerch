package models

import (
	"encoding/json"
)

type Product struct {
	ID          string         `json:"id"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Price       float64        `json:"price"`
	Currency    string         `json:"currency"`
	Category    string         `json:"category"`
	Image       string         `json:"image"`
	Status      string         `json:"status"`
	Stock       int            `json:"stock"`
	Options     ProductOptions `json:"options"`
	Tags        []string       `json:"tags"`
	MoreDetails []string       `json:"moreDetails"`
	CreatedAt   string         `json:"created_at"`
}

type ProductOptions struct {
	Sizes  []string      `json:"sizes,omitempty"`
	Colors []ColorOption `json:"colors,omitempty"`
}

type ColorOption struct {
	Name  string `json:"name"`
	Image string `json:"image"`
}
