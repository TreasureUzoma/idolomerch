package main

import (
	"log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/joho/godotenv"
	"github.com/treasureuzoma/idolomerch-api/handlers"
	"github.com/treasureuzoma/idolomerch-api/middleware"

)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Failed to load .env")
	}

	app := fiber.New()

	// create session store
	store := session.New()
	handlers.Store = store // share it with handler package

	api := app.Group("/api/v1")

	api.Get("/health", func(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Server is healthy",
	})
})

	api.Post("/login", handlers.Login)
	api.Post("/logout", handlers.Logout)
	api.Get("/me", middleware.RequireAuth(store), handlers.Me)
	api.Get("/products", handlers.GetProducts)
	api.Post("/upload-product",  middleware.RequireAuth(store), handlers.UploadProduct)

	log.Fatal(app.Listen(":3001"))
}
