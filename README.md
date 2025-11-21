# idolomerch - E-commerce Monorepo

`idolomerch` is a comprehensive e-commerce platform built as a monorepo, featuring a customer-facing web store, an administrative dashboard, and a robust backend API. It leverages modern web technologies to provide a fast, scalable, and type-safe development experience.

## Features

**Web Store (Customer-facing)**
*   **Product Browsing**: Users can browse a wide range of products with detailed descriptions, image galleries, and quantity selection.
*   **Shopping Cart**: Fully functional shopping cart allowing users to add, remove, and update product quantities.
*   **Crypto Checkout**: Secure checkout process integrated with NOWPayments for cryptocurrency payments.
*   **Dynamic Currency Selection**: Users can select their preferred currency, with automatic conversion of product prices and order totals.
*   **Responsive Design**: A seamless shopping experience across various devices.
*   **Theme Toggling**: Supports light and dark modes for user preference.

**Admin Dashboard**
*   **Product Management**: Comprehensive CRUD (Create, Read, Update, Delete) operations for products, including managing details, inventory, categories, and images.
*   **Order Management**: View and update order statuses (e.g., pending, processing, shipped, delivered) and payment statuses.
*   **Secure Authentication**: Admin login and logout with JWT-based authentication for secure access.
*   **Session Management**: Persistent admin sessions for a smooth workflow.

**Backend API**
*   **Product API**: Public endpoints for listing and retrieving product details with filtering, sorting, and pagination. Admin endpoints for full product lifecycle management.
*   **Order API**: Public endpoint for creating new orders. Admin endpoints for viewing, updating, and deleting orders.
*   **Admin Authentication & Authorization**: Secure JWT-based authentication with access and refresh tokens, supporting role-based authorization.
*   **Image Uploads**: Integration with Cloudinary for efficient storage and management of product images, supporting single and multiple uploads as well as deletion.
*   **Currency Conversion**: Automatic currency conversion for product prices and order totals using an external exchange rate API, with caching via Redis for performance.
*   **Rate Limiting**: Middleware implemented with Redis to protect API endpoints from abuse.
*   **Database Management**: PostgreSQL database managed with Drizzle ORM for type-safe and efficient data interaction, deployed serverlessly with Neon.
*   **Webhooks**: Integration with NOWPayments for processing payment status updates.
*   **Centralized Error Handling**: Consistent error responses and validation messages.
*   **API Versioning**: Organized routes under `/api/v1`.

## Stacks / Technologies

| Category           | Technology           | Description                                                                 | Link                                                      |
| :----------------- | :------------------- | :-------------------------------------------------------------------------- | :-------------------------------------------------------- |
| **Monorepo**       | TurboRepo            | High-performance build system for JavaScript and TypeScript monorepos.      | [TurboRepo.org](https://turbo.build/)                     |
|                    | pnpm                 | Fast, disk space efficient package manager.                                 | [pnpm.io](https://pnpm.io/)                               |
| **Backend**        | Bun                  | Fast all-in-one JavaScript runtime.                                         | [Bun.sh](https://bun.sh/)                                 |
|                    | Hono                 | Ultrafast web framework for the Edge.                                       | [Hono.dev](https://hono.dev/)                             |
|                    | Drizzle ORM          | Headless TypeScript ORM for SQL databases.                                  | [DrizzleORM.com](https://orm.drizzle.team/)               |
|                    | PostgreSQL           | Powerful, open-source object-relational database system.                    | [PostgreSQL.org](https://www.postgresql.org/)             |
|                    | Neon                 | Serverless PostgreSQL database.                                             | [Neon.tech](https://neon.tech/)                           |
|                    | Redis                | In-memory data structure store, used as a database, cache.                  | [Redis.io](https://redis.io/)                             |
|                    | Cloudinary           | Cloud-based image and video management.                                     | [Cloudinary.com](https://cloudinary.com/)                 |
|                    | Hono JWT             | JWT middleware for Hono.                                                    | [Hono JWT](https://hono.dev/docs/helpers/jwt)             |
|                    | Dotenv               | Loads environment variables from a `.env` file.                             | [Dotenv npm](https://www.npmjs.com/package/dotenv)        |
|                    | ExchangeRate-API     | Provides currency exchange rates.                                           | [ExchangeRate-API.com](https://www.exchangerate-api.com/) |
|                    | NOWPayments          | Crypto payment gateway integration.                                         | [NOWPayments.io](https://nowpayments.io/)                 |
| **Frontend (Web)** | Next.js              | React framework for production.                                             | [Nextjs.org](https://nextjs.org/)                         |
|                    | React                | JavaScript library for building user interfaces.                            | [React.dev](https://react.dev/)                           |
|                    | Zustand              | Small, fast and scalable bear-necessities state-management.                 | [Zustand-Docs.pmnd.rs](https://zustand-docs.pmnd.rs/)     |
|                    | next-themes          | Abstraction for themes in Next.js apps.                                     | [next-themes GitHub](https://github.com/pacocoursey/next-themes) |
|                    | Numeral.js           | Library for formatting and manipulating numbers.                            | [Numeraljs.com](http://numeraljs.com/)                    |
|                    | react-country-flag   | React component for displaying country flags.                               | [react-country-flag GitHub](https://github.com/mjody/react-country-flag) |
| **Frontend (Admin)** | Tanstack Query       | Powerful asynchronous state management for TS/JS.                           | [Tanstack Query](https://tanstack.com/query)              |
|                    | React Hook Form      | Performant, flexible, and extensible forms with easy-to-use validation.     | [React Hook Form](https://react-hook-form.com/)           |
|                    | Sonner               | An opinionated toast component for React.                                   | [Sonner GitHub](https://github.com/emilkowalski/sonner)  |
|                    | react-dropzone       | Simple React hook to create a HTML5 drag-n-drop zone.                       | [React Dropzone GitHub](https://github.com/react-dropzone/react-dropzone) |
| **Shared**         | TypeScript           | Strongly typed superset of JavaScript.                                      | [TypeScriptLang.org](https://www.typescriptlang.org/)     |
|                    | Zod                  | TypeScript-first schema declaration and validation library.                 | [Zod.dev](https://zod.dev/)                               |
|                    | shadcn/ui            | Reusable components built using Radix UI and Tailwind CSS.                  | [shadcn/ui](https://ui.shadcn.com/)                       |
|                    | Tailwind CSS         | Utility-first CSS framework.                                                | [TailwindCSS.com](https://tailwindcss.com/)               |
|                    | Class-variance-authority | Utility for creating variant-based component styles.                        | [cva GitHub](https://github.com/joe-bell/cva)             |
|                    | clsx                 | Tiny utility for constructing `className` strings conditionally.            | [clsx GitHub](https://github.com/lukeed/clsx)             |
|                    | tailwind-merge       | Utility to merge Tailwind CSS classes without style conflicts.              | [tailwind-merge GitHub](https://github.com/dcastil/tailwind-merge) |
|                    | Lucide React         | A simply beautiful open-source icon toolkit.                                | [Lucide.dev](https://lucide.dev/)                         |
|                    | Axios                | Promise-based HTTP client.                                                  | [Axios GitHub](https://github.com/axios/axios)            |

## Installation

To get `idolomerch` up and running on your local machine, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/treasureuzoma/idolomerch.git
cd idolomerch
```

### 2. Install Dependencies

This project uses `pnpm` as its package manager. Ensure you have `pnpm` installed globally (`npm install -g pnpm`).

```bash
pnpm install
```

### 3. Environment Variables

Create `.env` files for the `server` and `admin-dashboard` applications. You can use the provided `.env.example` files as a template.

**Root `.env.example`** (For `pnpm-workspace.yaml` packages and global settings)

```
APP_URL=http://localhost:3000

# generate yours from https://generate-secret.vercel.app/32
JWT_REFRESH_SECRET=
JWT_ACCESS_SECRET=
ENCRYPTION_KEY=

# generate your own database url for postgresql eg. from neon.tech
DB_URL=

# generate urs from eg. upstash
REDIS_URL=

# generate yours from exchangerate-api.com
EXCHANGE_RATE_API_KEY=
```

**`apps/server/.env.example`** (Copy to `apps/server/.env`)

```
APP_URL=http://localhost:3000
ADMIN_APP_URL=http://localhost:3001
SERVER_URL=http://localhost:5000

# generate yours from https://generate-secret.vercel.app/32
JWT_REFRESH_SECRET=<your_jwt_refresh_secret>
JWT_ACCESS_SECRET=<your_jwt_access_secret>
ENCRYPTION_KEY=<your_encryption_key>

# generate your own database url for postgresql eg. from neon.tech
DB_URL=<your_postgresql_database_url>

# generate yours from eg. upstash
REDIS_URL=<your_redis_url>

# generate yours from exchangerate-api.com
EXCHANGE_RATE_API_KEY=<your_exchangerateapi_key>

# get yours from cloudinary
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>

# GENERATE FROM NOW PAYMENTS
NOWPAYMENTS_API_KEY=<your_nowpayments_api_key>
NOWPAYMENTS_PUBLIC_KEY=<your_nowpayments_public_key>
```

**`apps/admin-dashboard/.env.example`** (Copy to `apps/admin-dashboard/.env`)

```
SERVER_URL=http://localhost:5000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000

CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
```

Make sure to replace placeholder values with your actual secrets and URLs.

### 4. Database Setup

1.  **Drizzle Migrations**: Ensure your database is up to date with the Drizzle schema.
    Navigate to the `apps/server` directory and run:

    ```bash
    cd apps/server
    pnpm drizzle-kit push:pg
    ```
    This will push the schema changes to your PostgreSQL database.

2.  **Admin User (Optional for initial setup)**:
    The `apps/server/routes/api/v1/admin/auth.ts` file has a commented-out `/signup` endpoint. You can temporarily uncomment it, create an admin user by sending a POST request to `http://localhost:5000/api/v1/admin/auth/signup` with an email and password, and then re-comment it for security.

### 5. Run the Applications

Open three separate terminal windows in the root directory and run the following commands:

**Terminal 1: Start the Backend Server**

```bash
pnpm --filter server dev
```

The server will run on `http://localhost:5000`.

**Terminal 2: Start the Web Store (Customer Frontend)**

```bash
pnpm --filter web dev
```

The web store will be available at `http://localhost:3000`.

**Terminal 3: Start the Admin Dashboard (Admin Frontend)**

```bash
pnpm --filter admin-dashboard dev
```

The admin dashboard will be available at `http://localhost:3001`.

## Usage

### Web Store (Customer)

1.  Navigate to `http://localhost:3000` in your browser.
2.  Browse products by category or use the search functionality.
3.  Add desired products to your cart.
4.  Proceed to checkout, fill in your details, and complete the purchase using crypto payments via NOWPayments.

### Admin Dashboard

1.  Navigate to `http://localhost:3001` in your browser.
2.  Log in using the admin credentials you set up during installation.
3.  From the sidebar, you can manage:
    *   **Products**: Create new products, edit existing ones, update stock, images, and other attributes.
    *   **Orders**: View all customer orders and update their status (e.g., from `pending` to `processing` or `shipped`).

## Contributing

We welcome contributions to `idolomerch`! If you're interested in helping improve this project, please follow these steps:

1.  **Fork the repository**: Click the "Fork" button at the top right of the GitHub page.
2.  **Clone your fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/idolomerch.git
    cd idolomerch
    ```
3.  **Create a new branch**: For each new feature or bug fix, create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b bugfix/issue-description
    ```
4.  **Make your changes**: Implement your feature or fix the bug. Ensure your code adheres to the project's coding standards.
5.  **Run tests and linting**: Before committing, make sure your changes pass all tests and linting checks.
    ```bash
    pnpm lint
    pnpm build # Ensure everything builds correctly
    ```
6.  **Commit your changes**: Write clear and concise commit messages.
    ```bash
    git commit -m "feat: Add new awesome feature"
    # or
    git commit -m "fix: Resolve critical bug in product display"
    ```
7.  **Push to your branch**:
    ```bash
    git push origin feature/your-feature-name
    ```
8.  **Open a Pull Request**: Go to the original `idolomerch` repository on GitHub and open a pull request from your forked branch. Provide a detailed description of your changes.

[![Readme was generated by Readmit](https://img.shields.io/badge/Readme%20was%20generated%20by-Readmit-brightred)](https://readmit.vercel.app)