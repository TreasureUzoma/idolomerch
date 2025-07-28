package handlers

import (
	"os"
	"time"

	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)


type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Test     bool   `json:"test"`
}


func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file in handlers/auth.go")
	}
}

func Login(c *fiber.Ctx) error {
	var input LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	if input.Email != os.Getenv("ADMIN_EMAIL") || input.Password != os.Getenv("ADMIN_PASSWORD") {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	accessToken, err := generateToken(input.Email, 15*time.Minute)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Access token failed"})
	}

	refreshToken, err := generateToken(input.Email, 7*24*time.Hour)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Refresh token failed"})
	}

	// Set cookies
	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Expires:  time.Now().Add(15 * time.Minute),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Lax",
	})
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Lax",
	})

	return c.JSON(fiber.Map{"message": "Login successful"})
}

func generateToken(email string, duration time.Duration) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(duration).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func Logout(c *fiber.Ctx) error {
	clear := func(name string) {
		c.Cookie(&fiber.Cookie{
			Name:     name,
			Value:    "",
			Expires:  time.Now().Add(-1 * time.Hour),
			HTTPOnly: true,
			Secure:   true,
			SameSite: "Lax",
		})
	}
	clear("access_token")
	clear("refresh_token")
	return c.JSON(fiber.Map{"message": "Logged out"})
}

func RefreshToken(c *fiber.Ctx) error {
	refresh := c.Cookies("refresh_token")
	if refresh == "" {
		return c.Status(401).JSON(fiber.Map{"error": "Missing refresh token"})
	}

	token, err := jwt.Parse(refresh, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid refresh token"})
	}

	claims := token.Claims.(jwt.MapClaims)
	email := claims["email"].(string)

	newAccess, err := generateToken(email, 15*time.Minute)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to generate new access token"})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    newAccess,
		Expires:  time.Now().Add(15 * time.Minute),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Lax",
	})

	return c.JSON(fiber.Map{"message": "Token refreshed"})
}


func Me(c *fiber.Ctx) error {
	user := c.Locals("user")
	if user == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	return c.JSON(fiber.Map{"user": user})
}

