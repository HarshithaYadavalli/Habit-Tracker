// app.js

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/dashboard') {
        loadHabits();
    }

    const addHabitForm = document.getElementById('add-habit-form');
    if (addHabitForm) {
        addHabitForm.addEventListener('submit', addHabit);
    }
});

async function loadHabits() {
    try {
        const response = await fetch('/habits');
        const habits = await response.json();
        const habitsList = document.getElementById('habits-list');
        habitsList.innerHTML = '';
        habits.forEach(habit => {
            const habitDiv = document.createElement('div');
            habitDiv.className = 'habit-item';
            habitDiv.innerHTML = `
                <h3>${habit.name}</h3>
                <p>${habit.description}</p>
                <p>Streak: <span class="streak">${habit.streak || 0}</span></p>
                <button onclick="markComplete(${habit.id})">Mark Complete Today</button>
            `;
            habitsList.appendChild(habitDiv);
        });
    } catch (error) {
        console.error('Error loading habits:', error);
    }
}

async function addHabit(event) {
    event.preventDefault();
    const name = document.getElementById('habit-name').value;
    const description = document.getElementById('habit-description').value;
    try {
        const response = await fetch('/habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                name: name,
                description: description
            })
        });
        if (response.ok) {
            loadHabits(); // Reload habits
            document.getElementById('add-habit-form').reset();
        }
    } catch (error) {
        console.error('Error adding habit:', error);
    }
}

async function markComplete(habitId) {
    try {
        const response = await fetch('/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                habit_id: habitId
            })
        });
        if (response.ok) {
            loadHabits(); // Reload to update streaks
        }
    } catch (error) {
        console.error('Error marking complete:', error);
    }
}