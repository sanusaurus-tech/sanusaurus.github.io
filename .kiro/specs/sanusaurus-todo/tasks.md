# Implementation Plan: Sanusaurus To-Do App

## Overview

Build the complete Sanusaurus single-page productivity app in three files — `index.html`, `css/style.css`, and `js/app.js` — using HTML5, CSS, and vanilla JavaScript. The implementation progresses panel by panel: project scaffolding first, then the Greeting Panel, Focus Timer, Task Manager, and Quick Links, finishing with Local Storage wiring and full test coverage.

---

## Tasks

- [x] 1. Scaffold project structure and base HTML
  - Create `index.html` at the project root with the full page skeleton
  - Add `<link>` to `css/style.css` and `<script defer>` to `js/app.js`
  - Add all required DOM elements and IDs for every panel:
    - Greeting: `#clock`, `#date`, `#greeting`
    - Timer: `#timer-display`, `#btn-start`, `#btn-stop`, `#btn-reset`
    - Task Manager: `#task-input`, `#btn-add-task`, `#task-error`, `#task-list`
    - Quick Links: `#link-label-input`, `#link-url-input`, `#btn-add-link`, `#link-error`, `#links-container`
  - Create empty `css/style.css` and `js/app.js` placeholder files
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Implement the dark-blue theme and base CSS layout
  - [x] 2.1 Define CSS variables, reset, and global styles
    - Set up CSS custom properties for the dark-blue palette and colorful accent colours
    - Apply box-sizing reset, font stack, and base `body` background/colour
    - _Requirements: 1.4, 1.5_
  - [x] 2.2 Style the four panel sections
    - Write layout styles (flexbox/grid) for the four panels; add card styling, spacing, and responsive behaviour
    - Style inputs, buttons, checkboxes, and inline validation message elements (`.task-error`, `.link-error`)
    - Add `.completed` class rule with `text-decoration: line-through` for completed tasks
    - _Requirements: 1.4, 6.2_

- [x] 3. Implement the Greeting Panel module
  - [x] 3.1 Write `getGreeting(hour)`, `formatDate(date)`, and `startClock()`
    - Implement `getGreeting(hour)` — maps hours 0–23 to the four greeting strings
    - Implement `formatDate(date)` — returns a human-readable string (e.g., "Monday, 15 October 2026")
    - Implement `startClock()` — calls `setInterval` every 1000 ms; updates `#clock` (HH:MM:SS), `#date`, and `#greeting`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 3.2 Write property test — Property 1: Time formatting always produces HH:MM:SS
    - **Property 1: Time formatting always produces HH:MM:SS**
    - Generate random `Date` objects; assert the formatted time string matches `/^\d{2}:\d{2}:\d{2}$/`
    - **Validates: Requirements 2.1**

  - [ ]* 3.3 Write property test — Property 2: Date formatting always includes weekday, day, month, and year
    - **Property 2: Date formatting always includes weekday, day, month, and year**
    - Generate random `Date` objects; assert `formatDate()` output contains a full weekday name, numeric day, full month name, and four-digit year
    - **Validates: Requirements 2.2**

  - [ ]* 3.4 Write property test — Property 3: Greeting correctly maps every hour to the right message
    - **Property 3: Greeting correctly maps every hour to the right message**
    - For all integers 0–23, assert `getGreeting(hour)` returns the exact expected string per the mapping table
    - **Validates: Requirements 2.3, 2.4, 2.5, 2.6**

  - [ ]* 3.5 Write unit tests for the Greeting Panel
    - Test that `startClock()` updates `#clock`, `#date`, `#greeting` with fake timers (Vitest `useFakeTimers`)
    - Test `formatDate()` output on a known fixed date
    - _Requirements: 2.1, 2.2, 2.7_

- [x] 4. Implement the Focus Timer module
  - [x] 4.1 Write timer state variables and `formatTime(seconds)`
    - Declare `let timerSeconds = 1500` and `let timerInterval = null` as module-level variables
    - Implement `formatTime(seconds)` — returns a `"MM:SS"` string with zero-padded values
    - Set `#timer-display` initial text to `"25:00"` on page load
    - _Requirements: 3.1_

  - [x] 4.2 Implement `startTimer()`, `stopTimer()`, `resetTimer()`, and `handleTimerEnd()`
    - `startTimer()`: guard against `timerSeconds === 0`; set interval; disable `#btn-start`; call `handleTimerEnd()` when seconds reach 0
    - `stopTimer()`: guard against no active interval; clear interval; preserve `timerSeconds`
    - `resetTimer()`: clear interval; set `timerSeconds = 1500`; re-render display; re-enable `#btn-start`
    - `handleTimerEnd()`: clear interval; display a visual notification (e.g., alert or on-page banner)
    - Wire `#btn-start`, `#btn-stop`, `#btn-reset` click handlers
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 4.3 Write unit tests for the Focus Timer
    - Test initial display is `"25:00"`
    - Test Start disables `#btn-start`; Stop preserves remaining time; Reset returns to `"25:00"`
    - Test that reaching `00:00` stops the interval and triggers notification
    - Test that Start is ignored when `timerSeconds === 0`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [-] 5. Checkpoint — Greeting Panel and Timer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement Task Manager — data layer
  - [x] 6.1 Write `loadTasks()` and `saveTasks(tasks)`
    - `loadTasks()`: wrap `JSON.parse(localStorage.getItem('sanusaurus_tasks') || '[]')` in `try/catch`; return `[]` on error; log a console warning
    - `saveTasks(tasks)`: call `localStorage.setItem('sanusaurus_tasks', JSON.stringify(tasks))`
    - Declare module-level `let tasks = loadTasks()` to hold in-memory state
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 6.2 Write property test — Property 12: Task array serialisation round-trip preserves all data
    - **Property 12: Task array serialisation round-trip preserves all data**
    - Generate random arrays of `Task` objects; assert `JSON.parse(JSON.stringify(arr))` deeply equals the original array
    - **Validates: Requirements 8.2, 8.5**

  - [ ]* 6.3 Write unit tests for `loadTasks()` / `saveTasks()`
    - Test returns correct tasks for valid stored JSON
    - Test returns `[]` for `null`, empty string, and malformed JSON without throwing
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 7. Implement Task Manager — mutations and rendering
  - [x] 7.1 Implement `addTask(description)`, `editTask(id, newDescription)`, `toggleComplete(id)`, `deleteTask(id)`
    - `addTask`: trim input; reject and show `#task-error` for empty/whitespace; push new `Task` object (`id`, `description`, `completed: false`); call `saveTasks()`; call `renderTasks()`
    - `editTask`: trim new description; reject for empty/whitespace (retain original); update matching task; call `saveTasks()`; call `renderTasks()`
    - `toggleComplete`: flip `completed` on matching task; call `saveTasks()`; call `renderTasks()`
    - `deleteTask`: filter out matching task; call `saveTasks()`; call `renderTasks()`
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 7.2, 7.3_

  - [x] 7.2 Implement `renderTasks()`
    - Clear `#task-list`; for each task build an `<li class="task-item">` containing: checkbox (`.task-checkbox`), text span (`.task-text`), edit input (`.task-edit-input`, hidden by default), `.btn-edit`, `.btn-save`, `.btn-cancel`, `.btn-delete`
    - Apply `.completed` class to completed task items
    - Show/hide edit input and buttons based on edit mode flag
    - Wire all per-task button click handlers and keyboard events (Enter to save, Escape to cancel)
    - Wire `#btn-add-task` click and `#task-input` Enter key to `addTask()`
    - Clear `#task-error` on next input interaction
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2, 5.6, 6.1, 6.2_

  - [ ]* 7.3 Write property test — Property 4: Adding a valid task grows the task list by exactly one
    - **Property 4: Adding a valid task grows the task list by exactly one**
    - Generate a random existing task list and a random non-empty, non-whitespace description; assert list length increases by exactly one and the new task's description equals the trimmed input
    - **Validates: Requirements 4.2**

  - [ ]* 7.4 Write property test — Property 5: Whitespace-only descriptions are always rejected by addTask
    - **Property 5: Whitespace-only descriptions are always rejected by addTask**
    - Generate whitespace-only strings; assert `addTask()` does not increase list length and shows `#task-error`
    - **Validates: Requirements 4.5**

  - [ ]* 7.5 Write property test — Property 6: Adding a task persists it to Local Storage
    - **Property 6: Adding a task persists it to Local Storage**
    - After `addTask(description)`, deserialise `Task_Store` from `localStorage`; assert the array contains a task with the added description
    - **Validates: Requirements 4.4**

  - [ ]* 7.6 Write property test — Property 7: Editing a task with a valid description updates its stored value
    - **Property 7: Editing a task with a valid description updates its stored value**
    - For any existing task and any non-empty, non-whitespace new description, assert the task's stored description equals the trimmed new value after `editTask()`
    - **Validates: Requirements 5.3, 5.4**

  - [ ]* 7.7 Write property test — Property 8: Whitespace-only edits are always rejected
    - **Property 8: Whitespace-only edits are always rejected**
    - For any existing task and a whitespace-only new description, assert the task's description is unchanged after `editTask()`
    - **Validates: Requirements 5.5**

  - [ ]* 7.8 Write property test — Property 9: Toggling completion persists the new state to Local Storage
    - **Property 9: Toggling completion persists the new state to Local Storage**
    - After `toggleComplete(id)`, load from `localStorage`; assert the task's `completed` field is the flipped value
    - **Validates: Requirements 6.3**

  - [ ]* 7.9 Write property test — Property 10: Double-toggling completion returns a task to its original state
    - **Property 10: Double-toggling completion returns a task to its original state**
    - Call `toggleComplete(id)` twice; assert `completed` equals the original value for any initial state
    - **Validates: Requirements 6.4**

  - [ ]* 7.10 Write property test — Property 11: Deleting a task removes it from the list and from Local Storage
    - **Property 11: Deleting a task removes it from the list and from Local Storage**
    - For any non-empty task list, after `deleteTask(id)`, assert list length decreases by one, task is absent from in-memory list, and `localStorage` does not contain it
    - **Validates: Requirements 7.2, 7.3**

  - [ ]* 7.11 Write unit tests for Task Manager DOM
    - Assert `#task-input` and `#btn-add-task` are present
    - Assert each rendered task item has `.btn-edit`, `.btn-delete`, and `.task-checkbox`
    - Assert Edit mode shows pre-filled `.task-edit-input` and hides `.task-text`
    - Assert cancel returns to display mode with original text
    - _Requirements: 4.1, 5.1, 5.2, 5.6_

- [~] 8. Checkpoint — Task Manager
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement Quick Links — data layer
  - [x] 9.1 Write `loadLinks()`, `saveLinks(links)`, and `isValidUrl(url)`
    - `loadLinks()`: mirror `loadTasks()` pattern using key `'sanusaurus_links'`; return `[]` on error with console warning
    - `saveLinks(links)`: serialise links array to `'sanusaurus_links'`
    - `isValidUrl(url)`: return `true` only if `url` starts with `"http://"` or `"https://"`
    - Declare module-level `let links = loadLinks()`
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 9.2 Write property test — Property 17: Link array serialisation round-trip preserves all data
    - **Property 17: Link array serialisation round-trip preserves all data**
    - Generate random arrays of `Link` objects; assert `JSON.parse(JSON.stringify(arr))` deeply equals the original array
    - **Validates: Requirements 10.2, 10.5**

  - [ ]* 9.3 Write unit tests for `loadLinks()` / `saveLinks()`
    - Test returns correct links for valid stored JSON
    - Test returns `[]` for `null`, empty string, and malformed JSON without throwing
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 10. Implement Quick Links — mutations and rendering
  - [x] 10.1 Implement `addLink(label, url)` and `deleteLink(id)`
    - `addLink`: trim label; validate with `isValidUrl(url)`; reject with `#link-error` on invalid input; push new `Link` object; call `saveLinks()`; call `renderLinks()`
    - `deleteLink`: filter out matching link; call `saveLinks()`; call `renderLinks()`
    - _Requirements: 9.2, 9.3, 9.5, 9.6, 9.7_

  - [x] 10.2 Implement `renderLinks()`
    - Clear `#links-container`; for each link build an `<a class="link-btn" href="..." target="_blank">` and a `.btn-delete-link` button
    - Wire `.btn-delete-link` click handlers to `deleteLink(id)`
    - Wire `#btn-add-link` click to `addLink()`
    - Clear `#link-error` on next input interaction
    - _Requirements: 9.1, 9.4, 9.5_

  - [ ]* 10.3 Write property test — Property 13: Adding a valid link grows the links list by exactly one
    - **Property 13: Adding a valid link grows the links list by exactly one**
    - Generate a random existing links list and a random valid (non-empty label + valid URL); assert list grows by exactly one with matching label and URL
    - **Validates: Requirements 9.2**

  - [ ]* 10.4 Write property test — Property 14: Adding a link persists it to Local Storage
    - **Property 14: Adding a link persists it to Local Storage**
    - After `addLink(label, url)`, deserialise `Link_Store`; assert the array contains the added link
    - **Validates: Requirements 9.3**

  - [ ]* 10.5 Write property test — Property 15: Invalid link inputs are always rejected
    - **Property 15: Invalid link inputs are always rejected**
    - Generate empty/whitespace labels or URLs not starting with `http://`/`https://`; assert `addLink()` does not grow the list and shows `#link-error`
    - **Validates: Requirements 9.7**

  - [ ]* 10.6 Write property test — Property 16: Deleting a link removes it from the list and from Local Storage
    - **Property 16: Deleting a link removes it from the list and from Local Storage**
    - For any non-empty links list, after `deleteLink(id)`, assert list length decreases by one and `localStorage` does not contain it
    - **Validates: Requirements 9.6**

  - [ ]* 10.7 Write unit tests for Quick Links DOM
    - Assert `#link-label-input`, `#link-url-input`, and `#btn-add-link` are present
    - Assert each rendered link has a `.link-btn` anchor and a `.btn-delete-link` button
    - Assert clicking a link button triggers `window.open` with correct URL and `'_blank'` target (mock `window.open`)
    - _Requirements: 9.1, 9.4, 9.5_

- [ ] 11. Wire up `DOMContentLoaded` startup sequence
  - [~] 11.1 Register the `DOMContentLoaded` listener and call all startup functions
    - Add a single `document.addEventListener('DOMContentLoaded', ...)` at the bottom of `js/app.js`
    - Call `startClock()`, `renderTasks()`, and `renderLinks()` inside the listener
    - Initialise the timer display to `"25:00"`
    - _Requirements: 2.1, 8.1, 10.1_

  - [ ]* 11.2 Write integration tests for startup wiring
    - Mock `localStorage` with pre-seeded tasks and links; assert they render on `DOMContentLoaded`
    - Assert clock starts updating `#clock` after load (fake timers)
    - Assert timer display initialises to `"25:00"`
    - _Requirements: 2.1, 8.1, 10.1_

- [~] 12. Final checkpoint — Full test suite
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP.
- Property tests use **fast-check** with Vitest (`vitest --run`) and must run a minimum of 100 iterations each.
- DOM tests use Vitest's `environment: 'jsdom'` setting — no browser required.
- Each property test is annotated with its tag comment: `// Feature: sanusaurus-todo, Property N`.
- All code goes into exactly three files: `index.html`, `css/style.css`, `js/app.js`.
- Use `crypto.randomUUID()` for task/link IDs (with `Date.now().toString()` as a fallback for older browsers).
- Validation messages (`#task-error`, `#link-error`) are cleared on the next user input interaction, not immediately.

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "6.1", "9.1"] },
    { "id": 2, "tasks": ["2.2", "3.1", "4.1", "6.2", "6.3", "9.2", "9.3"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.4", "3.5", "4.2", "7.1", "10.1"] },
    { "id": 4, "tasks": ["4.3", "7.2", "10.2"] },
    { "id": 5, "tasks": ["7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "7.9", "7.10", "7.11", "10.3", "10.4", "10.5", "10.6", "10.7"] },
    { "id": 6, "tasks": ["11.1"] },
    { "id": 7, "tasks": ["11.2"] }
  ]
}
```
