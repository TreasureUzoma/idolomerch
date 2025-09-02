package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	"github.com/treasureuzoma/idolomerch-api/db"
	"github.com/treasureuzoma/idolomerch-api/handlers"
	"github.com/treasureuzoma/idolomerch-api/middleware"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Failed to load .env")
	}

	db.Connect()

	app := fiber.New()

	adminDomain := os.Getenv("ADMIN_DOMAIN")
	log.Println(adminDomain)

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOriginsFunc: func(origin string) bool {
			return origin == "https://idolomerch.vercel.app" || origin == "http://localhost:3000" || origin == adminDomain
		},
	}))

	app.Options("/*", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusNoContent)
	})

	app.Options("/*", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusNoContent)
	})

	api := app.Group("/api/v1")

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Server is healthy",
		})
	})

	// public routes
	api.Post("/login", handlers.Login)
	api.Post("/logout", handlers.Logout)
	api.Post("/refresh", handlers.RefreshToken)
	api.Get("/products", handlers.GetProducts)
	api.Get("/products/:id", handlers.GetProductByID)

	// protected routes using JWT middleware
	protected := api.Use(middleware.JWTMiddleware())

	protected.Get("/me", handlers.Me)
	protected.Post("/upload-product", handlers.UploadProduct)
	protected.Put("/edit-product/:id", handlers.EditProduct)
	protected.Delete("/delete-product/:id", handlers.DeleteProduct)
	protected.Get("/summary", handlers.GetSummary)

	// not jwt protected
	api.Post("/monnify/webhook", handlers.MonnifyWebhook)

	port := ":5000"
	log.Printf("Server listening on %s", port)
	log.Fatal(app.Listen(port))
}
