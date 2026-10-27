# Train Management

![Angular](https://img.shields.io/badge/Angular-19.2-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?logo=reactivex&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22.15.1-5FA04E?logo=nodedotjs&logoColor=white)
[![License](https://img.shields.io/github/license/ptitsynamv/train-management)](https://github.com/ptitsynamv/train-management)
<!-- Build status: enable once a GitHub Actions workflow exists, e.g. .github/workflows/ci.yml
[![Build](https://img.shields.io/github/actions/workflow/status/ptitsynamv/train-management/ci.yml?branch=main)](https://github.com/ptitsynamv/train-management/actions)
-->

A small Angular single-page app for browsing train parts and managing how many of each are assigned. It runs entirely in the browser: data is seeded into `localStorage` and served through a mock service with a simulated network delay, so no backend is needed.

## Features

- **Paginated catalogue:** a table of 30 seeded train parts, 10 per page, with previous/next controls.
- **Detail view:** open any part at `/train/:id` to see its ID, unique number and whether it accepts a quantity.
- **Quantity editing:** parts with `canAssignQuantity` have a typed reactive-form input that only accepts non-negative integers. Changes are saved to `localStorage` and survive page reloads.
- **Toast notifications:** success, info, warning and error messages, built on Angular signals, that dismiss themselves after 5 seconds.
- **Central error handling:** a global `ErrorHandler` and a reusable `handleError` RxJS operator turn failures into toasts and return safe fallback values.
- **Global loading indicator:** keeps a count of in-flight requests so overlapping calls show one spinner.
- **404 page** for unknown routes.
- **Modern Angular:** standalone components, `OnPush` change detection everywhere, and strict TypeScript with strict template checking.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Angular 19.2 (standalone components) |
| Language | TypeScript 5.7 (`strict`, `strictTemplates`) |
| Styling | Tailwind CSS 4 via PostCSS, SCSS |
| Reactivity | RxJS 7.8, Angular signals |
| Testing | Karma + Jasmine |
| Persistence | Browser `localStorage` (mock backend) |

## Prerequisites

| Tool | Recommended | Supported by Angular 19 |
| --- | --- | --- |
| Node.js | **22.15.1** | `^18.19.1`, `^20.11.1` or `>=22.0.0` |
| npm | **10.9.2** (ships with Node 22.15.1) | `>=8` |
| Browser | Chrome (also used by the Karma test runner) | Any evergreen browser |

The project was developed and tested on Node 22.15.1. Newer Node versions are allowed by Angular's version range but haven't been tested with this project. Older versions such as Node 16 or 18.0–18.18 won't work with the Angular 19 CLI.

### Managing Node versions with NVM

If your system Node is a different version, use a version manager so this project doesn't affect your other projects.

**macOS / Linux** ([nvm](https://github.com/nvm-sh/nvm)):

```bash
nvm install 22.15.1
nvm use 22.15.1
node -v   # v22.15.1
```

**Windows** ([nvm-windows](https://github.com/coreybutler/nvm-windows)):

```powershell
nvm install 22.15.1
nvm use 22.15.1
node -v   # v22.15.1
```

## Getting started

```bash
# 1. Clone the repository
git clone https://github.com/ptitsynamv/train-management.git
cd train-management

# 2. Install dependencies exactly as locked
npm ci            # or `npm install`

# 3. Start the dev server
npm start
```

Open <http://localhost:4200/>. The app reloads automatically when you change a source file.

### Resetting the data

The first time the app loads, it seeds its data into the `local_train_data` key in `localStorage`. To return to the original data, open DevTools, go to **Application → Local Storage → http://localhost:4200**, delete `local_train_data`, and reload the page.

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the dev server at `http://localhost:4200` |
| `npm run build` | Production build into `dist/train-management/` |
| `npm run watch` | Development build that rebuilds on file changes |
| `npm test` | Run unit tests with Karma + Jasmine in Chrome |
| `npx ng test --include=src/app/services/train.service.spec.ts --watch=false` | Run a single spec file once |

The production build enforces size budgets: initial bundle warning at 500 kB and error at 1 MB; per-component styles warning at 4 kB and error at 8 kB.

## Project structure

```text
train-management/
├── public/                      # Static assets copied as-is (favicon)
├── src/
│   ├── index.html
│   ├── main.ts                  # Bootstraps the standalone AppComponent
│   ├── styles.scss              # Global styles (imports Tailwind)
│   └── app/
│       ├── app.component.*      # Shell: header, router outlet, loader, toasts
│       ├── app.config.ts        # Providers: router, ErrorHandler, interceptors
│       ├── app.routes.ts        # '' → list, 'train/:id' → details, '**' → 404
│       ├── components/          # Feature pages
│       │   ├── list/            # Paginated train table
│       │   └── details/         # Train detail + quantity form
│       ├── core/                # App-wide singletons
│       │   ├── components/      # toast, page-not-found
│       │   ├── handlers/        # GlobalErrorHandler, handleError RxJS operator
│       │   ├── interceptors/    # HTTP error + loading interceptors
│       │   └── services/        # ErrorService, NotificationService (signals)
│       ├── models/              # Train and TrainInfo (paginated response) interfaces
│       ├── services/            # TrainService: localStorage-backed mock API
│       └── shared/              # Reusable building blocks
│           ├── components/      # loader
│           ├── pipes/           # booleanToText
│           └── services/        # LoaderService (request counter)
├── angular.json                 # Angular CLI workspace config
├── .postcssrc.json              # Tailwind CSS PostCSS plugin
└── tsconfig*.json               # Strict TypeScript / Angular compiler settings
```

### Data flow

```text
ListComponent / DetailsComponent
        │  subscribe
        ▼
TrainService ── reads/writes ──► localStorage['local_train_data']
        │  delay(500ms) + LoaderService.show()/hide()
        │  handleError(...) ──► ErrorService ──► NotificationService ──► ToastComponent
        ▼
   Observable<TrainInfo | { train }>
```

The HTTP interceptors (`ErrorInterceptor`, `LoadingInterceptor`) are registered but don't run yet, because the app makes no real HTTP calls. To connect a real API, add `provideHttpClient(withInterceptorsFromDi())` in `app.config.ts`, switch `TrainService` over to `HttpClient`, and remove its manual loader handling so each request isn't counted twice.

## License

No license has been specified for this repository yet. Until one is added, all rights are reserved by the author.
