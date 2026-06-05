# Factory Admin — Operations Console

A responsive, API-ready admin UI built from the provided designs, using **Vue 3 + Vite + Tailwind CSS + Vue Router + Pinia**.

## Screens

| Route | View |
| --- | --- |
| `/login` | Split-screen sign in |
| `/dashboard` | Overview with stats + recent activity |
| `/factories` | Factories table (search, delete) |
| `/factories/new`, `/factories/:id/edit` | Factory form + validation rules |
| `/employees` | Employees table (search, factory filter) |
| `/employees/new`, `/employees/:id/edit` | Employee form + validation rules |
| `/activity` | Activity log — Timeline + `laravel.log` views |

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

Sign in with the seeded demo credentials: **admin@admin.com / password**.

> Out of the box the app runs against **built-in mock data** so every screen is
> fully interactive without a backend. As soon as a real API is reachable it
> uses that instead — see below.

## Connecting your API

The app calls a REST backend (designed for the Laravel app in the screenshots).
Configure it in `.env` (copy from `.env.example`):

```env
VITE_API_BASE_URL=/api          # base path for all requests
VITE_API_PROXY=http://localhost:8000   # dev proxy target for /api
# VITE_USE_MOCKS=true           # force mock data, ignore the network
```

Endpoints consumed (see [src/api/resources.js](src/api/resources.js)):

| Method | Endpoint |
| --- | --- |
| `POST` | `/login`, `/logout` |
| `GET/POST` | `/factories`, `/factories/{id}` (+ `PUT`, `DELETE`) |
| `GET/POST` | `/employees`, `/employees/{id}` (+ `PUT`, `DELETE`) |
| `GET` | `/activity-log` |

- Auth token (if returned by `/login`) is stored in `localStorage` and sent as
  `Authorization: Bearer …`. Cookie/Sanctum auth also works (`withCredentials`).
- Laravel `422` validation errors are mapped onto the form fields automatically.
- A `401` clears the session and redirects to `/login`.

When the backend is unreachable the resource layer transparently falls back to
mock data ([src/api/mock/](src/api/mock/)), so the UI never breaks during a demo.

## Structure

```
src/
  api/         axios client, resource services, mock fallback
  components/  Sidebar, Icon set, PageHeader, ConfirmDialog, Toasts, BrandMark
  composables/ useToast
  layouts/     AdminLayout (responsive sidebar + mobile drawer)
  stores/      auth (Pinia)
  views/       Login, Dashboard, Factories, Employees, Activity, forms
```

Fully responsive: the sidebar collapses into a slide-in drawer below `lg`, and
tables scroll horizontally on small screens.
