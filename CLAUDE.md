# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Angular 19 (standalone components, no NgModules), Tailwind CSS 4 via PostCSS (`.postcssrc.json`, `@use "tailwindcss"` in `src/styles.scss`), RxJS 7.8, Zone.js. Node v22.15.1 / npm v10.9.2.

This is **not** the Ermes project: global rules referring to Angular 16, NgRx, PrimeNG, `$localize`, the `slg` prefix, ESLint/`npm run lint`, or "no unit tests" do not apply here. Component selector prefix is `app` and component styles are SCSS.

## Commands

- `npm start` — dev server at http://localhost:4200
- `npm run build` — production build to `dist/train-management` (budgets: 500kB warn / 1MB error initial; 4kB warn / 8kB error per component style)
- `npm run watch` — development build in watch mode
- `npm test` — Karma + Jasmine (Chrome)
- Single spec: `npx ng test --include=src/app/services/train.service.spec.ts` (add `--watch=false` for one run)

There is no linter configured; `npm run build` (which runs strict template type-checking) is the main verification step.

## Architecture

**Routing** ([src/app/app.routes.ts](src/app/app.routes.ts)): `''` → `ListComponent` (paginated table), `train/:id` → `DetailsComponent` (view + edit quantity), `**` → `PageNotFoundComponent`. Routes are eagerly loaded.

**Data layer is a mock backend over `localStorage`.** [TrainService](src/app/services/train.service.ts) seeds `INITIAL_TRAINS` into `localStorage['local_train_data']` on first construction, then serves `getTrains(page, pageSize)` / `getTrain(id)` / `updateTrain(train)` as Observables with an artificial 500ms `delay`. Pagination is computed client-side and returned as `TrainInfo` (`data` + `metadata { total, pageSize, page, hasNext }`). To reset data, clear that localStorage key. Business rule: only trains with `canAssignQuantity === true` may have `quantity` updated (enforced in `DetailsComponent`).

**Loading indicator**: [LoaderService](src/app/shared/services/loader.service.ts) is ref-counted (`show()`/`hide()` increment/decrement; `loading$` emits only on 0↔1 transitions). `TrainService._withLoader` drives it for the mock calls; `LoaderComponent` in the app shell renders it.

**Error/notification pipeline**:
- [NotificationService](src/app/core/services/notification.service.ts) holds toasts in a `signal<ToastMessage[]>`, auto-dismisses after 5s, and mirrors errors/warnings to the console. `ToastComponent` in the app shell renders them.
- [ErrorService](src/app/core/services/error.service.ts) turns `HttpErrorResponse` / `Error` / unknown into a user message and shows an error toast.
- [handleError](src/app/core/handlers/rxjs-handle-error.ts) is the RxJS operator to use in services: `handleError<T>(errorService, context, fallback)` reports via `ErrorService`, then emits `fallback` (or rethrows if `fallback` is `null`). Service methods return fallback-shaped values (e.g. `{ train: undefined }`) rather than erroring, so components check for empty results.
- `GlobalErrorHandler` replaces Angular's `ErrorHandler` and toasts uncaught errors.

**HTTP interceptors** (`ErrorInterceptor` redirects to `/` on 401; `LoadingInterceptor` drives `LoaderService`) are registered via the class-based `HTTP_INTERCEPTORS` token in [app.config.ts](src/app/app.config.ts), but `provideHttpClient` is not configured and nothing uses `HttpClient` yet. When introducing real HTTP calls, add `provideHttpClient(withInterceptorsFromDi())` so these interceptors run, and remove `_withLoader` from the service to avoid double-counting the loader.

**Folder conventions**: `core/` holds app-wide singletons (error handling, notifications, interceptors, shell-level components like toast and 404); `shared/` holds reusable pieces (loader, pipes); `components/` holds feature pages; `models/` holds interfaces.

## Code conventions observed in this repo

- Every component uses `ChangeDetectionStrategy.OnPush`. Components that set fields from subscriptions call `ChangeDetectorRef.detectChanges()` afterwards.
- Constructor injection with `private _name` fields; explicit `public`/`private` modifiers and return types on methods; private members prefixed `_`.
- Templates currently use `*ngFor` (with a `trackBy` `identify` method) and `*ngIf`; `NgFor`/`NgIf` are imported per component.
- Styling is Tailwind utility classes in templates; component `.scss` files are mostly empty.
