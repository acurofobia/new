# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the project

The entire stack runs via Docker Compose:

```bash
docker compose up --build
```

App is served on port 80. On Windows, WSL must be enabled.

## Architecture

This is a full-stack exam/testing system with three containers orchestrated by Docker Compose:

- **nginx** (port 80) — reverse proxy: `/` → frontend:3000, `/api` → backend:5000
- **backend** — Flask REST API (`project_backend/main.py`), SQLite DB
- **frontend** — React + Vite app (`project_frontend/`), built to static files served by nginx

### Backend (`project_backend/`)

Flask-RESTful app with a single `User` SQLAlchemy model (SQLite). Key endpoints:

| Method | Route | Purpose |
|--------|-------|---------|
| PUT | `/api/add/<org>/<uin>/<category>/<numbers>/<prakt>/<tem>` | Register user with selected question set |
| GET | `/api/api/<uin>` | Fetch user's question data by UIN |
| PUT | `/api/end/<uin>/<category>` | Submit test results, generates `.docx` reports |
| GET | `/api/show` | List all registered UIns |
| DELETE | `/api/del/<uin>` | Delete a user by UIN |

The `org` parameter controls which question bank is used: `fda`, `favt_mos`, or `favt_ul`. Each org has JSON files per category (`1k`–`8k`) for theory, practical (`prakt`), and thematic (`tem`) questions.

After test completion, `wordTemplate()` renders two `.docx` files per user (summary + full detail) into `passed/` using `docxtpl` templates (`shablon_*.docx`).

### Frontend (`project_frontend/src/`)

React 18 SPA with react-router-dom v6. Routes:

- `/` — HomePage (select org/mode)
- `/test` — TestPage (register UIN, start test)
- `/train` — TrainPage
- `/question/:number` — QuestionPage (theory questions)
- `/prakt/:number` — PraktPage (practical questions)
- `/result` — ResultPage
- `/praktresult` — PraktResultPage
- `/admin` — AdminPage

### Question data files

JSON files in `project_backend/` follow naming conventions:
- `<N>k.json`, `<N>mosk.json`, `<N>ul.json` — main theory question banks (categories 1–8)
- `FDA_prakt_<N>k.json`, `FDA_tem_<N>k.json` — FDA practical/thematic tickets
- `FAVT_prakt_<N>k.json`, `FAVT_UL_prakt_<N>k.json`, etc. — FAVT practical/thematic tickets

## Local development (without Docker)

**Backend:**
```bash
cd project_backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python main.py
```

**Frontend:**
```bash
cd project_frontend
npm install
npm run dev      # dev server
npm run build    # production build
npm run lint     # ESLint
```
