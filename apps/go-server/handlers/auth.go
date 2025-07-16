package handlers

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

var Store *session.Store

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Test     bool   `json:"test"`
}

func Login(c *fiber.Ctx) error {
	var input LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	if input.Email != os.Getenv("ADMIN_EMAIL") || input.Password != os.Getenv("ADMIN_PASSWORD") {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	sess, err := Store.Get(c)
	if err != nil {
		return err
	}

	sess.Set("user", input.Email)
	sess.Save()

	return c.JSON(fiber.Map{"message": "Login successful"})
}

func Logout(c *fiber.Ctx) error {
	sess, err := Store.Get(c)
	if err != nil {
		return err
	}
	sess.Destroy()
	return c.JSON(fiber.Map{"message": "Logged out"})
}

func Me(c *fiber.Ctx) error {
	sess, err := Store.Get(c)
	if err != nil {
		return err
	}
	user := sess.Get("user")
	if user == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	return c.JSON(fiber.Map{"user": user})
}
