# Scheduler Starter

This repo is a starter template used for testing, education, and development and experimentation with the Scheduler.

If you are looking for teh full documentation, it's now fully hosted on vercel : [Scheduler Docs](https://scheduler-docs-xi.vercel.app/). the following is a lesser version of it nad might be slightly outdated.
However we will keep updating this repo with any major updates with the scheduler


The scheduler is a Task Manager where you write your own tasks in Typescript/Javascript. Based on a typed class component users can write their own processes,
using any extra packages, libraries, and extra tools they want, all while being able to schedule these tasks to run on a specific time. 

### In a nutshell, The scheduler is a glorified CRON job manager

## Features :

- Written in **Typescript** and exports the full types to use in your code
- Written with [Bun](https://bun.sh) as a runtime for faster execution, and [Elysia](https://elysiajs.com/) as the server/API framework
- Integrates multiple life cycle events for tasks (aka jobs)
- supports multiple logging targets (files, [Loki](https://grafana.com/oss/loki/), [Gotify notifications](https://gotify.net/docs/install), [ntfy](https://docs.ntfy.sh/install/))
- Has an easy to comprehend API + heavily tied UI (demo available)
- Includes built in networking tools for jobs to use ([axios](https://axios-http.com/docs/intro), more in the future)
- Supports authentication (JWT in API + UI) 


## How to use this starter template

The starter template relies solely on docker, and more specifically docker compose to launch the "scheduler stack".
The scheduler stack is a combination of services used to handle all the available features. Not all services are mandatory, 
so the following is the list of services that you can also find in the `compose.yml` file :

- `scheduler_backend` : the scheduler backend, this is the main service that manages jobs
- `scheduler_ui` : the scheduler_ui as the name suggests
- `mysql` : the database ued by the scheduler to manage jobs and authentication
- `gotify` : **OPTIONAL** - the gotify server, used as a notification server 
- `loki` : **OPTIONAL** - the Grafana loki server, it is used as logging server for activities inside tasks, and the only way to preview logs on the UI

### Running the stack

Due to the need for specific types from the scheduler_backend inorder to better handle tasks coding, we will take an extra step than just running the compose file.

1. First we pull the latest images
```bash
docker-compose pull
```

2. We run the following command to copy the automatically generated types from the scheduler_backend image
```bash
docker create --name=scc_b ghcr.io/moda20/scheduler_backend:latest && docker cp scc_b:/usr/src/app/extraTypes/types.d.ts ./types.d.ts && docker container rm scc_b
```
This will copy a types.d.ts file to your current project that you can use to have a clearer code experience when creating your tasks and using the included features, like the networking tools.

3. The next step is running the entire stack : 
We can simply use the regular `docker-compose up` command, but in case you encounter some issues on the scheduler_backend side, it's much better to run the compose services 
individually while running the scheduler_backend last.
```bash
docker-compose up -d
```

### Configuring the scheduler

Once the scheduler stack is running, you can start by accessing the UI at `http://localhost:9002`(or the port you have specified in the compose file). 
this will greet you with a login screen by default as you haven't configured the target backend yet.


#### Setting up the database

The main database being used is a mysql database, **that needs 2 databases to be created before running the backend**.
1. The scheduler database, this will house the jobs definition and the jobs stats, the default name is `scheduler_db`
2. The base database, this will be used to handle authentication and any user related data, the default name is `scheduler_base`

Once the databases are created ( `create database <dbname>;` ) running the backend will check and run any schema migrations that are missing.

#### Setting up the backend

The backend is obviously more complex with more setting needed to be set using the `.env` file.

The provided `.env` file is a complete one with all the default and settable values set already
but you can change them as you wish based on your configurations. a more detailed explanation of each variable can be found on the [backend repo](https://github.com/moda20/scheduler_backend#%EF%B8%8F-configuration)


#### Setting up the frontend

To set the target backend hit the keyboard shortcut `command + l` or `alt +l` (depending on your OS) a sliding drawer will show and you can input the target URL, in this case it should be
http://localhost:8080. here you can also save the target locally so that you can swap between multiple if you have that case. (the UI icons here are informative)

Once the target is set you can refresh the page and either login (if you are doing this a second time) or register using, don't worry there is no email verification for now.
Greeting you will be the main jobs list, a table structure that will list all your saved Tasks, a `+ New Job` button will let you add a new job.

#### Setting up the external services

The external services we mean here are :
- Gotify / ntfy 
- Loki

These are **ALL OPTIONAL**, and not setting their host in the `.env` file will disable them. Each of them need 
one or more configuration variables to be fully functional.

1. for Gotify, you will need 4 variables :
    - `GOTIFY_URL` : The host and port of your gotify server (same as the UI). Gotify is easy enough to install and a sample docker server is available in this repo.
    - `GOTIFY_TOKEN` : The user token. I recommend creating a different user for the scheduler.
    - `GOTIFY_APP_TOKEN` : The application token for the successful notification.
    - `GOTIFY_ERROR_APP_TOKEN` : the application token for the error and crashes notifications.

2. For loki you will need :
    - `GRAFANA_LOKI_URL` : The host and port of your loki server.
    - `GRAFANA_LOKI_USERNAME` : The username for the loki server.
    - `GRAFANA_LOKI_PASSWORD` : The password for the loki server.

3. For ntfy you will need :
    - `NTFY_URL` : The host and port of your ntfy server.
    - `NTFY_TOKEN` : The user token. I recommend creating a different user for the scheduler.
    - `NTFY_TOPIC` : the target ntfy topic

**Note :** one of Gotify and ntfy can be used as default notification services, but they can also be used as regular services.

### Creating a new Task

Creating a task is simple, and is based on an existing class type called `JobConsumer`. You can check the `exampleJob.ts` job for a small example.
But in general, a Task is : 

- A single File, hosting a class that inherits from JobConsumer and have at least a `run` method
- The Task can use any extra packages and call any external services
- The Task needs to export a new instance of the class : `export default new ExampleJob();` or using `module.exports = new ExampleJob();` if you are using cjs
- The Task inherits class methods and properties : 

| name                | type     | description                                                                                                                                                                                        |
|---------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| run                 | function | The `main` method of the job, it will be the method that executes your code                                                                                                                        |
| preRun              | function | The `preRun` method is called before the run method, it is used to inject proxies, handle `run` method crashes and errors                                                                          |
| logEvent            | function | The `logEvent` method will log an info event and is the main method for logging for jobs, this method will also send the logs to `Loki` if configured                                              |
| complete            | function | The `complete` method should be called at the end of your code (at the end of `run` function) and it can be used to register errors or successful runs                                             |
| exportResultsToFile | function | The `exportResultsToFile` method allows your code to export a **results** file, which is a generic file type that can be used ax a results output of your task                                     |
| exportCacheFiles    | function | The `exportCacheFiles` method allows your code to export a **cache** file, which is a generic file type that also have a `time to live` aspect and will be invalidated after the TTL period        |
| injectProxies       | function | The `injectProxies` method allows you to manually inject the proxies you have linked with your job to be injected in the `axios` object. They are not done automatically                           |
| axios               | object   | The `axios` object is a Task specific instance of the popular http client that will be used by other aspects of the Scheduler like proxies, they will automatically be injected into this instance |
| notifications       | object   | The `notifications` object is an object used to send notifications (via Gotify, Ntfy)                                                                                                              |


Adding the task to the scheduler can be done via the API but much easier via The UI, where you can pick the target file that you created directly with a unique name and a cron setting. 


### Screenshots and demos

#### Login page
![](https://i.imgur.com/bQ4astX.png)
#### Server target configuration drawer
![](https://i.imgur.com/I7oCOsW.png)
#### Server configuration with set target server
![](https://i.imgur.com/Crbao21.png)
#### New Job/task popup
![](https://i.imgur.com/Divijwd.png)
#### New Job/tasks popup with fields set
![](https://i.imgur.com/iELOClq.png)
#### The jobs List (main page to handle jobs)
![](https://i.imgur.com/dfd7SkE.png)
#### The jobs List with the test job running
![](https://i.imgur.com/xXYfmMH.png)
#### The job's loki logs drawer
![](https://i.imgur.com/amxv1a1.png)
#### The job's output files and cache files drawer
![](https://i.imgur.com/oBa2kMO.png)
#### The scheduling popup for a single job
![](https://i.imgur.com/yLLcYKV.png)
#### The system database dashboard (backups for both databases)
![](https://i.imgur.com/NCnYZAT.png)
#### The proxies list (management interface and links between proxies & jobs)
![](https://i.imgur.com/zTwSX2E.png)
#### The quick search (spotlight like) popup for jobs
![](https://i.imgur.com/pRQTVpM.png)

I hope these images cna get your the vision of the UI and the system. i will be adding a video tutorial soon with more fixes
and accessibility improvements for drawers and popups.

## Contributions
Contributions are welcome, I [moda20](https://github.com/moda20) will be reviewing all the PRs and testing them, so be sure to include any testing steps that would accelerate the review process.
This also applies to all the scheduler services (backend & frontend) as well.
