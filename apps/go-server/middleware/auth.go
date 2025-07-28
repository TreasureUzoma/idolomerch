package middleware

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func JWTMiddleware() fiber.Handler {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file in middleware")
	}
	return func(c *fiber.Ctx) error {
		tokenStr := c.Cookies("access_token")
		if tokenStr == "" {
			return c.Status(401).JSON(fiber.Map{"error": "No access token"})
		}

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid or expired token"})
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid token claims"})
		}

		email, ok := claims["email"].(string)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid token email"})
		}

		c.Locals("user", email)
		return c.Next()
	}
}
