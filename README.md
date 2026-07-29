# Building Manager

A full-featured Property & Building Management SaaS front-end built with Angular 20 and Bootstrap 5.3.

## Quick Start

```bash
npm install
npm start          # http://localhost:4200
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 20.0.0-next.8 |
| UI | Bootstrap 5.3.6 + ng-bootstrap 18 |
| Icons | @ant-design/icons-angular |
| Charts | ApexCharts |
| State | Angular Services + Signals + localStorage |
| i18n | @ngx-translate/core (5 languages) |
| Unit Tests | Jasmine + Karma |
| E2E Tests | Playwright |

## Environment Variables

Configured in `src/environments/`:

| Variable | Dev | Production |
|----------|-----|-----------|
| `apiUrl` | `http://localhost:8080` | `https://mock-data-api-nextjs.vercel.app` |
| `production` | `false` | `true` |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server at port 4200, proxies `/api` to `localhost:8080` |
| `npm run build` | Production build to `dist/` |
| `npm run test` | Run unit tests (Jasmine/Karma) |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run prettier` | Format all source files |

## Project Structure

```
src/
├── app/
│   ├── app-routing.module.ts       # Main routing config
│   ├── app-config.ts               # Theme/layout defaults
│   │
│   ├── theme/
│   │   ├── layout/                  # 3 layouts: admin, guest, simple
│   │   │   ├── admin-layout/        # Authenticated layout (sidebar + navbar)
│   │   │   │   ├── configuration/   # Theme customization panel
│   │   │   │   ├── nav-bar/         # Top navigation bar
│   │   │   │   └── navigation/      # Sidebar menu (role-filtered)
│   │   │   ├── guest-layout/        # Public pages (login, register, landing)
│   │   │   └── simple-layout/       # Minimal layout for demos
│   │   └── shared/
│   │       ├── components/          # Shared UI components + guards + interceptors
│   │       ├── data/                # Static data (countries, locations)
│   │       ├── directive/           # Custom directives (sortable)
│   │       ├── models/              # TypeScript interfaces & DTOs
│   │       ├── service/             # 27 API services (auth, buildings, etc.)
│   │       └── apexchart/           # Reusable chart widgets
│   │
│   └── demo/
│       ├── application/             # Feature modules
│       │   ├── admin-panel/         # System admin dashboard, finance, buildings
│       │   ├── property-manager-panel/  # Multi-building management
│       │   ├── building-manager-panel/  # Statements, courses, memberships
│       │   ├── dashboard/           # General user dashboards
│       │   ├── helpdesk/            # Support ticket system
│       │   ├── professionals/       # Professional services directory
│       │   ├── customer/            # Customer list
│       │   ├── user/                # Profile & account management
│       │   ├── polls/               # Building polls & voting
│       │   ├── calender/            # Building calendar events
│       │   └── chat/                # Messaging
│       ├── pages/authentication/    # Login, register, password reset
│       ├── pages/landing/           # Marketing landing page
│       └── pages/maintenance/       # Error pages, maintenance screens
│
├── assets/
│   ├── i18n/                        # Translation files (gr, en, fr, ro, cn)
│   └── images/                      # Static assets
│
├── environments/                    # API URLs & config per environment
├── fake-data/                       # Mock data for development
├── scss/                            # Theme styles (bootstrap overrides, plugins)
├── proxy.conf.json                  # Dev proxy to backend
├── main.ts                          # App bootstrap
└── index.html                       # HTML entry point
```

## User Roles

| Role | Access |
|------|--------|
| Admin | System-wide access (dashboard, finance, buildings) |
| PropertyManager | Multi-building portfolio management |
| AdminAgent | Multi-building support (agent-level) |
| PropertyAgent | Assigned buildings management |
| BuildingManager | Single building management (statements, courses, membership) |
| Owner | Owned apartments (expenses, payments) |
| Resident | Resident unit (expenses, payments) |
| User | Basic access (profile, helpdesk, polls) |

## Key Features

- **Building & Apartment Management** — CRUD operations, code-based joining, document uploads
- **Common Expense Statements** — Create, allocate expenses, track collections
- **Payment Processing** — Per-statement tracking, collection rates, summaries
- **Support Ticket System** — Issue creation, assignment, comments, status tracking
- **Professional Directory** — Searchable marketplace for property service providers
- **Polls & Voting** — Community decision-making
- **Calendar** — Building-wide events with pinning
- **Chat** — In-app messaging
- **Role-Based Dashboards** — Tailored analytics per user role

## API

All services communicate via REST at `/api/v1/*`. The dev server proxies `/api` to `http://localhost:8080`. JWT tokens are injected automatically via HTTP interceptors.

## Docker

```bash
docker-compose up --build
# Serves at http://localhost:8081
```

## Testing

```bash
npm test              # Unit tests (Jasmine + Karma)
npx playwright test   # E2E tests (Playwright)
```

## Linting & Formatting

```bash
npm run lint          # ESLint
npm run prettier      # Prettier (auto-format all source)
```

## Internationalization

Default language is Greek (`gr`). Switch via the navbar language dropdown.

| Code | Language |
|------|----------|
| gr | Greek |
| en | English |
| fr | French |
| ro | Romanian |
| cn | Chinese |

## Theme Customization

Edit `src/app/app-config.ts` (MantisConfig) to change defaults:

```typescript
layout: 'vertical' | 'horizontal' | 'compact'
theme_color: 'preset-1' ... 'preset-9'
isDarkMode: boolean
isRtlLayout: boolean
font_family: 'public-sans' | 'Roboto' | 'Poppins' | 'Inter'
i18n: 'gr' | 'en' | 'fr' | 'ro' | 'cn'
```

## Project Info

- **Version:** 2.2.0
- **Template:** Mantis Angular Dashboard (CodedThemes)
- **Node:** >= 18
- **Package Manager:** npm (recommended)
