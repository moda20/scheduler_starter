# Scheduler Starter

> A starter template for testing, education, development, and experimentation with the Scheduler.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)
![License](https://img.shields.io/badge/License-ISC-green.svg)

📚 **Full Documentation**: [Scheduler Docs](https://scheduler-docs-xi.vercel.app/)
> The documentation below provides a quick overview of the starter template. For comprehensive documentation, visit the official docs site.

---

## 🎯 What is Scheduler?

Scheduler is a task manager that lets you write your own tasks in TypeScript/JavaScript. Based on a typed class component, users can write custom processes using any packages, libraries, and tools they want—all while scheduling these tasks to run at specific times.

> **In a nutshell**: Scheduler is a powerful, feature-rich CRON job manager.

## ✨ Features

- 📘 **TypeScript** - Fully typed with exported types for better DX
- ⚡ **Bun Runtime** - Faster execution with [Bun](https://bun.sh) and [Elysia](https://elysiajs.com/) API framework
- 🔄 **Lifecycle Events** - Multiple lifecycle hooks for tasks (jobs)
- 📝 **Multi-Target Logging** - Supports files, [Loki](https://grafana.com/oss/loki/), [Gotify](https://gotify.net/docs/install), and [ntfy](https://docs.ntfy.sh/install/)
- 🎨 **Integrated UI** - Easy-to-use API with a tightly coupled UI
- 🌐 **Built-in Networking** - Includes [axios](https://axios-http.com/docs/intro) for HTTP requests (more tools coming soon)
- 🔐 **Authentication** - JWT-based auth for both API and UI

## 🚀 Quick Start

Get up and running in 3 steps:

```bash
# 1. Pull the latest Docker images
docker-compose pull

# 2. Copy the auto-generated TypeScript types from the backend image
docker create --name=scc_b ghcr.io/moda20/scheduler_backend:latest && \
docker cp scc_b:/usr/src/app/extraTypes/types.d.ts ./types.d.ts && \
docker container rm scc_b

# the types.d.ts file copied will have all the types needed to code your job and when using the injected features like logging and notifications, an example job show how is it used

# 3. Start the stack
docker-compose up -d
```

> The UI will be available at `http://localhost:9002` (updatable in the compose file)

---

## 📋 Prerequisites & Services

The starter template uses Docker Compose to launch the "Scheduler Stack"—a combination of services that handle all available features. Not all services are mandatory.

### Services Overview

| Service | Description | Required |
|---------|-------------|----------|
| `scheduler_backend` | Main backend that manages jobs | ✅ Yes |
| `scheduler_ui` | Web UI for managing jobs | ✅ Yes |
| `mysql` | Database for jobs and authentication | ✅ Yes |
| `gotify` | Notification server | ❌ Optional |
| `loki` | Grafana Loki logging server | ❌ Optional |

---

## ⚙️ Configuration Guide

### Setting Up the Database

The scheduler uses MySQL and requires **2 databases to be created before running the backend**:

```sql
CREATE DATABASE scheduler_db;    -- For job definitions and stats, this is the default name and can be changed in the .env file
CREATE DATABASE scheduler_base;   -- For authentication and user data, this is the default name and can be changed in the .env file
```

The backend will automatically run any missing schema migrations on startup.

### Setting Up the Backend

Configure the backend using the `.env` file. A complete `.env.example` file is provided with all default values. For detailed configuration options, see the [backend repo documentation](https://github.com/moda20/scheduler_backend#%EF%B8%8F-configuration).

### Setting Up the Frontend

1. Access the UI at `http://localhost:9002`
2. Press `Command+L` (Mac) or `Alt+L` (Windows/Linux) to open the server configuration drawer
3. Enter the backend URL: `http://localhost:8080`
4. Optionally save the target locally for easy switching between multiple backends
5. Refresh and login or register (no email verification required)

### Configuring External Services (Optional)

#### 📢 Gotify Configuration

Requires 4 environment variables:

| Variable | Description |
|----------|-------------|
| `GOTIFY_URL` | Host and port of your Gotify server (e.g., `http://localhost:9004`) |
| `GOTIFY_TOKEN` | User token (recommend creating a dedicated user for scheduler) |
| `GOTIFY_APP_TOKEN` | Application token for success notifications |
| `GOTIFY_ERROR_APP_TOKEN` | Application token for error/crash notifications |

#### 📊 Loki Configuration

Requires 3 environment variables:

| Variable | Description |
|----------|-------------|
| `GRAFANA_LOKI_URL` | Host and port of your Loki server |
| `GRAFANA_LOKI_USERNAME` | Username for Loki authentication |
| `GRAFANA_LOKI_PASSWORD` | Password for Loki authentication |

#### 🔔 ntfy Configuration

Requires 3 environment variables:

| Variable | Description |
|----------|-------------|
| `NTFY_URL` | Host and port of your ntfy server |
| `NTFY_TOKEN` | User token (recommend creating a dedicated user for scheduler) |
| `NTFY_TOPIC` | Target ntfy topic |

> **Note**: Either Gotify or ntfy can be used as the default notification service, but both can also be used as regular services.

---

## 💻 Creating Your First Task

Tasks are based on the `JobConsumer` class. Check out `exampleJob.ts` for a working example.

### Task Structure

A task consists of:
- **Single file** containing a class that inherits from `JobConsumer`
- At minimum, a `run` method that executes your code
- Ability to import any npm packages or call external services
- Export a new instance: `export default new ExampleJob();`

### JobConsumer Methods & Properties

| Name | Type | Description |
|------|------|-------------|
| `run` | function | Main method that executes your job code |
| `preRun` | function | Called before `run` - handles proxy injection and error management |
| `logEvent` | function | Primary logging method - sends logs to Loki if configured |
| `complete` | function | Call at the end of `run` to register success or errors |
| `exportResultsToFile` | function | Export results as a generic file type |
| `exportCacheFiles` | function | Export cache files with TTL (time-to-live) support |
| `injectProxies` | function | Manually inject linked proxies into axios |
| `axios` | object | Pre-configured axios instance with proxy support |
| `notifications` | object | Send notifications via Gotify or ntfy |

### Example Task

```typescript
import { JobConsumer } from "@jobConsumer/jobConsumer";
import { JobDTO, JobLogDTO, JobOptions } from "@types/models/job";

class ExampleJob extends JobConsumer {
    constructor() {
        super();
    }

    async run(job: JobDTO, jobLog: JobLogDTO, options: JobOptions) {
        // Log an event
        this.logEvent("Starting example job");

        // Make HTTP request using built-in axios
        const response = await this.axios.get("https://api.example.com/data");

        // Export results
        await this.exportResultsToFile({
            job_log_id: jobLog.id,
            fileName: "results",
            results: { data: response.data },
        });

        // Export cache with TTL
        await this.exportCacheFiles({
            job_log_id: jobLog.id,
            fileName: "cache",
            data: { cached: response.data },
            newFile: true,
        });

        // Mark job as complete
        return this.complete(jobLog, "");
    }
}

export default new ExampleJob();
```

### Adding Tasks to Scheduler

You can add tasks via the API, but it's much easier through the UI:
1. Click `+ New Job` on the main jobs list
2. Select your task file
3. Enter a unique name
4. Set the cron schedule
5. Save!

---

## 📸 Screenshots & Demos

### Authentication & Setup

| Login Page | Server Target Configuration | Server with Target Set |
|-----------|----------------------------|------------------------|
| ![](https://i.imgur.com/bQ4astX.png) | ![](https://i.imgur.com/I7oCOsW.png) | ![](https://i.imgur.com/Crbao21.png) |

### Job Management

| New Job Popup | Job Popup with Fields | Jobs List | Job Running |
|---------------|---------------------|-----------|-------------|
| ![](https://i.imgur.com/Divijwd.png) | ![](https://i.imgur.com/iELOClq.png) | ![](https://i.imgur.com/dfd7SkE.png) | ![](https://i.imgur.com/xXYfmMH.png) |

### Job Details & Actions

| Loki Logs | Output Files & Cache | Scheduling Popup | Quick Search |
|-----------|---------------------|-----------------|--------------|
| ![](https://i.imgur.com/amxv1a1.png) | ![](https://i.imgur.com/oBa2kMO.png) | ![](https://i.imgur.com/yLLcYKV.png) | ![](https://i.imgur.com/pRQTVpM.png) |

### System Management

| Database Dashboard | Proxies List |
|-------------------|--------------|
| ![](https://i.imgur.com/NCnYZAT.png) | ![](https://i.imgur.com/zTwSX2E.png) |

---

## 🤝 Contributing

Contributions are welcome! I ([@moda20](https://github.com/moda20)) review all PRs and test them personally. To accelerate the review process, please include:

- Clear description of changes
- Testing steps and results
- Any relevant screenshots or logs

This applies to all Scheduler services (backend & frontend) as well.

---

## 📄 License

ISC License - see [LICENSE](LICENSE) for details

---

## 🔗 Links

- 📖 [Full Documentation](https://scheduler-docs-xi.vercel.app/)
- 🐛 [Backend Repository](https://github.com/moda20/scheduler_backend)
- 👤 [Author](https://github.com/moda20)
