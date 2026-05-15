# Staff Portal

A form and survey management system for organizations. Super Admins build forms, manage employees, and track responses. Employees fill out assigned forms and submit correction requests — all accessible as an installable PWA.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL 16
- **ORM:** Prisma 7
- **Styling:** Tailwind CSS 4
- **Auth:** JWT via `jose`, bcrypt passwords
- **Container:** Docker & Docker Compose

---

## Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Git

---

## Environment Variables

Copy `.env.template` to the appropriate file and fill in every value before running anything.

| Variable | Description |
|---|---|
| `POSTGRES_DB` | Database name |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |
| `DATABASE_URL` | Full Postgres connection string (see below) |
| `SEED_SUPER_USER_EMAIL` | Email for the initial admin account |
| `SEED_SUPER_USER_PASSWORD` | Password for the initial admin account |
| `JWT_SECRET` | Random secret ≥ 32 chars — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app (e.g. `http://localhost:3000`) |

### `DATABASE_URL` format

| Mode | Value |
|---|---|
| Development (`.env.local`) | `postgresql://USER:PASSWORD@localhost:5432/DBNAME` |
| Production (`.env`) | `postgresql://USER:PASSWORD@db:5432/DBNAME` — use `db` as the host (Docker service name) |

---

## Development Setup

The dev compose file starts only PostgreSQL. Next.js runs locally with hot reload.

```bash
# 1. Clone the repo
git clone <repo-url>
cd survey-system

# 2. Create your dev environment file
cp .env.template .env.local
# Edit .env.local — set all variables, use localhost in DATABASE_URL

# 3. Start PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# 4. Install dependencies
npm install

# 5. Generate the Prisma client
npx prisma generate

# 6. Run migrations
npx prisma migrate dev   # first time: add --name init

# 7. Seed the super user
npx prisma db seed

# 8. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in at `/staff/login` using the credentials from `SEED_SUPER_USER_EMAIL` / `SEED_SUPER_USER_PASSWORD`.

**Stop the database:**
```bash
docker-compose -f docker-compose.dev.yml down
```

---

## Production Setup

The production compose file builds and runs both the app and PostgreSQL in Docker. On first boot the container automatically applies migrations and seeds the super user.

```bash
# 1. Create your production environment file
cp .env.template .env
# Edit .env — set all variables, use db as the DATABASE_URL host

# 2. Build and start
docker-compose up -d --build
```

The container startup sequence is:
1. `prisma migrate deploy` — applies all pending migrations
2. `tsx prisma/seed.ts` — creates the super user (idempotent, safe to re-run)
3. `next start` — serves the application

Open [http://localhost:3000](http://localhost:3000) (or your server's IP/domain).

**Useful commands:**
```bash
# View live logs
docker-compose logs -f app

# Stop everything (data is preserved in the postgres_data volume)
docker-compose down

# Stop and delete all data
docker-compose down -v

# Open a Postgres shell
docker-compose exec db psql -U $POSTGRES_USER -d $POSTGRES_DB

# Run a one-off command inside the app container
docker-compose exec app npx prisma studio
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server (requires a prior build) |
| `npm run lint` | Run ESLint — must pass with zero errors |

---

## Prisma Commands

| Command | Description |
|---|---|
| `npx prisma generate` | Regenerate the client after schema changes |
| `npx prisma migrate dev` | Create and apply a new migration (dev only) |
| `npx prisma migrate deploy` | Apply pending migrations (production) |
| `npx prisma db seed` | Run `prisma/seed.ts` manually |
| `npx prisma studio` | Open the visual database browser |
