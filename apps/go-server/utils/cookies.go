package utils

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
)

// SetCookie sets a JWT cookie with optional duration
func SetCookie(c *fiber.Ctx, name, value string, duration time.Duration) {
	secure := os.Getenv("ENV") == "production"

	c.Cookie(&fiber.Cookie{
		Name:     name,
		Value:    value,
		Expires:  time.Now().Add(duration),
		HTTPOnly: true,
		Secure:   secure,   // true in prod, false in dev
		SameSite: "Lax", 
		Path:     "/",
	})
}

func ClearCookie(c *fiber.Ctx, name string) {
	c.Cookie(&fiber.Cookie{
		Name:     name,
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HTTPOnly: true,
		Secure:   os.Getenv("ENV") == "production",
		SameSite: "Lax",
		Path:     "/",
	})
}
