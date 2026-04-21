# Habit Tracker App

A simple habit tracker built with FastAPI, SQLite, and vanilla HTML/CSS/JS.

## Local setup

1. Create and activate a virtual environment.
2. Install dependencies:
   `pip install -r requirements.txt`
3. Run the app:
   `uvicorn main:app --reload`
4. Open `http://127.0.0.1:8000`

By default, the app stores its SQLite database in `./habits.db`.

## Deployment-ready changes

This repo is now set up for hosted deployment with:

- `requirements.txt` for Python dependencies
- `render.yaml` for Render service configuration
- `DATABASE_PATH` environment support in the app
- `/health` endpoint for platform health checks
- `.gitignore` to avoid committing local runtime files

## How database storage works

The app reads its SQLite path from the `DATABASE_PATH` environment variable.

- Local default: `./habits.db`
- Render recommended path: `/var/data/habits.db`

If the parent folder does not exist, the app creates it automatically before connecting.

## Step-by-step: deploy on Render

Render is a good fit for this project because it can keep a FastAPI service running continuously and attach a persistent disk for SQLite.

### 1. Push the project to GitHub

Create a GitHub repo, then push this code to it.

Example:

```powershell
git init
git add .
git commit -m "Prepare app for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Create a Render account

Sign in at `https://render.com/` and connect your GitHub account.

### 3. Create the web service

You have two easy options:

- Option A: use the `render.yaml` already in this repo
- Option B: create the service manually in the Render dashboard

If you use the Blueprint flow, Render will read `render.yaml` and prefill the service settings.

### 4. Confirm the service settings

These are the important settings for this app:

- Runtime: `Python`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/health`

### 5. Attach persistent storage

This part matters because SQLite should not live on temporary disk.

Use a persistent disk with:

- Mount path: `/var/data`
- Database path env var: `DATABASE_PATH=/var/data/habits.db`

If you deploy from `render.yaml`, that configuration is already included.

### 6. Deploy

Start the deploy and wait for Render to finish building and launching the app.

Once it is live, open your Render URL, which will look something like:

`https://your-service-name.onrender.com`

### 7. Test the hosted app

After deploy:

1. Open the app URL
2. Create a habit
3. Refresh the page
4. Confirm the habit is still there
5. Redeploy once and confirm the data still persists

If the habit survives a redeploy, your disk-backed SQLite setup is working correctly.

### 8. Optional: add a custom domain

Inside Render, open your service settings and add your own domain name if you want something more polished than the default `onrender.com` URL.

## Manual Render setup reference

If you create the service manually instead of using `render.yaml`, use:

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variable: `DATABASE_PATH=/var/data/habits.db`
- Persistent disk mount path: `/var/data`
- Health check path: `/health`

## Notes for production

- This app currently uses simple placeholder auth flow, not real production authentication.
- SQLite is fine for a small personal app or demo, but Postgres is the better next step if you want multi-user support or stronger reliability.
- A service with a persistent disk is usually limited to a single instance, which is okay for this project.
