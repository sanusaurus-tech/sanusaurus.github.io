// js/app.js — Sanusaurus To-Do App

// ─────────────────────────────────────────────
// Task Manager — data layer
// ─────────────────────────────────────────────

/**
 * Load tasks from localStorage.
 * Returns a parsed Task[] array, or [] if the stored value is
 * absent, empty, or contains malformed JSON.
 *
 * @returns {Array<{id: string, description: string, completed: boolean}>}
 */
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem('sanusaurus_tasks') || '[]') || [];
  } catch (e) {
    console.warn('sanusaurus_tasks: invalid JSON, resetting.', e);
    return [];
  }
}

/**
 * Persist the in-memory task list to localStorage.
 *
 * @param {Array<{id: string, description: string, completed: boolean}>} tasks
 */
function saveTasks(tasks) {
  localStorage.setItem('sanusaurus_tasks', JSON.stringify(tasks));
}

// Module-level in-memory task state, hydrated from localStorage on load.
let tasks = loadTasks();

// =============================================================================
// Quick Links — Data Layer
// Requirements: 10.1, 10.2, 10.3, 10.4
// =============================================================================

/**
 * Loads the links array from Local Storage.
 * Returns an empty array if the key is absent or the JSON is malformed.
 * @returns {Array<{id: string, label: string, url: string}>}
 */
function loadLinks() {
  try {
    return JSON.parse(localStorage.getItem('sanusaurus_links') || '[]') || [];
  } catch (e) {
    console.warn('sanusaurus_links: invalid JSON, resetting.', e);
    return [];
  }
}

/**
 * Serialises the links array to Local Storage.
 * @param {Array<{id: string, label: string, url: string}>} links
 */
function saveLinks(links) {
  localStorage.setItem('sanusaurus_links', JSON.stringify(links));
}

/**
 * Returns true only if the URL starts with "http://" or "https://".
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}

// In-memory links state — populated from Local Storage on load
let links = loadLinks();

// =============================================================================
// Clock Module — Greeting Panel
// Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
// =============================================================================

/**
 * Maps a 0–23 hour value to the appropriate greeting string.
 *
 * Mapping:
 *   05–11 → "Good Morning"
 *   12–17 → "Good Afternoon"
 *   18–20 → "Good Evening"
 *   0–4 and 21–23 → "Good Night"
 *
 * @param {number} hour - Integer in the range 0–23
 * @returns {string}
 */
function getGreeting(hour) {
  if (hour >= 5 && hour <= 11) return 'Good Morning';
  if (hour >= 12 && hour <= 17) return 'Good Afternoon';
  if (hour >= 18 && hour <= 20) return 'Good Evening';
  return 'Good Night'; // covers 0–4 and 21–23
}

/**
 * Formats a Date object into a human-readable string.
 * Example output: "Monday, 15 October 2026"
 *
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Starts a 1-second interval that updates the #clock, #date, and #greeting
 * DOM elements with the current time, date, and greeting.
 *
 * #clock is updated as HH:MM:SS (zero-padded).
 */
function startClock() {
  function tick() {
    const now = new Date();

    // Zero-pad helper
    const pad = (n) => String(n).padStart(2, '0');

    // HH:MM:SS
    const timeStr =
      pad(now.getHours()) + ':' +
      pad(now.getMinutes()) + ':' +
      pad(now.getSeconds());

    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    const greetingEl = document.getElementById('greeting');

    if (clockEl) clockEl.textContent = timeStr;
    if (dateEl) dateEl.textContent = formatDate(now);
    if (greetingEl) greetingEl.textContent = getGreeting(now.getHours());
  }

  tick(); // run immediately so there is no 1-second blank on load
  setInterval(tick, 1000);
}

// =============================================================================
// Focus Timer — State & Utilities
// Requirements: 3.1
// =============================================================================

// Timer state variables
let timerSeconds = 1500;   // 25 * 60 — remaining seconds (initial: 25:00)
let timerInterval = null;  // setInterval handle; null means the timer is stopped

/**
 * Formats a duration in seconds as a zero-padded "MM:SS" string.
 *
 * @param {number} seconds - Total remaining seconds (non-negative integer)
 * @returns {string} e.g. 1500 → "25:00", 65 → "01:05", 0 → "00:00"
 */
function formatTime(seconds) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
}

// Set the initial timer display to "25:00" once the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  const timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(timerSeconds);
  }
});

// =============================================================================
// Quick Links — Business Logic
// Requirements: 9.2, 9.3, 9.5, 9.6, 9.7
// =============================================================================

/**
 * Adds a new link to the in-memory list and persists it.
 *
 * Validation rules (Req 9.7):
 *   - label must be non-empty after trimming
 *   - url must pass isValidUrl() (must start with http:// or https://)
 * On any violation the #link-error element is shown and no mutation occurs.
 *
 * @param {string} label - Display label for the link button
 * @param {string} url   - URL to open; must start with http:// or https://
 */
function addLink(label, url) {
  const trimmedLabel = label.trim();

  // --- Validation (Req 9.7) ---
  const linkErrorEl = document.getElementById('link-error');

  if (!trimmedLabel || !isValidUrl(url)) {
    if (linkErrorEl) {
      linkErrorEl.textContent = !trimmedLabel
        ? 'Link label cannot be empty.'
        : 'URL must start with http:// or https://.';
    }
    return; // reject — do not mutate state
  }

  // Clear any previous error
  if (linkErrorEl) linkErrorEl.textContent = '';

  // Build the new Link object (Req 9.2, 9.5)
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Date.now().toString();

  const newLink = { id, label: trimmedLabel, url };

  // Mutate in-memory state
  links.push(newLink);

  // Persist (Req 9.3)
  saveLinks(links);

  // Re-render (Req 9.2)
  renderLinks();
}

/**
 * Removes the link with the given id from the in-memory list, persists the
 * updated list, and triggers a re-render.
 *
 * @param {string} id - The unique identifier of the link to remove
 */
function deleteLink(id) {
  // Filter out the matching link (Req 9.6)
  links = links.filter((link) => link.id !== id);

  // Persist
  saveLinks(links);

  // Re-render
  renderLinks();
}

// =============================================================================
// Focus Timer — Core Functions
// Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
// =============================================================================

/**
 * Starts the countdown timer.
 * Guards against starting when timerSeconds is already 0 (Req 3.7).
 * Disables the Start button while running (Req 3.3).
 * Calls handleTimerEnd() when the countdown reaches 0 (Req 3.6).
 */
function startTimer() {
  // Req 3.7: no-op if already at 00:00
  if (timerSeconds === 0) return;

  // No-op if a timer is already running
  if (timerInterval !== null) return;

  const btnStart = document.getElementById('btn-start');
  if (btnStart) btnStart.disabled = true;

  timerInterval = setInterval(function () {
    timerSeconds -= 1;

    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
      timerDisplay.textContent = formatTime(timerSeconds);
    }

    if (timerSeconds <= 0) {
      handleTimerEnd();
    }
  }, 1000);
}

/**
 * Stops (pauses) the countdown timer.
 * Guards against calling when no timer is active (Req 3.4).
 * Preserves the current timerSeconds value (Req 3.4).
 */
function stopTimer() {
  // No-op if not currently running
  if (!timerInterval) return;

  clearInterval(timerInterval);
  timerInterval = null;
}

/**
 * Resets the timer to the initial 25:00 value.
 * Stops any active countdown, resets timerSeconds to 1500,
 * re-renders the display, and re-enables the Start button (Req 3.5).
 */
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  timerSeconds = 1500;

  const timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(timerSeconds);
  }

  const btnStart = document.getElementById('btn-start');
  if (btnStart) btnStart.disabled = false;
}

/**
 * Called automatically when the countdown reaches 00:00.
 * Clears the interval and displays a visual notification (Req 3.6).
 */
function handleTimerEnd() {
  clearInterval(timerInterval);
  timerInterval = null;

  // Re-enable Start button so the user can restart
  const btnStart = document.getElementById('btn-start');
  if (btnStart) btnStart.disabled = false;

  // Visual notification — on-page banner (avoids blocking alert UX)
  const timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) {
    timerDisplay.textContent = '00:00';
  }

  // Show an on-page notification banner
  let banner = document.getElementById('timer-notification');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'timer-notification';
    banner.style.cssText = [
      'position:fixed',
      'top:1rem',
      'left:50%',
      'transform:translateX(-50%)',
      'background:#e63946',
      'color:#fff',
      'padding:0.75rem 1.5rem',
      'border-radius:8px',
      'font-size:1rem',
      'font-weight:600',
      'z-index:9999',
      'box-shadow:0 4px 16px rgba(0,0,0,0.4)',
    ].join(';');
    document.body.appendChild(banner);
  }

  banner.textContent = '⏰ Focus session complete! Time for a break.';
  banner.style.display = 'block';

  // Auto-hide the banner after 5 seconds
  setTimeout(function () {
    if (banner) banner.style.display = 'none';
  }, 5000);
}

// =============================================================================
// Focus Timer — Button Wiring
// Requirements: 3.2, 3.4, 3.5
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
  const btnStart = document.getElementById('btn-start');
  const btnStop  = document.getElementById('btn-stop');
  const btnReset = document.getElementById('btn-reset');

  if (btnStart) btnStart.addEventListener('click', startTimer);
  if (btnStop)  btnStop.addEventListener('click', stopTimer);
  if (btnReset) btnReset.addEventListener('click', resetTimer);
});

// =============================================================================
// Task Manager — Mutations
// Requirements: 4.2, 4.3, 4.4, 4.5, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 7.2, 7.3
// =============================================================================

/**
 * Generates a unique string ID.
 * Prefers crypto.randomUUID() and falls back to Date.now().toString()
 * for environments that don't support the Crypto API.
 *
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString();
}

/**
 * Adds a new task to the in-memory list and persists it.
 *
 * Validation: trims the input; if the result is empty or whitespace-only,
 * displays an error message in #task-error and returns without mutating state.
 *
 * @param {string} description - Raw input from the user
 */
function addTask(description) {
  const trimmed = description.trim();

  const errorEl = document.getElementById('task-error');

  if (!trimmed) {
    if (errorEl) errorEl.textContent = 'Task description cannot be empty.';
    return;
  }

  // Clear any previous error
  if (errorEl) errorEl.textContent = '';

  /** @type {{id: string, description: string, completed: boolean}} */
  const newTask = {
    id: generateId(),
    description: trimmed,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();
}

/**
 * Updates the description of an existing task identified by `id`.
 *
 * Validation: trims the new description; if the result is empty or
 * whitespace-only, the original task is retained unchanged.
 *
 * @param {string} id             - The unique task ID
 * @param {string} newDescription - The replacement text entered by the user
 */
function editTask(id, newDescription) {
  const trimmed = newDescription.trim();

  // Reject empty / whitespace-only — retain original
  if (!trimmed) return;

  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;

  task.description = trimmed;
  saveTasks(tasks);
  renderTasks();
}

/**
 * Flips the `completed` boolean on the task identified by `id`.
 *
 * @param {string} id - The unique task ID
 */
function toggleComplete(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;

  task.completed = !task.completed;
  saveTasks(tasks);
  renderTasks();
}

/**
 * Removes the task identified by `id` from the in-memory list and persists.
 *
 * @param {string} id - The unique task ID
 */
function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks(tasks);
  renderTasks();
}

// =============================================================================
// Quick Links — Rendering
// Requirements: 9.1, 9.4, 9.5
// =============================================================================

/**
 * Re-renders the full list of link buttons inside #links-container.
 *
 * For each link, creates:
 *   <div>
 *     <a class="link-btn" href="url" target="_blank" rel="noopener noreferrer">label</a>
 *     <button class="btn-delete-link">×</button>
 *   </div>
 *
 * The delete button is wired to deleteLink(id). (Req 9.5)
 */
function renderLinks() {
  const container = document.getElementById('links-container');
  if (!container) return;

  // Clear existing content (Req 9.1)
  container.innerHTML = '';

  links.forEach(function (link) {
    const wrapper = document.createElement('div');

    // Anchor that opens the URL in a new tab (Req 9.4)
    const anchor = document.createElement('a');
    anchor.className = 'link-btn';
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = link.label;

    // Delete button (Req 9.5)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete-link';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', function () {
      deleteLink(link.id);
    });

    wrapper.appendChild(anchor);
    wrapper.appendChild(deleteBtn);
    container.appendChild(wrapper);
  });
}

// =============================================================================
// Quick Links — Button Wiring & Error Clearing
// Requirements: 9.1, 9.4, 9.5
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
  // Wire "Add Link" button (Req 9.1)
  const btnAddLink = document.getElementById('btn-add-link');
  if (btnAddLink) {
    btnAddLink.addEventListener('click', function () {
      const labelInput = document.getElementById('link-label-input');
      const urlInput   = document.getElementById('link-url-input');
      addLink(
        labelInput ? labelInput.value : '',
        urlInput   ? urlInput.value   : ''
      );
    });
  }

  // Clear #link-error on any interaction with the label or URL inputs
  const linkErrorEl    = document.getElementById('link-error');
  const labelInput     = document.getElementById('link-label-input');
  const urlInput       = document.getElementById('link-url-input');

  function clearLinkError() {
    if (linkErrorEl) linkErrorEl.textContent = '';
  }

  if (labelInput) labelInput.addEventListener('input', clearLinkError);
  if (urlInput)   urlInput.addEventListener('input', clearLinkError);

  // Initial render of links from Local Storage (Req 9.1)
  renderLinks();
});

// =============================================================================
// Task Manager — Rendering
// Requirements: 4.1, 4.2, 4.3, 5.1, 5.2, 5.6, 6.1, 6.2
// =============================================================================

/**
 * Fully re-renders the `#task-list` from the in-memory `tasks` array.
 *
 * For each task, builds an `<li class="task-item">` containing:
 *   - `.task-checkbox`    — checkbox for toggling completion
 *   - `.task-text`        — display span
 *   - `.task-edit-input`  — text input for editing (hidden in display mode)
 *   - `.btn-edit`         — activate edit mode
 *   - `.btn-save`         — confirm edit
 *   - `.btn-cancel`       — cancel edit
 *   - `.btn-delete`       — delete the task
 *
 * Also wires the `#btn-add-task` button and `#task-input` Enter key to
 * `addTask()`, and clears `#task-error` on the next input interaction.
 */
function renderTasks() {
  const taskList = document.getElementById('task-list');
  if (!taskList) return;

  // Clear existing items
  taskList.innerHTML = '';

  tasks.forEach(function (task) {
    // ── <li class="task-item [completed]"> ──────────────────────────────────
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    // ── Checkbox ─────────────────────────────────────────────────────────────
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function () {
      toggleComplete(task.id);
    });

    // ── Display span ─────────────────────────────────────────────────────────
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.description;

    // ── Edit input (hidden in display mode) ──────────────────────────────────
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-edit-input';
    editInput.value = task.description;
    editInput.style.display = 'none';

    // ── Buttons ──────────────────────────────────────────────────────────────
    const btnEdit   = document.createElement('button');
    btnEdit.className   = 'btn-edit';
    btnEdit.textContent = 'Edit';

    const btnSave   = document.createElement('button');
    btnSave.className   = 'btn-save';
    btnSave.textContent = 'Save';
    btnSave.style.display = 'none';

    const btnCancel = document.createElement('button');
    btnCancel.className   = 'btn-cancel';
    btnCancel.textContent = 'Cancel';
    btnCancel.style.display = 'none';

    const btnDelete = document.createElement('button');
    btnDelete.className   = 'btn-delete';
    btnDelete.textContent = 'Delete';

    // ── Helper: enter edit mode ───────────────────────────────────────────────
    function enterEditMode() {
      editInput.value       = task.description; // pre-fill with current text
      textSpan.style.display  = 'none';
      btnEdit.style.display   = 'none';
      btnDelete.style.display = 'none';
      editInput.style.display = '';
      btnSave.style.display   = '';
      btnCancel.style.display = '';
      editInput.focus();
    }

    // ── Helper: exit edit mode (cancel) ──────────────────────────────────────
    function exitEditMode() {
      editInput.style.display = 'none';
      btnSave.style.display   = 'none';
      btnCancel.style.display = 'none';
      textSpan.style.display  = '';
      btnEdit.style.display   = '';
      btnDelete.style.display = '';
    }

    // ── Helper: commit save ───────────────────────────────────────────────────
    function saveEdit() {
      editTask(task.id, editInput.value);
      // renderTasks() is called inside editTask(), so the list is rebuilt.
    }

    // ── Button click handlers ─────────────────────────────────────────────────
    btnEdit.addEventListener('click', enterEditMode);
    btnCancel.addEventListener('click', exitEditMode);
    btnSave.addEventListener('click', saveEdit);
    btnDelete.addEventListener('click', function () {
      deleteTask(task.id);
    });

    // ── Keyboard events on edit input ─────────────────────────────────────────
    editInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter')  { saveEdit();    }
      if (e.key === 'Escape') { exitEditMode(); }
    });

    // ── Assemble <li> ─────────────────────────────────────────────────────────
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(editInput);
    li.appendChild(btnEdit);
    li.appendChild(btnSave);
    li.appendChild(btnCancel);
    li.appendChild(btnDelete);

    taskList.appendChild(li);
  });
}

// =============================================================================
// Task Manager — Add-task wiring and error-clear
// Requirements: 4.1, 4.3
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
  const taskInput  = document.getElementById('task-input');
  const btnAddTask = document.getElementById('btn-add-task');
  const taskError  = document.getElementById('task-error');

  // Wire the Add button
  if (btnAddTask) {
    btnAddTask.addEventListener('click', function () {
      if (taskInput) {
        addTask(taskInput.value);
        taskInput.value = ''; // clear the field after submitting
      }
    });
  }

  // Wire Enter key on the task input
  if (taskInput) {
    taskInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        addTask(taskInput.value);
        taskInput.value = '';
      }
    });

    // Clear #task-error on the next input interaction (Req 4.3)
    taskInput.addEventListener('input', function () {
      if (taskError) taskError.textContent = '';
    });
  }

  // Initial render from persisted state
  renderTasks();
});
