# IdoloMerch: A Dynamic E-commerce Web Experience 🛍️

IdoloMerch is a sleek, modern e-commerce web application designed to offer a seamless shopping experience for unique and "weirdly interesting" merchandise. Built with a focus on performance and user experience, it features dynamic product listings, intuitive cart management, and real-time currency conversion, ensuring a truly global shopping journey.

## ✨ Key Features

*   **Dynamic Product Catalog**: Browse a diverse range of products with detailed descriptions, images, and customizable options (colors, sizes).
*   **Intuitive Shopping Cart**: Easily add, update quantities, and remove items from your cart. Your cart persists across sessions thanks to local storage integration.
*   **Real-time Currency Conversion**: Seamlessly switch between multiple currencies (USD, EUR, NGN, GBP, CAD) with live exchange rates, powered by a robust API.
*   **Responsive User Interface**: Enjoy a consistent and engaging experience across all devices, from desktops to mobile phones, thanks to a thoughtfully crafted responsive design.
*   **Product Breadcrumbs**: Navigate effortlessly through product categories with clear breadcrumb trails.
*   **Monorepo Structure**: Organized within a Turborepo monorepo, promoting code reusability and efficient development across different packages.

## 🚀 Usage

To get IdoloMerch up and running on your local machine, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone [your-repository-url]
    cd idolomerch/apps/web
    ```
    *(Note: The provided file paths suggest this `web` app is part of a larger `idolomerch` monorepo. Ensure you are in the `apps/web` directory or the correct app directory after cloning the root monorepo.)*

2.  **Install Dependencies**:
    Navigate into the `web` directory (or the relevant application directory if part of a monorepo) and install the required packages:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Configuration**:
    Create a `.env.local` file in the `apps/web` directory (if it doesn't already exist) and populate it with your API keys. You can use the provided `.env.example` as a template.
    ```
    NEXT_PUBLIC_BASE_URL=https://api.example.com/api/v1/
    CURRENCY_CONVERTER_API=fca_live_YOUR_FREE_CURRENCY_API_KEY
    ```
    Get your `CURRENCY_CONVERTER_API` key from [Free Currency API](https://app.freecurrencyapi.com/dashboard).

4.  **Run the Development Server**:
    Start the Next.js development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    The application will be accessible at `http://localhost:3000`.

### Interacting with the Application

*   **Browse Products**: The homepage displays a grid of all available products. Click on any product card to view its details.
*   **Search**: Use the search bar on the hero section to find products (note: search functionality is a placeholder in this version).
*   **Currency Conversion**: Select your preferred currency from the dropdown in the header or footer to see product prices and cart totals updated in real-time.
*   **Add to Cart**: On a product's detail page, choose your desired color, size, and quantity, then click "Add to Cart."
*   **Manage Cart**: Navigate to the "Cart" page from the header to review your selected items, adjust quantities, or remove products before checkout.

## 🛠️ Technologies Used

This project leverages a robust and modern stack to deliver a high-quality user experience.

| Technology      | Description                                                                 | Link                                                                    |
| :-------------- | :-------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| **Next.js**     | A React framework for building full-stack web applications.                 | [nextjs.org](https://nextjs.org/)                                       |
| **React**       | A JavaScript library for building user interfaces.                          | [react.dev](https://react.dev/)                                         |
| **TypeScript**  | A strongly typed superset of JavaScript that compiles to plain JavaScript.  | [typescriptlang.org](https://www.typescriptlang.org/)                   |
| **Tailwind CSS**| A utility-first CSS framework for rapidly building custom designs.          | [tailwindcss.com](https://tailwindcss.com/)                             |
| **Lucide React**| A collection of beautiful, open-source icons for React.                     | [lucide.dev](https://lucide.dev/icons)                                  |
| **React Context API** | For efficient global state management (Cart, Currency).                 | [react.dev/learn/passing-props-with-context](https://react.dev/learn/passing-props-with-context) |
| **Free Currency API** | Provides real-time currency exchange rates.                             | [freecurrencyapi.com](https://www.freecurrencyapi.com/)                 |
| **ESLint**      | A pluggable linting utility for JavaScript and TypeScript.                  | [eslint.org](https://eslint.org/)                                       |
| **PostCSS**     | A tool for transforming CSS with JavaScript plugins.                        | [postcss.org](https://postcss.org/)                                   |
| **Turborepo**   | High-performance build system for JavaScript and TypeScript monorepos.      | [turbo.build](https://turbo.build/)                                     |

## 📄 License

This project is currently unlicensed. Please refer to the source code for any specific usage rights or contact the author for licensing inquiries.

© {new Date().getFullYear()} idolomerch

## ✍️ Author

This project was developed by a passionate technologist committed to creating impactful and engaging web solutions.

*   **Developer Portfolio**: [treasureuzoma.netlify.app](https://treasureuzoma.netlify.app/)
*   **GitHub**: [github.com/treasureuzoma](https://github.com/treasureuzoma/idolomerch)
*   **X (Twitter)**: [@idolodev](https://x.com/idolodev)

---

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](https://github.com/treasureuzoma/idolomerch)

---

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)