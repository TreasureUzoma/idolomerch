# 🛍️ Merch Store (idolomerch)

This is a modern full-stack merch store built with a Turborepo monorepo structure. It includes:

- **Frontend**: Admin Dashboard & Storefront (Next.js + TypeScript + Tailwind CSS + Shadcn/ui)
- **Backend**: Go (Fiber) API server, running as a standalone service
- **Monorepo**: Managed via [Turborepo](https://turborepo.com)

---

## Tech Stack

| Layer    | Stack                                                             |
| -------- | ----------------------------------------------------------------- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS                          |
| Backend  | Go (Fiber) — API server                                           |
| Monorepo | Turborepo (pnpm workspaces)                                       |
| Hosting  | Frontend (Vercel, Netlify etc), Backend (Railway/Fly/Render/etc.) |

---

## Project Structure

```

.
├── apps/
│   ├── web/           # Next.js storefront
│   ├── admin/         # Admin dashboard
│   └── go-server/    # Go Fiber server
├── packages/          # Shared code (types, UI, utils, etc.)
├── turbo.json         # Turborepo config
├── pnpm-workspace.yaml
└── README.md

```

## API Server (`apps/go-server`)

- Built using [Fiber](https://gofiber.io) — a fast, Express-style web framework.
- Runs as a standalone Go server.
- Ideal for deployment on [Railway](https://railway.app), [Render](https://render.com), [Fly.io](https://fly.io), etc.

Example entry point: `main.go`

```go
package main

import (
  "github.com/gofiber/fiber/v2"
)

func main() {
  app := fiber.New()

  app.Get("/", func(c *fiber.Ctx) error {
    return c.SendString("Hello from Fiber API!")
  })

  app.Listen(":3001")
}
```

---

## Shared Packages

Use the `packages/` directory for:

- Reusable UI components (`packages/ui`)
- Shared logic (`packages/utils`)
- Global TypeScript types (`packages/types`)

---

## Deployment

- **Frontend** (`web`, `admin`): Host on [Vercel](https://vercel.com)
- **Backend** (`api-server`): Deploy to:
  - [Railway](https://railway.app)
  - [Fly.io](https://fly.io)
  - [Render](https://render.com)
  - Or any VPS / Docker environment

## Testing (Coming Soon)

- Unit tests for Go API (via `testing` package)
- Frontend testing via Playwright or Cypress
- E2E flow tests with mocked API

---

## License

MIT — © Treasure Uzoma

---

## Contributions

Open to PRs, feedback, and ideas! Please open issues or start a discussion.

---

## Contact

- GitHub: [@treasureuzoma](https://github.com/treasureuzoma)
- X (Twitter): [@idolodev](https://x.com/idolodev)
