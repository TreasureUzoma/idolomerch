package models

type ProductInput struct {
	Title        string         `json:"title"`
	Description  string         `json:"description"`
	Price        float64        `json:"price"`
	Currency     string         `json:"currency"`
	Category     string         `json:"category"`
	Image        string         `json:"image"`        
	ImageBase64  string         `json:"imageBase64"`
	Status       string         `json:"status"`
	Stock        int            `json:"stock"`
	Options      ProductOptions `json:"options"`
	Tags         []string       `json:"tags"`
	MoreDetails  []string       `json:"moreDetails"`
}

