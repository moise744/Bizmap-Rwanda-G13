# Backend (Django) for Complete Frontend Implementation

Powerful, production-ready Django REST backend with JWT auth, businesses, reviews, favorites, history, notifications, AI semantic search (FAISS + sentence-transformers), and chat assistant (TinyLlama fallback). Includes Swagger docs and Railway deployment.

## Tech Stack
- Django 5, DRF, SimpleJWT, CORS Headers, Channels (ASGI)
- drf-spectacular (OpenAPI/Swagger + tags)
- FAISS + sentence-transformers (free, local embeddings)
- Optional local TinyLlama chat model (free, local). Fallback heuristic when unavailable
- WhiteNoise for static files

## Quick Start (Local)
1. Python 3.11+ recommended.
2. Create venv and install:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\python -m pip install --upgrade pip
   .\.venv\Scripts\python -m pip install -r requirements.txt
   ```
3. Environment variables (examples):
   - Set in your shell or create `.env` beside `backend/` using keys from settings:
     - `DEBUG=true`
     - `DJANGO_SECRET_KEY=change-me`
     - `ALLOWED_HOSTS=*`
     - `CORS_ALLOW_ALL=true`
     - `DB_ENGINE=django.db.backends.sqlite3`
     - `DB_NAME=db.sqlite3`
     - `JWT_ACCESS_MINUTES=120`
     - `JWT_REFRESH_DAYS=7`
     - `AI_ENABLE=true`
     - `AI_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2`
4. Run migrations and dev server:
   ```bash
   .\.venv\Scripts\python backend\manage.py makemigrations
   .\.venv\Scripts\python backend\manage.py migrate
   .\.venv\Scripts\python backend\manage.py runserver
   ```
5. Docs:
   - Swagger: `http://localhost:8000/api/docs`
   - ReDoc: `http://localhost:8000/api/redoc`
   - OpenAPI JSON: `http://localhost:8000/api/schema/`

## Railway Deployment
1. Create a new Railway project.
2. Connect your repository.
3. Add a Service → Deploy from repo root. Railway auto-detects Python.
4. Set Build & Start:
   - Build uses `requirements.txt` automatically
   - Start command from `backend/Procfile`:
     - `web: daphne -b 0.0.0.0 -p $PORT core.asgi:application`
5. Environment Variables (Project → Variables):
   - `DJANGO_SECRET_KEY` (generate a strong value)
   - `DEBUG=false`
   - `ALLOWED_HOSTS=your-railway-domain.up.railway.app`
   - `CORS_ALLOW_ALL=true` or set specific origins
   - Database: add a Railway Postgres plugin and set:
     - `DB_ENGINE=django.db.backends.postgresql`
     - `DB_NAME=<railway_db_name>`
     - `DB_USER=<railway_db_user>`
     - `DB_PASSWORD=<railway_db_password>`
     - `DB_HOST=<railway_db_host>`
     - `DB_PORT=<railway_db_port>`
   - `AI_ENABLE=true` (set false if you want to disable AI features)
6. After deploy, run a one-off exec shell to migrate:
   - Railway → Deployments → Shell →
     ```bash
     python backend/manage.py migrate
     python backend/manage.py collectstatic --noinput
     ```
7. Visit `https://<your-domain>/api/docs`.

## API Overview (Tagged)
- Auth (`/api/auth/`): register, JWT token, refresh, me, profile
- Businesses (`/api/businesses/`): CRUD; categories; filter by category
- Reviews (`/api/reviews/`): CRUD (own review), list per business
- Favorites (`/api/favorites/`): add/remove favorites; view history (read-only)
- Notifications (`/api/notifications/`): list/create, mark-all-read
- Search (`/api/search/`): keyword and semantic (FAISS), admin-only reindex
- Chat (`/api/chat/`): simple RAG-like response over businesses; WebSocket at `ws://host/ws/chat/`

## Frontend ↔ API Mapping
- HomePage.tsx: featured businesses → `GET /api/businesses/?ordering=-average_rating`
- SearchPage.tsx: keyword → `GET /api/search/keyword?query=...`; semantic → `GET /api/search/semantic?query=...`
- BusinessesPage.tsx: list/paginate → `GET /api/businesses/?page=1`
- BusinessDetailPage.tsx: details → `GET /api/businesses/{id}/`; reviews → `GET /api/reviews/?business={id}` (add filter as needed)
- ReviewsPage.tsx: create/update/delete your review → `POST/PUT/DELETE /api/reviews/`
- FavoritesPage.tsx: list favorites → `GET /api/favorites/items`; add → `POST /api/favorites/items`
- HistoryPage.tsx: view history → `GET /api/favorites/history`
- NotificationsPage.tsx: list → `GET /api/notifications/`; mark all read → `POST /api/notifications/mark-all-read`
- ProfilePage.tsx: me → `GET /api/auth/me`; update profile → `PUT /api/auth/profile`
- LoginPage.tsx: JWT → `POST /api/auth/token`; Refresh → `POST /api/auth/token/refresh`
- RegisterPage.tsx: `POST /api/auth/register`
- ChatPage.tsx: ask → `POST /api/chat/`; socket → `ws://host/ws/chat/`

## Authentication
- Use `Authorization: Bearer <access_token>`
- Obtain via `/api/auth/token` after registering

## AI Notes (Free/Open Source)
- Embeddings: `sentence-transformers/all-MiniLM-L6-v2` with FAISS index in-memory
- If model fails to load (low resources), system falls back to fast keyword search and heuristic replies
- Chat: TinyLlama local inference if resources permit; otherwise concise heuristic answer using context snippets

## Maintenance
- Create superuser:
  ```bash
  .\.venv\Scripts\python backend\manage.py createsuperuser
  ```
- Reindex semantic search (admin only):
  ```bash
  curl -X POST https://<host>/api/search/reindex -H "Authorization: Bearer <token>"
  ```

## License
- All dependencies used are free and open source.

