# Docker and docker-compose for Travel Booking System

This project includes Dockerfiles for both backend and frontend and a `docker-compose.yml` at the repository root to run everything together (MongoDB and Redis included).

Quick commands

- Build and start everything (background):
```powershell
docker compose up -d --build
```

- Show logs for a service (example `backend`):
```powershell
docker compose logs -f backend
```

- Stop and remove containers, networks, and volumes created by compose:
```powershell
docker compose down -v
```

Notes and environment

- The `backend` service expects `MONGODB_URI` to point to `mongodb://mongo:27017/travel_booking` inside the compose network. The compose file already sets this.
- The `frontend` is built and served by `nginx` on container port `80`, mapped to host port `3000`.
- If you need to provide secrets (e.g., EMAIL credentials, JWT secrets), create a `.env` file and pass it to `docker compose` by creating a `docker-compose.override.yml` or using `env_file` entries — be careful not to commit secrets.

Development notes

- The `backend` service mounts `./backend:/app` so code changes are picked up inside the container. If you prefer image-only runs (no mount), remove the `volumes` line in `docker-compose.yml`.
- The frontend build step runs at image build time. During development you may prefer running `npm run dev` locally instead of the built nginx image.

If you'd like, I can:
- Add an `.env.example` with recommended variables.
- Add a `Makefile` or `package.json` scripts to streamline docker commands.
