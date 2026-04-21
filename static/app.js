let habits = [];

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname !== '/dashboard') {
        return;
    }

    const addHabitForm = document.getElementById('add-habit-form');
    const searchInput = document.getElementById('habit-search');
    const filterSelect = document.getElementById('habit-filter');
    const habitsList = document.getElementById('habits-list');

    addHabitForm?.addEventListener('submit', addHabit);
    searchInput?.addEventListener('input', renderHabits);
    filterSelect?.addEventListener('change', renderHabits);

    habitsList?.addEventListener('click', handleHabitActions);
    activateSectionNav();
    loadHabits();
});

async function loadHabits() {
    try {
        const response = await fetch('/habits');
        habits = await response.json();
        renderHabits();
    } catch (error) {
        console.error('Error loading habits:', error);
    }
}

function renderHabits() {
    const habitsList = document.getElementById('habits-list');
    const emptyState = document.getElementById('empty-state');
    const searchValue = document.getElementById('habit-search')?.value.trim().toLowerCase() || '';
    const filterValue = document.getElementById('habit-filter')?.value || 'all';

    if (!habitsList) {
        return;
    }

    const filteredHabits = habits.filter((habit) => {
        const matchesSearch = [habit.name, habit.description || '']
            .join(' ')
            .toLowerCase()
            .includes(searchValue);

        const matchesFilter =
            filterValue === 'all' ||
            (filterValue === 'completed' && habit.completed_today) ||
            (filterValue === 'pending' && !habit.completed_today);

        return matchesSearch && matchesFilter;
    });

    updateStats(habits);
    updateResultCount(filteredHabits.length);
    updateViewSummary(searchValue, filterValue);

    if (!filteredHabits.length) {
        habitsList.innerHTML = '';
        emptyState?.classList.remove('hidden');
        return;
    }

    emptyState?.classList.add('hidden');
    habitsList.innerHTML = filteredHabits.map(createHabitCard).join('');
}

function createHabitCard(habit) {
    const statusText = habit.completed_today ? 'Completed today' : 'Still pending';
    const statusClass = habit.completed_today ? 'status-complete' : 'status-pending';
    const description = habit.description?.trim() || 'No description added yet.';
    const lastCompleted = habit.last_completed ? formatDate(habit.last_completed) : 'Not completed yet';
    const completionCount = habit.total_completions || 0;

    return `
        <article class="habit-card ${habit.completed_today ? 'is-complete' : ''}">
            <div class="habit-card-top">
                <div>
                    <span class="habit-status ${statusClass}">${statusText}</span>
                    <h4>${escapeHtml(habit.name)}</h4>
                </div>
                <span class="habit-streak">${completionCount} check-ins</span>
            </div>
            <p class="habit-description">${escapeHtml(description)}</p>
            <div class="habit-meta">
                <div class="meta-row">
                    <span class="meta-label">Last completion</span>
                    <span class="meta-value">${lastCompleted}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label">Progress</span>
                    <span class="meta-value">${habit.completed_today ? 'On track today' : 'Ready for today'}</span>
                </div>
            </div>
            <div class="habit-actions">
                <button class="button ${habit.completed_today ? 'button-secondary' : ''}" data-action="complete" data-id="${habit.id}" ${habit.completed_today ? 'disabled' : ''}>
                    ${habit.completed_today ? 'Completed' : 'Mark Complete'}
                </button>
                <button class="button button-ghost" data-action="reset" data-id="${habit.id}">Reset</button>
                <button class="button button-danger" data-action="delete" data-id="${habit.id}">Delete</button>
            </div>
        </article>
    `;
}

function updateStats(allHabits) {
    const total = allHabits.length;
    const completed = allHabits.filter((habit) => habit.completed_today).length;
    const pending = total - completed;
    const rate = total ? Math.round((completed / total) * 100) : 0;

    setText('stat-total', total);
    setText('stat-completed', completed);
    setText('stat-pending', pending);
    setText('stat-rate', `${rate}%`);
}

function updateResultCount(count) {
    const label = count === 1 ? '1 habit' : `${count} habits`;
    setText('results-count', label);
}

function updateViewSummary(searchValue, filterValue) {
    const filterLabels = {
        all: 'All habits',
        pending: 'Needs attention',
        completed: 'Completed today',
    };
    const searchLabel = searchValue ? `Search: "${searchValue}"` : 'Search: Any term';

    setText('active-filter-label', `View: ${filterLabels[filterValue] || filterLabels.all}`);
    setText('active-search-label', searchLabel);
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
            body: new URLSearchParams({ name, description }),
        });

        if (response.ok) {
            document.getElementById('add-habit-form').reset();
            await loadHabits();
            window.location.hash = '#habits-section';
        }
    } catch (error) {
        console.error('Error adding habit:', error);
    }
}

async function handleHabitActions(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) {
        return;
    }

    const habitId = button.dataset.id;
    const action = button.dataset.action;

    if (action === 'complete') {
        await postForm('/completions', { habit_id: habitId });
    }

    if (action === 'reset') {
        await postJson(`/habits/${habitId}/reset`);
    }

    if (action === 'delete') {
        const shouldDelete = window.confirm('Delete this habit and all of its completion history?');
        if (!shouldDelete) {
            return;
        }
        await postJson(`/habits/${habitId}/delete`);
    }

    await loadHabits();
}

async function postForm(url, payload) {
    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(payload),
        });
    } catch (error) {
        console.error(`Error posting to ${url}:`, error);
    }
}

async function postJson(url) {
    try {
        await fetch(url, { method: 'POST' });
    } catch (error) {
        console.error(`Error posting to ${url}:`, error);
    }
}

function activateSectionNav() {
    const links = Array.from(document.querySelectorAll('.nav-link'));

    window.addEventListener('hashchange', () => {
        const activeHash = window.location.hash || '#overview';
        links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === activeHash);
        });
    });

    window.dispatchEvent(new HashChangeEvent('hashchange'));
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function formatDate(value) {
    return new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
