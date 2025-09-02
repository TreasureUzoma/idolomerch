package middleware

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
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
			token, err := jwt.Parse(refreshToken, func(t *jwt.Token) (interface{}, error) {
				return jwtSecret, nil
			})
			if err != nil || !token.Valid {
				return c.Status(401).JSON(fiber.Map{"error": "Invalid refresh token"})
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				return c.Status(401).JSON(fiber.Map{"error": "Invalid refresh token claims"})
			}

			email, ok := claims["email"].(string)
			if !ok {
				return c.Status(401).JSON(fiber.Map{"error": "Invalid refresh token email"})
			}

			// generate new access token
			newAccess := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"email": email,
				"exp":   time.Now().Add(time.Minute * 15).Unix(), 
			})

			newAccessStr, err := newAccess.SignedString(jwtSecret)
			if err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Could not create new access token"})
			}

			// rotate refresh token
			newRefresh := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"email": email,
				"exp":   time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
			})
			newRefreshStr, _ := newRefresh.SignedString(jwtSecret)

			// set cookies again
			c.Cookie(&fiber.Cookie{
				Name:     "access_token",
				Value:    newAccessStr,
				HTTPOnly: true,
				Secure:   true,
				Path:     "/",
				Expires:  time.Now().Add(time.Minute * 15),
			})
			c.Cookie(&fiber.Cookie{
				Name:     "refresh_token",
				Value:    newRefreshStr,
				HTTPOnly: true,
				Secure:   true,
				Path:     "/",
				Expires:  time.Now().Add(time.Hour * 24 * 7),
			})

			c.Locals("user", email)
			return c.Next()
		}

		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
}
