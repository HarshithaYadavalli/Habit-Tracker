# Habit Tracker App

A simple fullstack Habit Tracker built with Python (FastAPI), SQLite, and HTML/CSS/JS.

## Setup

1. **Database Setup**:
   - The app automatically creates a local SQLite database (`habits.db`) when you run it
   - No additional setup required!

2. **Install Dependencies**:
   - Python packages are already installed in the venv.

3. **Run the App**:
   - `c:/Users/harshitha/OneDrive/Desktop/samp/.venv/Scripts/python.exe -m uvicorn main:app --reload`
   - Open http://127.0.0.1:8000 in browser.

## Features

- User registration and login via Supabase Auth.
- Add habits with name and description.
- Mark habits as completed daily.
- View current streak for each habit.

## Notes

- Auth is basic; in production, handle sessions properly.
- Streaks are simple count of completions; can be improved to consecutive days.
- Frontend uses vanilla JS for simplicity.