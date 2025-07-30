package models

type ProductInput struct {
	Title        string         `json:"title" form:"title"`
	Description  string         `json:"description" form:"description"`
	Price        float64        `json:"price" form:"price"`
	Currency     string         `json:"currency" form:"currency"`
	Category     string         `json:"category" form:"category"`
	Image        string         `json:"image" form:"image"`
	Status       string         `json:"status" form:"status"`
	Stock        int            `json:"stock" form:"stock"`
	Options      ProductOptions `json:"options" form:"options"`    
	Tags         []string       `json:"tags" form:"tags"`               
	MoreDetails  []string       `json:"moreDetails" form:"moreDetails"`
}
