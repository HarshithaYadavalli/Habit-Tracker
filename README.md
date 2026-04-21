# Habit Tracker

<p align="center">
  A calm, minimal habit-tracking dashboard built with FastAPI, SQLite, and vanilla JavaScript.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-Backend-05998b?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI badge" />
  <img src="https://img.shields.io/badge/SQLite-Database-0f6db6?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite badge" />
  <img src="https://img.shields.io/badge/Vanilla-JavaScript-f2c94c?style=for-the-badge&logo=javascript&logoColor=1f2937" alt="JavaScript badge" />
  <img src="https://img.shields.io/badge/HTML%2FCSS-UI-e76f51?style=for-the-badge&logo=html5&logoColor=white" alt="HTML CSS badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Local%20Project-7c3aed?style=flat-square" alt="Project status badge" />
  <img src="https://img.shields.io/badge/Focus-Readable%20UI-2563eb?style=flat-square" alt="Readable UI badge" />
  <img src="https://img.shields.io/badge/Type-Full%20Stack-16a34a?style=flat-square" alt="Full stack badge" />
</p>

## Overview

Habit Tracker is a small full-stack project focused on one thing: making daily routines feel easier to manage.

Instead of building a cluttered productivity app, the idea here was to create something visually clean, simple to understand, and fast to interact with. You can create habits, track daily completions, filter what needs attention, and get a quick snapshot of your progress from one dashboard.

It is also a portfolio-style project that shows the full path from backend routes and database storage to UI styling and client-side interactivity.

## Why this project

I wanted to build something that felt practical, polished, and approachable.

This project was a way to practice:

- designing a dashboard UI that feels clearer than a default CRUD app
- connecting a FastAPI backend to a lightweight frontend
- working with templates, forms, API endpoints, and local persistence
- building a complete project that is easy for someone else to clone and run

## Features

- habit creation with name and description
- daily completion tracking
- search and filter tools for scanning long habit lists
- summary cards for total habits, completed habits, pending habits, and completion rate
- reset and delete actions for quick management
- local SQLite persistence
- responsive dashboard and login flow

## Demo

Local demo:

```text
http://127.0.0.1:8000
```

Core flow:

1. Open the login screen
2. Enter the dashboard
3. Add a habit
4. Mark it complete
5. Filter by completed or pending
6. Track your progress from the top summary cards


## Screenshots

<img width="1839" height="443" alt="image" src="https://github.com/user-attachments/assets/19b5cde2-d8a2-461f-b32b-9fa69adc5e0b" />


<img width="1854" height="750" alt="image" src="https://github.com/user-attachments/assets/c78e5c24-7969-4a79-858a-6368d6280fd5" />


<img width="1865" height="724" alt="image" src="https://github.com/user-attachments/assets/0b68255c-06a6-494e-988c-7af951511a9e" />


<img width="1821" height="807" alt="image" src="https://github.com/user-attachments/assets/4dd507df-ba6b-40e8-a5e3-3c1c71da3563" />




## Tech Stack

- FastAPI
- SQLite
- Jinja2 templates
- HTML
- CSS
- Vanilla JavaScript

## Project Structure

```text
.
|-- main.py
|-- requirements.txt
|-- templates/
|   |-- login.html
|   `-- dashboard.html
`-- static/
    |-- styles.css
    `-- app.js
```

## Run Locally

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Create a virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

macOS / Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the development server

```bash
uvicorn main:app --reload
```

### 5. Open the app

```text
http://127.0.0.1:8000
```

## How It Works

The app uses FastAPI to serve both HTML pages and habit-related endpoints. Habits and daily completions are stored in SQLite, while the dashboard uses vanilla JavaScript to fetch, render, search, and filter data on the page without needing a full frontend framework.

That makes the project small enough to understand quickly, while still covering the major pieces of a real full-stack app.

## Replicate This Project

If you want to build something similar from scratch, the general path looks like this:

1. Set up a FastAPI app with static files and Jinja templates.
2. Create a SQLite schema for habits and daily completions.
3. Add routes for page rendering and habit actions.
4. Build the dashboard layout in HTML and CSS.
5. Use JavaScript `fetch` calls to load and update habits dynamically.
6. Add simple stats, filtering, and search for better usability.
7. Polish the UI so it feels more like a product and less like a prototype.

## Current Limitations

This version is intentionally simple, so a few things are still basic:

- authentication is placeholder-only and does not create real user sessions
- habits are currently tied to a default user in the backend
- streak logic reflects completion count, not true consecutive-day streaks
- the project is best suited for local use, learning, or portfolio presentation in its current form

## Future Improvements

- real authentication and session management
- true streak calculations
- edit habit details inline
- weekly or monthly progress charts
- habit categories or tags
- reminders or due-time support
- PostgreSQL for easier hosted deployment
