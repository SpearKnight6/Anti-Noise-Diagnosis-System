# Anti-Noise Growth Diagnosis System (MVP)

Internal consultancy-first web app to diagnose visibility and sales leakage, prioritize fixes, and generate simple client reports.

## Stack
- React (JavaScript) + Vite
- Tailwind CSS
- shadcn/ui-style reusable primitives (`web/src/components/ui`)
- Node.js + Express API
- Supabase (Postgres, Auth, Storage-ready)
- Vercel-friendly frontend deployment

## MVP Modules Included
1. Client Workspace
2. Growth Diagnosis Audit
3. 12-Layer Scorecard
4. Leak Map
5. Revenue Leak Calculator
6. Action Tracker
7. Basic Report Generator

## Project Structure

```bash
.
├── api/
│   └── src/server.js
├── web/
│   └── src/
│       ├── components/
│       │   ├── domain/
│       │   ├── layout/
│       │   └── ui/
│       ├── lib/
│       ├── App.jsx
│       └── main.jsx
├── supabase/schema.sql
├── .env.example
└── vercel.json
```

## Environment variables
Copy `.env.example` to `.env` in repo root:

```bash
cp .env.example .env
```

Required values:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL`

## Database setup (Supabase)
1. Create a Supabase project.
2. Open SQL editor.
3. Run `supabase/schema.sql`.

This creates tables:
- `clients`
- `audits`
- `audit_layers`
- `leaks`
- `tasks`
- `reports`
- `metrics_weekly`

And seeds:
- Demo client: **Smile Dental Clinic**
- Sample audit data and leaks including Discovery, First Impression, Authority, Trust, Inquiry, Sales Handling, Retention, Referral.

## Local development

From repo root:

```bash
npm install
npm run dev
```

This runs:
- API on `http://localhost:8787`
- Web on `http://localhost:5173`

## Screens covered
- Login page (`/login`)
- Sidebar layout (`/app/*`)
- Clients list (`/app/clients`)
- Client detail dashboard (`/app/clients/:clientId`)
- New audit form (`/app/audits/new`)
- Audit scorecard page (inside New Audit)
- Leak priority table (`/app/clients/:clientId/workbench`)
- Task kanban (`/app/clients/:clientId/workbench`)
- Revenue calculator (`/app/clients/:clientId/workbench`)
- Report preview page (`/app/clients/:clientId/workbench`)

## Deployment notes (Vercel)
- Deploy `web` as Vite app.
- Deploy API separately (Vercel serverless/Render/Railway).
- Update `VITE_API_URL` to deployed API URL.
- Optional `vercel.json` rewrite provided for `/api/*` proxying.

## Scope guardrails respected
- No advanced AI automation
- No billing
- No public SaaS multi-tenancy
- No overbuilt permissions (single internal consultant flow)
