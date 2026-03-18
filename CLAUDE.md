# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Enhanced FC BERT** - An Electron desktop application integrating Angular (frontend), Electron (desktop container), and a Java Spring Boot backend (bundled as `FCBert-0.0.1-SNAPSHOT.jar`). The app is used for network testing — measuring traffic disruption, frame loss, latency, and throughput.

## Commands

```bash
# Development (starts Angular dev server + Electron concurrently)
npm start

# Build Angular for production
ng build

# Run unit tests
ng test

# Run a single test file
ng test --include="**/dashboard.component.spec.ts"

# Lint
ng lint

# Package as Windows executable
npm run package:win

# Package for all platforms
npm run package:all
```

## Architecture

### Three-Tier Stack

1. **Electron layer** (`src/electron.dev.js`, `src/electron.prod.js`) — manages the app window, spawns the Java JAR process via IPC, and handles file system operations (save/open PDFs).
2. **Angular SPA** — the UI, communicating with the Java backend via HTTP and with Electron via a preload bridge (`src/preload.js`).
3. **Java backend** (`src/FCBert-0.0.1-SNAPSHOT.jar`) — Spring Boot REST API on `localhost:8080` providing telnet, config, and event endpoints.

### Electron IPC Bridge

`src/preload.js` exposes a controlled API to Angular via `window.electronAPI`. Angular code must use this bridge — it cannot call Node APIs directly. IPC handlers: `start-server`, `save-pdf`, `open-pdf`, `reveal-pdf`.

### Angular App Structure

Routes are defined in `app-routing.module.ts`:
- `/home` → `DashboardComponent` — device configuration and physical/port status
- `/event` → `EventComponent` — real-time test monitoring and results (polls backend every 3s during an active event)
- `/logging` → `LoggingComponent` — audit trail

`AppComponent` owns the top-level test lifecycle: start/stop event, connection state, and navigation menu.

### Services

| Service | Responsibility |
|---|---|
| `ApiService` | All HTTP calls to Java backend (`/telnet`, `/config`, `/event` endpoints) |
| `ConnectionService` | Connection state management and health checks |
| `EventStatusService` | Event lifecycle and data state (shared between components) |
| `LoggingService` | Application event logging |
| `IpService` | IP address discovery |
| `PrintService` | PDF report generation — saves to `Desktop/EnhancedFcbert/<date>/` |

### Test Execution Flow

1. User connects to device via login dialog → telnet session established
2. Dashboard shows device/port status
3. "Start Event" → `POST /config/test/true` → `EventStatusService` tracks lifecycle
4. `EventComponent` polls for metrics every 3 seconds
5. "Stop Event" → PDF report generated → `POST /config/test/false`

### UI Library

PrimeNG 19 with PrimeFlex utilities. Theme is set in `AppModule`. Components use PrimeNG widgets (DataTable, Dialog, Toast, etc.).

### Key Data Models

- `src/app/service/api.service.model.ts` — backend response models
- `src/app/event/event.component.model.ts` — event/results data models
