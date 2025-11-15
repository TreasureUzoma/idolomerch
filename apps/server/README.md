# Idolomerch Server

This project is a robust e-commerce backend server built with Bun, Hono, and Drizzle ORM. It provides a comprehensive set of APIs for managing products, orders, and user authentication, including an administrative interface. The server incorporates features like rate limiting, currency conversion, and image uploads to Cloudinary.

## Features

- **Product Management**:
  - CRUD operations for products via admin API.
  - Public API for listing and retrieving product details, with filtering, sorting, and pagination.
  - Support for various product attributes like status, visibility, categories, inventory tracking, and images.
- **Order Management**:
  - API for creating new orders.
  - Admin API for viewing, updating (status, payment status), and deleting orders.
  - Detailed order information including shipping/billing addresses, user info, and payment methods.
- **User Authentication & Authorization**:
  - Admin login and signup functionalities.
  - Secure JWT-based authentication with access and refresh tokens.
  - Role-based authorization for admin routes.
- **Image Uploads**:
  - Integration with Cloudinary for single and multiple image uploads.
  - API for deleting uploaded images.
- **Currency Conversion**:
  - Automatic currency conversion for product prices and order totals using an external exchange rate API.
  - Caching of exchange rates using Redis.
- **Rate Limiting**:
  - Middleware to prevent abuse by limiting the number of requests per client using Redis.
- **Database Management**:
  - PostgreSQL database with Drizzle ORM for type-safe and efficient data interaction.
  - Defined schemas for users, products, orders, payments, and refresh tokens.
- **Error Handling**:
  - Centralized error handling and validation responses.
- **API Versioning**:
  - Organized API routes under `/api/v1`.

## Stacks / Technologies

| Technology           | Description                                                 | Link                                                      |
| :------------------- | :---------------------------------------------------------- | :-------------------------------------------------------- |
| **Bun**              | Fast all-in-one JavaScript runtime.                         | [Bun.sh](https://bun.sh/)                                 |
| **Hono**             | Ultrafast web framework for the Edge.                       | [Hono.dev](https://hono.dev/)                             |
| **TypeScript**       | Strongly typed superset of JavaScript.                      | [TypeScriptLang.org](https://www.typescriptlang.org/)     |
| **PostgreSQL**       | Powerful, open-source object-relational database system.    | [PostgreSQL.org](https://www.postgresql.org/)             |
| **Drizzle ORM**      | Headless TypeScript ORM for SQL databases.                  | [DrizzleORM.com](https://orm.drizzle.team/)               |
| **Neon**             | Serverless PostgreSQL database.                             | [Neon.tech](https://neon.tech/)                           |
| **Zod**              | TypeScript-first schema declaration and validation library. | [Zod.dev](https://zod.dev/)                               |
| **Redis**            | In-memory data structure store, used as a database, cache.  | [Redis.io](https://redis.io/)                             |
| **Cloudinary**       | Cloud-based image and video management.                     | [Cloudinary.com](https://cloudinary.com/)                 |
| **Hono JWT**         | JWT middleware for Hono.                                    | [Hono JWT](https://hono.dev/docs/helpers/jwt)             |
| **Dotenv**           | Loads environment variables from a `.env` file.             | [Dotenv npm](https://www.npmjs.com/package/dotenv)        |
| **ExchangeRate-API** | Provides currency exchange rates.                           | [ExchangeRate-API.com](https://www.exchangerate-api.com/) |

### API Endpoints

The API is versioned under `/api/v1`. Here are some of the key endpoints:

#### Public Endpoints

- **`GET /api/v1/health`**: Check server health.
- **`GET /api/v1/products`**: Get a list of active and public products. Supports query parameters for search, category, sort, pagination, and currency.
- **`GET /api/v1/products/:slug`**: Get details for a single product by its slug. Supports `currency` query parameter.
- **`POST /api/v1/orders`**: Create a new order.

#### Admin Endpoints (Require Authentication)

- **`POST /api/v1/admin/auth/login`**: Admin login.
- **`POST /api/v1/admin/auth/signup`**: Admin signup (usually for initial setup).
- **`POST /api/v1/admin/auth/logout`**: Admin logout.
- **`GET /api/v1/admin/products`**: Get a list of all products (including drafts, private, etc.). Supports query parameters for search, category, sort, pagination.
- **`POST /api/v1/admin/products`**: Create a new product.
- **`GET /api/v1/admin/products/:id`**: Get details for a single product by its ID.
- **`PUT /api/v1/admin/products/:id`**: Update an existing product.
- **`DELETE /api/v1/admin/products/:id`**: Delete a product.
- **`GET /api/v1/admin/orders`**: Get a list of all orders. Supports query parameters for search, pagination.
- **`GET /api/v1/admin/orders/:id`**: Get details for a single order by its ID.
- **`PUT /api/v1/admin/orders/:id`**: Update an existing order (e.g., status, payment status).
- **`DELETE /api/v1/admin/orders/:id`**: Delete an order.
- **`POST /api/v1/admin/upload`**: Upload a single image to Cloudinary.
- **`POST /api/v1/admin/upload-multiple`**: Upload multiple images to Cloudinary.
- **`DELETE /api/v1/admin/upload/delete`**: Delete an image from Cloudinary using its public ID.

## Contributing

We welcome contributions! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`.
3.  Make your changes.
4.  Commit your changes: `git commit -m 'feat: Add new feature'`.
5.  Push to your branch: `git push origin feature/your-feature-name`.
6.  Open a Pull Request.

[![Readme was generated by Readmit](https://img.shields.io/badge/Readme%20was%20generated%20by-Readmit-brightred)](https://readmit.vercel.app)
