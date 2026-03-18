# Enhanced FC BERT

![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-22-47848F?logo=electron&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Java](https://img.shields.io/badge/Java-Spring%20Boot-6DB33F?logo=springboot&logoColor=white)
![PrimeNG](https://img.shields.io/badge/PrimeNG-19-DD6B20?logo=primeng&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=nodedotjs&logoColor=white)

A desktop application for network testing that measures traffic disruption, frame loss, latency, and throughput. Built with Angular, Electron, and a bundled Java Spring Boot backend.

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop container | Electron 22 |
| Frontend | Angular 19, PrimeNG 19, PrimeFlex |
| Backend | Java Spring Boot (bundled JAR on `localhost:8080`) |
| PDF reports | jsPDF, html2canvas |
| Language | TypeScript 5.7, Node.js |

## Getting Started

### Prerequisites

- Node.js + npm
- Java Runtime (for the embedded Spring Boot server)

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm start
```

Starts the Angular dev server and Electron concurrently. The Electron window will open automatically and launch the Java backend.

## Build & Package

```bash
# Build Angular for production
ng build

# Package as Windows executable
npm run package:win

# Package for Linux
npm run package:linux

# Package for macOS
npm run package:osx

# Package for all platforms
npm run package:all
```

## Testing & Linting

```bash
# Run all unit tests (Karma + Jasmine)
ng test

# Run a single spec file
ng test --include="**/event.component.spec.ts"

# Lint
ng lint
```

## Application Structure

### Routes

| Route | Component | Purpose |
|---|---|---|
| `/home` | DashboardComponent | Device configuration, physical/port status |
| `/event` | EventComponent | Real-time test monitoring and results |
| `/logging` | LoggingComponent | Audit trail of application events |

### Backend API (localhost:8080)

| Endpoint | Description |
|---|---|
| `GET /actuator/health` | Server health check |
| `GET /telnet/connect/{ip}` | Connect to device via telnet |
| `GET /telnet/ip` | List available IPs |
| `POST /telnet/send` | Send telnet command |
| `GET /telnet/disconnect` | Disconnect telnet session |
| `GET /config/status/full` | Full device configuration status |
| `GET /config/test/{true\|false}` | Start or stop a test event |
| `GET /config/test/reset` | Reset connection |
| `GET /config/test/records` | Get file records |
| `GET /event/details` | Current event results |
| `GET /event/details/hourly` | Hourly event breakdown |
| `POST /actuator/shutdown` | Shut down the Java server |

### PDF Reports

Reports are generated automatically when a test event is stopped and saved to:

```
Desktop/EnhancedFcbert/<date>/
```

## Architecture — Desktop App with Embedded Backend

This is not a traditional web app. It is an Electron desktop application that bundles three runtimes together into a single installable executable.

```
┌─────────────────────────────────────────────┐
│              Electron (Desktop Shell)        │
│  ┌─────────────────────┐  ┌───────────────┐ │
│  │  Angular SPA (UI)   │  │ Java Backend  │ │
│  │  Chromium renderer  │  │ localhost:8080 │ │
│  └──────────┬──────────┘  └───────┬───────┘ │
│             │    HTTP REST         │         │
│             └──────────────────────┘         │
│                 IPC (preload bridge)         │
└─────────────────────────────────────────────┘
```

### Electron — The Desktop Shell

Electron runs two processes:

- **Main process** (`src/electron.prod.js`) — full Node.js access. Spawns the Java JAR on startup, manages the app window, and handles file system operations.
- **Renderer process** — a Chromium browser tab that loads the Angular app.

### IPC Security Bridge

The preload script (`src/preload.js`) exposes a controlled API as `window.electronAPI` to Angular. Angular cannot access Node.js or the filesystem directly — everything goes through this bridge:

```
window.electronAPI.startServer()  →  IPC  →  main process  →  spawns Java JAR
window.electronAPI.savePdf(data)  →  IPC  →  main process  →  writes file to disk
window.electronAPI.openPdf(path)  →  IPC  →  main process  →  opens with OS viewer
```

### Angular SPA — The UI

A standard Angular 19 app served inside Chromium, communicating with the Java backend over HTTP (`localhost:8080`) just like a browser app talking to a remote API — except the server runs locally.

- **Health polling** — `AppComponent` pings `/actuator/health` every 3–30 seconds, tracking up to 60 consecutive failures before marking the server unreachable.
- **Live metrics** — `EventComponent` polls `/event/details` every 3 seconds during an active test.
- All HTTP calls are centralized in `ApiService`.

### Java Spring Boot — The Embedded Backend

`FCBert-0.0.1-SNAPSHOT.jar` is bundled inside the Electron package as a resource file. Electron spawns it as a child process on startup. It manages telnet sessions to network devices, runs the FC BERT test logic, and shuts down cleanly via `POST /actuator/shutdown` when Electron closes.

### Why This Pattern?

| Concern | Solution |
|---|---|
| Native file system access | Electron main process |
| Rich, maintainable UI | Angular + PrimeNG |
| Complex network/hardware logic | Java (existing codebase reused) |
| Single installable binary | Electron Packager bundles all three |
