# Team Task Tracker API

A team-based task tracker backend built with Node.js, Express, MySQL, Redis, JWT authentication, role-based access control, and Docker.

## Quick start

1. Copy `.env.example` to `.env` and adjust secrets if needed.
2. From `backend/` run:
   - `npm install`
   - `npm run dev`
3. Or use Docker from the workspace root:
   - `docker compose up --build`
4. API available at `http://localhost:4000`
5. Swagger docs available at `http://localhost:4000/api-docs`
6. Frontend available at `http://localhost:5173` when using the root Docker compose setup.

## Local frontend

From `frontend/` run:

```bash
npm install
npm run dev
```

Then open the Vite application at `http://localhost:5173`.

## Architecture

- `src/controllers` - Express handlers
- `src/services` - business rules and transaction coordination
- `src/repositories` - database access
- `src/middleware` - authentication, authorization, validation, error handling
- `src/validators` - request schemas with Zod
- `src/config` - DB and Redis configuration
- `src/utils` - shared helpers

## Database design decision

I added `organization_id` to `users`, `projects`, and `tasks` so all data always belongs to an organization. This makes RBAC easier and avoids cross-organization leakage without requiring a separate join table.

## Caching strategy

- `GET /api/tasks` is cached in Redis per assignee and query filters.
- Cache keys include assignee, status, priority, page, and limit.
- Cache is invalidated for any task create, update, delete, or status transition in the same organization or assignee.

## What to improve with more time

- Add unit/integration tests for auth, RBAC, and task workflow.
- Add a simple React frontend for login and task board views.
- Add automated migration tooling instead of raw SQL init scripts.
- Harden refresh token storage with rotating signatures and device metadata.

## Notes

- Role permissions are enforced in middleware, not inside controllers.
- Refresh tokens rotate on every refresh and revoked tokens are invalidated.
- Task status transitions are enforced server-side using a valid transition map.
