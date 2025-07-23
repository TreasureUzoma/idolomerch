**Idolomerch API 🛍️**

This project delivers a robust and efficient backend API built with Go, designed to power an e-commerce platform. It handles essential operations like product management, secure authentication, processing payment webhooks (Monnify), and providing insightful sales analytics. Engineered for performance and scalability, it features an in-memory product cache and seamless integration with Cloudinary for image uploads and Telegram for real-time order notifications.

## Usage

To get this API up and running, you'll need to set up your environment variables, initialize the database, and then you can either run it directly or via Docker.

### 1. Environment Configuration

First, create a `.env` file in the root of the project (`apps/go-server/`) by copying the `.env.example` and filling in the details. This file will hold all your sensitive credentials and API keys.

```dotenv
# Your PostgreSQL database connection URL (e.g., from Neon.tech or local setup)
DB_URL=

# Admin credentials for API access
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password

# JWT secrets for authentication (generate strong, random strings)
JWT_SECRET=super_secret_jwt_key

# Cloudinary API details for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Monnify payment details (if using Monnify for payments)
MONNIFY_CLIENT_SECRET=your_monnify_client_secret

# Telegram bot details to receive order notifications
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Admin URL
ADMIN_DOMAIN=
```

### 2. Database Setup

This API uses PostgreSQL. Ensure you have a PostgreSQL database accessible via the `DB_URL` environment variable. The application expects `products` and `orders` tables. A basic schema might look like this (you'd typically use a migration tool in a production setup):

```sql
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    category VARCHAR(255),
    image VARCHAR(255),
    status VARCHAR(50),
    stock INTEGER,
    options JSONB,
    tags JSONB,
    more_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    transaction_ref VARCHAR(255) UNIQUE NOT NULL,
    payment_ref VARCHAR(255),
    product_id VARCHAR(255) REFERENCES products(id),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    amount_paid DECIMAL(10, 2),
    quantity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Running the Application

- **Locally with Go:**
  Make sure you have Go installed (version 1.24.3 or higher, as per `go.mod`).

  ```bash
  # Navigate to the project root
  cd apps/go-server

  # Download dependencies
  go mod tidy

  # Run the application
  go run main.go
  ```

  The server will start on port `3001` (or whatever you configure). You can use `air` for hot reloading during development, configured via `air.toml`.

- **With Docker:**
  Ensure Docker is installed on your system.

  ```bash
  # Navigate to the project root
  cd apps/go-server

  # Build the Docker image
  docker build -t idolomerch-api .

  # Run the Docker container
  docker run -p 3001:8080 --env-file .env idolomerch-api
  ```

  The application inside the container runs on port `8080`, mapped to `3001` on your host. Remember to pass your `.env` file!

### 4. API Endpoints

Here's a quick overview of some key endpoints:

- `GET /api/v1/health` - Check server health.
- `POST /api/v1/login` - Authenticate as an admin.
- `GET /api/v1/me` - Get current authenticated user (requires session).
- `POST /api/v1/upload-product` - Add a new product (requires authentication).
- `PUT /api/v1/edit-product/:id` - Update an existing product (requires authentication).
- `DELETE /api/v1/delete-product/:id` - Remove a product (requires authentication).
- `GET /api/v1/products` - Retrieve all products, with optional search.
- `GET /api/v1/summary` - Get sales and product summary (requires authentication).
- `POST /api/v1/monnify/webhook` - Monnify payment webhook listener.

## Features

✨ **Secure Admin Authentication**: Implemented robust session-based authentication for administrative actions, protecting sensitive operations like product management.
📦 **Comprehensive Product Management**: Full CRUD capabilities allowing for seamless creation, retrieval, updates, and deletion of product listings, including details like inventory, options, and tags.
💸 **Payment Gateway Integration**: Built-in webhook handler for Monnify, securely processing payment confirmations and preventing duplicate transactions.
📊 **Real-time Order Notifications**: Automated Telegram bot integration to deliver instant alerts for new payment receipts, ensuring timely awareness of incoming orders.
📈 **Admin Dashboard Summaries**: Provides key insights with aggregated data on total products, orders, revenue, and daily sales trends over the past week.
🚀 **Performance Optimization**: Employs an in-memory caching mechanism for product listings, significantly reducing database load and improving response times for read operations.
🖼️ **Cloud Image Storage**: Integrates with Cloudinary for efficient and scalable storage of product images via base64 uploads.
🔗 **SEO-Friendly Slugs**: Automatically generates unique, clean, and human-readable slugs for product IDs, aiding in better URL structures.
🐳 **Containerized Deployment**: Dockerfile included for easy and consistent deployment across various environments.

## Technologies Used

| Category             | Technology       | Description                                                 | Link                                                         |
| :------------------- | :--------------- | :---------------------------------------------------------- | :----------------------------------------------------------- |
| **Backend**          | Go (Golang)      | Primary programming language                                | [go.dev](https://go.dev/)                                    |
| **Web Framework**    | Fiber            | Express-inspired web framework for Go                       | [gofiber.io](https://gofiber.io/)                            |
| **Database**         | PostgreSQL       | Relational database for data persistence                    | [postgresql.org](https://www.postgresql.org/)                |
| **DB Driver**        | pq               | Pure Go PostgreSQL driver                                   | [github.com/lib/pq](https://github.com/lib/pq)               |
| **Containerization** | Docker           | Platform for developing, shipping, and running applications | [docker.com](https://www.docker.com/)                        |
| **Env Management**   | GoDotEnv         | Loads environment variables from `.env` files               | [github.com/joho/godotenv](https://github.com/joho/godotenv) |
| **Image Storage**    | Cloudinary       | Cloud-based image and video management                      | [cloudinary.com](https://cloudinary.com/)                    |
| **Payment Gateway**  | Monnify          | Payment processing service (webhook integration)            | [monnify.com](https://monnify.com/)                          |
| **Notifications**    | Telegram Bot API | Sending automated messages                                  | [core.telegram.org](https://core.telegram.org/bots/api)      |
| **Hot Reload**       | Air              | Live reload for Go applications                             | [github.com/cosmtrek/air](https://github.com/cosmtrek/air)   |

## License

This project is currently licensed under MIT.

## Badges

![Go](https://img.shields.io/badge/Go-1.24.3-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Fiber](https://img.shields.io/badge/Fiber-v2.52.8-00ADD8?style=for-the-badge&logo=fiber&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
