# 🔥 RoastFolio

> AI-powered portfolio roaster, resume builder & job matcher for developers.
> Know where you stand. Then fix it.

## Project Structure
```
roastfolio/
├── backend/          Express + Node.js API
│   └── src/
│       ├── routes/   API endpoints
│       ├── services/ Business logic + Claude calls
│       └── middleware/
└── frontend/         React + Vite + Tailwind
    └── src/
        ├── pages/    Route-level components
        ├── components/
        └── lib/      API client + utilities
```

## Week 1 Goal
Get both servers running. Visit http://localhost:5173 and see the landing page.
Test http://localhost:3001/api/health and see { "status": "ok" }.

## Quick Start (after cloning)
```bash
# Backend
cd backend && npm install && cp .env.example .env
# Fill in .env keys, then:
npm run dev

# Frontend (new terminal)
cd frontend && npm install && cp .env.example .env
# Fill in VITE_CLERK_PUBLISHABLE_KEY, then:
npm run dev
```
