# team-task-tracker

Backend API for the Team Task Tracker interview assignment, with a React frontend and Dockerized backend services.

## How to run

From the workspace root:

```bash
cd backend
npm install
npm run dev
```

And to run the frontend locally:

```bash
cd frontend
npm install
npm run dev
```

Or using Docker from the workspace root:

```bash
docker compose up --build
```

The API will be available at `http://localhost:4000`, the frontend at `http://localhost:5173`, and Swagger UI at `http://localhost:4000/api-docs`.

## Notes

See `backend/README.md` for full architecture, caching strategy, DB decision, and improvement ideas.
