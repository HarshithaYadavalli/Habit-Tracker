from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import sqlite3
from datetime import date

# Database setup
DATABASE_PATH = "habits.db"

def init_db():
    """Initialize the database and create tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Create habits table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            frequency TEXT DEFAULT 'daily'
        )
    ''')
    
    # Create completions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS completions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER,
            date TEXT NOT NULL,
            FOREIGN KEY (habit_id) REFERENCES habits (id),
            UNIQUE(habit_id, date)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(request=request, name="login.html", context={"mode": "login"})

@app.get("/setup")
async def setup_database():
    """Check database tables"""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Check habits table
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='habits'")
        habits_exists = cursor.fetchone() is not None
        
        # Check completions table
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='completions'")
        completions_exists = cursor.fetchone() is not None
        
        conn.close()
        
        if habits_exists and completions_exists:
            return {"status": "success", "message": "All tables exist and are accessible"}
        else:
            return {
                "status": "error",
                "message": "Database tables are being created automatically",
                "habits_exists": habits_exists,
                "completions_exists": completions_exists
            }
    except Exception as e:
        return {"status": "error", "message": f"Database error: {str(e)}"}

@app.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse(request=request, name="login.html", context={"mode": "register"})

@app.post("/register")
async def register(email: str = Form(...), password: str = Form(...)):
    # For simplicity, just redirect to login page after registration (no real auth)
    return RedirectResponse(url="/", status_code=303)

@app.post("/login")
async def login(email: str = Form(...), password: str = Form(...)):
    # For simplicity, just redirect to dashboard (no real auth)
    return RedirectResponse(url="/dashboard", status_code=303)

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse(request=request, name="dashboard.html")

@app.post("/habits")
async def add_habit(name: str = Form(...), description: str = Form(...)):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Use a default user_id for simplicity
        user_id = "default_user"
        
        cursor.execute(
            "INSERT INTO habits (user_id, name, description, frequency) VALUES (?, ?, ?, ?)",
            (user_id, name, description, "daily")
        )
        
        habit_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {"success": True, "habit_id": habit_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/habits")
async def get_habits():
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        user_id = "default_user"
        
        # Aggregate completion history per habit for richer UI state.
        cursor.execute("""
            SELECT
                h.id,
                h.name,
                h.description,
                COUNT(c.id) as total_completions,
                MAX(c.date) as last_completed,
                MAX(CASE WHEN c.date = ? THEN 1 ELSE 0 END) as completed_today
            FROM habits h
            LEFT JOIN completions c ON h.id = c.habit_id
            WHERE h.user_id = ?
            GROUP BY h.id, h.name, h.description
            ORDER BY h.id DESC
        """, (date.today().isoformat(), user_id))
        
        habits = []
        for row in cursor.fetchall():
            habits.append({
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "streak": row[3],
                "total_completions": row[3],
                "last_completed": row[4],
                "completed_today": bool(row[5])
            })
        
        conn.close()
        return habits
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/completions")
async def mark_completion(habit_id: int = Form(...)):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        today = date.today().isoformat()
        
        cursor.execute(
            "INSERT OR IGNORE INTO completions (habit_id, date) VALUES (?, ?)",
            (habit_id, today)
        )
        
        conn.commit()
        conn.close()
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/habits/{habit_id}/reset")
async def reset_habit(habit_id: int):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        cursor.execute("DELETE FROM completions WHERE habit_id = ?", (habit_id,))

        conn.commit()
        conn.close()

        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/habits/{habit_id}/delete")
async def delete_habit(habit_id: int):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        cursor.execute("DELETE FROM completions WHERE habit_id = ?", (habit_id,))
        cursor.execute("DELETE FROM habits WHERE id = ?", (habit_id,))

        conn.commit()
        conn.close()

        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/streaks")
async def get_streaks():
    # This endpoint is now handled in /habits
    return {"message": "Streaks are included in /habits endpoint"}
