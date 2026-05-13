# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Branching

Every major change or experiment must be done on a dedicated branch — never directly on `main`. Create a branch before starting work:

```bash
git checkout -b <feature-or-test-name>
```

Merge to `main` only when the change is stable and verified.

## Commands

### Development
```bash
# Start backend only (with nodemon auto-reload)
npm run dev              # from root — runs nodemon in server/

# Start frontend only
npm run client           # from root — runs CRA dev server on port 3000

# Or run directly in subdirectories
npm run dev              # in server/
npm start                # in client/
```

Run backend and frontend in **separate terminals** — there is no single command to start both concurrently.

### Production
```bash
npm start                # from root — runs node index.js in server/
npm run build            # in client/ — builds static assets
```

### Testing
```bash
npm test                 # in client/ — runs CRA Jest suite
# No backend tests yet; server/requests/api.http has manual REST Client tests (VS Code)
```

### Linting
No linter is configured. The client uses the CRA default (`eslint-config-react-app`), enforced at build time.

## Environment Setup

Copy `.env.example` to `.env` in the root (or `server/`) and fill in:

```
PORT=5000
BASE_URL=http://localhost:5000
MONGO_USER=
MONGO_PASSWORD=
MONGO_CLUSTER=
MONGO_PROJECT=
MONGO_DOMAIN=mongodb.net
MONGO_DB=
MONGO_OPTIONS=retryWrites=true&w=majority
```

MongoDB URI is assembled at runtime in `server/config/db.js` from these parts. The `config` package reads values via `server/config/custom-environment-variables.json`.

## Architecture

### Request Flow

Two separate routing layers in the Express app (`server/index.js`):

1. **REST API** — `POST /api/url`, `GET /api/url`, `PUT /api/url/:id`, `DELETE /api/url/:id` (defined in `server/routes/url.js`)
2. **Redirect** — `GET /:code` issues a 302 to the original URL (defined in `server/routes/index.js`)

All async route handlers are wrapped with `asyncHandler` (`server/middleware/asyncHandler.js`) so thrown errors propagate to the global error handler (`server/middleware/errorHandler.js`), which normalizes Mongoose errors and returns consistent JSON.

### Backend (`server/`)

| File | Role |
|------|------|
| `index.js` | App bootstrap; registers middleware, routes, global error handler |
| `config/db.js` | Builds MongoDB Atlas SRV URI and connects; fails fast on missing env vars |
| `models/Url.js` | Mongoose schema: `urlCode`, `longUrl`, `shortUrl`, `date` |
| `routes/url.js` | CRUD endpoints; duplicate-prevention, 5-try collision-safe `shortid` generation |
| `routes/index.js` | Redirect-only route |
| `middleware/asyncHandler.js` | Wraps async handlers to forward errors |
| `middleware/errorHandler.js` | Translates Mongoose CastError → 400, duplicate key → 409 |

### Frontend (`client/src/`)

**Routing** — React Router v7 (`BrowserRouter`). Unknown paths redirect to `/`. All routes share `<Navbar />`.

| Route | Page | Responsibility |
|-------|------|----------------|
| `/` | `LandingPage` | One-shot shorten; shows result card inline |
| `/create` | `CreatePage` | Focused create form, repeated-use optimized |
| `/urls` | `UrlsPage` | Admin table; fetches all URLs, handles create/update/delete |

**API layer** — `src/api/urlApi.js` is the single point of contact with the backend. All components call its exported functions (`getAllUrls`, `createUrl`, `updateUrl`, `deleteUrl`). During development, CRA proxies `/api/*` to `http://localhost:5000` via `"proxy"` in `client/package.json`.

**`UrlsPage`** manages URL list state locally. After mutating operations it updates state directly without refetching. It uses `unwrapUrl()` to normalize differing response shapes from the API.

### Styling System (`client/src/styles/`)

CSS loads in this fixed order in `src/index.js`:
1. `tokens.css` — CSS custom properties (colors, spacing, radius, shadow, font)
2. `base.css` — element resets and dark-theme defaults
3. `global.css` — shared layout classes (`.container`, `.nav`, `.btn`, `.card`)

Component and page styles live in `styles/components/` and `styles/pages/`. No inline styles; no CSS-in-JS. The design uses glass-morph surfaces (`backdrop-filter: blur`) and a dark violet theme.
