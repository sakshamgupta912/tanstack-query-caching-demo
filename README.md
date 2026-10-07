# TanStack Query: two caching architectures

A small React + Express app for learning how TanStack Query caches a grid, and how a
single-row update can avoid refetching the whole grid.

The same restock workflow is built twice, once per architecture.

Built with React 19, TanStack Query 5, Vite 8 and Express 5.

## Getting started

Requires Node.js `^20.19.0` or `>=22.12.0`.

```powershell
git clone https://github.com/sakshamgupta912/tanstack-query-caching-demo.git
cd tanstack-query-caching-demo
npm install
npm run dev
```

| Page | URL | Architecture |
|---|---|---|
| Two queries | http://localhost:5173/ | List query + one detail query per row |
| Single query | http://localhost:5173/single-query.html | One list query only |

`npm run dev` starts the Express API on port 3001 and Vite on port 5173. Vite proxies
`/api` to the API. Data is held in memory, so restarting the server resets it.

## The workflow

Every material starts in **Active**. Each row has one button, and the server decides
where the material goes next ([server/workflow.js](server/workflow.js)):

| Section | Button | What the server does |
|---|---|---|
| Active | Request restock | Orders enough to reach the par level. **Severe/High** risk → **Pending** (needs approval). **Moderate/Low** risk → stock received → **Completed**. |
| Pending | Approve order | Receives the stock → **Completed** |
| Completed | Reset | Restores the original data → **Active** |

Each action waits about 600 ms on the server, so the "Processing..." state is visible.

The three sections are not stored separately. Each page filters one array by `status`,
so when a material's status changes in the cache, it moves to its new section.

## Two queries

Code: [src/two-queries/TwoQueriesPage.jsx](src/two-queries/TwoQueriesPage.jsx)

```text
['materials', 'list']          → which rows exist (loaded once)
['materials', 'detail', id]    → one cache per row, seeded from the list
```

- `useQueries` reads every row from its own detail cache. Each cache starts from the list
  data (`initialData`) and stays fresh (`staleTime: Infinity`), so loading the page sends
  only `GET /api/materials`.
- The sections are grouped from the **row caches**, not the list, because the list keeps
  old statuses after an action.
- After an action, the mutation invalidates only that row's key. The row is on screen, so
  TanStack Query refetches it.
- Requests per action: `POST /api/materials/:id/:action`, then `GET /api/materials/:id`.

Trade-offs:

- The list cache keeps old data after an action.
- A list refetch (for example on window focus) doesn't update rows that already have data,
  because `initialData` only fills an empty cache.

## Single query

Code: [src/single-query/SingleQueryPage.jsx](src/single-query/SingleQueryPage.jsx)

```text
['materials', 'list']          → the only cache; every section reads from it
```

- After an action, the response (the updated material) replaces that row in the list cache
  with `setQueryData`.
- Requests per action: `POST /api/materials/:id/:action` only.
- The list has `staleTime: 10 minutes`, so it isn't refetched on every window focus. When
  it is refetched, every row updates because there is only one copy of the data.

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/materials` | All materials |
| GET | `/api/materials/:id` | One material |
| POST | `/api/materials/:id/restock` | Active → Pending or Completed |
| POST | `/api/materials/:id/approve` | Pending → Completed |
| POST | `/api/materials/:id/reset` | Completed → Active |

An action on a material in the wrong status returns `409` with a message.

## Project structure

```text
server/
  data.js                 original materials
  workflow.js             restock rules: which status comes next
  server.js               API routes
src/
  shared/
    api.js                fetch helpers
    MaterialsPage.jsx     layout, navigation, loading/error states, the three sections
    MaterialRowView.jsx   table row and action button (no data fetching)
    renderPage.jsx        creates the QueryClient and mounts a page
    styles.css
  two-queries/            architecture 1
  single-query/           architecture 2
scripts/
  dev.js                  runs the API and Vite together
```

Only the files in `two-queries/` and `single-query/` contain TanStack Query cache logic,
so comparing those two files shows the full difference between the architectures.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the API and frontend |
| `npm run dev:server` | Start only the API |
| `npm run dev:client` | Start only Vite |
| `npm run build` | Build both pages |
| `npm run preview` | Serve the production build (start the API first with `npm run dev:server`) |
| `npm run lint` | Run Oxlint |