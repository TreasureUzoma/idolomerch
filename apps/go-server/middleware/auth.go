package middleware

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/treasureuzoma/idolomerch-api/handlers"
	"github.com/treasureuzoma/idolomerch-api/utils"
)

func JWTMiddleware() fiber.Handler {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file in middleware")
	}

	jwtSecret := []byte(os.Getenv("JWT_SECRET"))

	return func(c *fiber.Ctx) error {
		accessToken := c.Cookies("access_token")
		refreshToken := c.Cookies("refresh_token")

		// case: no tokens at all
		if accessToken == "" && refreshToken == "" {
			return c.Status(401).JSON(fiber.Map{"error": "Not authenticated"})
		}

		// try to parse access token
		if accessToken != "" {
			token, err := jwt.Parse(accessToken, func(t *jwt.Token) (interface{}, error) {
				return jwtSecret, nil
			})
			if err == nil && token.Valid {
				if claims, ok := token.Claims.(jwt.MapClaims); ok {
					if email, ok := claims["email"].(string); ok {
						c.Locals("user", email)
						return c.Next()
					}
				}
			}
		}

		// no valid access token, try refresh token
		if refreshToken != "" {
			claims, err := parseJWT(refreshToken)
			if err != nil {
				return c.Status(401).JSON(fiber.Map{"error": "Invalid refresh token"})
			}
			email := claims["email"].(string)

			newAccess, _ := handlers.GenerateToken(email, 15*time.Minute)
			newRefresh, _ := handlers.GenerateToken(email, 7*24*time.Hour)

			// use helper
			utils.SetCookie(c, "access_token", newAccess, 15*time.Minute)
			utils.SetCookie(c, "refresh_token", newRefresh, 7*24*time.Hour)

			c.Locals("user", email)
			return c.Next()
		}

		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
}

func parseJWT(tokenStr string) (map[string]interface{}, error) {
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, err
	}
	return claims, nil
}
