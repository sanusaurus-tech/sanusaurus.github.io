# Requirements Document

## Introduction

Sanusaurus is a single-page, browser-based productivity app built with HTML5, CSS, and vanilla JavaScript. It combines a live greeting with the current time and date, a 25-minute Pomodoro-style focus timer, a full-featured to-do list, and a customizable quick-links bar. All user data (tasks and links) persists across page reloads via the browser's Local Storage API.

The application uses a single CSS file (`css/style.css`) and a single JavaScript file (`js/app.js`), following a clean, readable code style with a colorful dark-blue theme.

---

## Glossary

- **App**: The Sanusaurus single-page web application.
- **Greeting_Panel**: The UI section that displays the current time, date, and a time-based greeting message.
- **Clock**: The live time display component inside the Greeting_Panel.
- **Focus_Timer**: The 25-minute countdown timer component.
- **Task_Manager**: The to-do list component responsible for adding, editing, completing, and deleting tasks.
- **Task**: A single to-do item consisting of a text description and a completion state.
- **Task_Store**: The Local Storage key used to persist the task list (`sanusaurus_tasks`).
- **Quick_Links**: The customizable panel of user-defined bookmark buttons.
- **Link_Store**: The Local Storage key used to persist quick links (`sanusaurus_links`).
- **Local_Storage**: The browser's `window.localStorage` API used for client-side persistence.

---

## Requirements

### Requirement 1: Project Structure

**User Story:** As a developer, I want the project files organised into a strict folder structure, so that the codebase stays clean and maintainable.

#### Acceptance Criteria

1. THE App SHALL be delivered as a single `index.html` file at the project root.
2. THE App SHALL contain exactly one CSS file located at `css/style.css`.
3. THE App SHALL contain exactly one JavaScript file located at `js/app.js`.
4. THE App SHALL apply a dark-blue color theme with colorful accent highlights throughout all UI sections.
5. THE App SHALL use readable indentation (2 or 4 spaces) and descriptive variable/function names throughout `js/app.js` and `css/style.css`.

---

### Requirement 2: Greeting Panel

**User Story:** As a user, I want to see the current time, date, and a personalised greeting when I open the app, so that I feel welcomed and oriented.

#### Acceptance Criteria

1. WHEN the App loads, THE Greeting_Panel SHALL display the current local time in HH:MM:SS format, updating every second.
2. WHEN the App loads, THE Greeting_Panel SHALL display the current local date in a human-readable format (e.g., "Monday, 15 October 2026").
3. WHEN the local time is between 05:00 and 11:59, THE Greeting_Panel SHALL display the message "Good Morning".
4. WHEN the local time is between 12:00 and 17:59, THE Greeting_Panel SHALL display the message "Good Afternoon".
5. WHEN the local time is between 18:00 and 20:59, THE Greeting_Panel SHALL display the message "Good Evening".
6. WHEN the local time is between 21:00 and 04:59, THE Greeting_Panel SHALL display the message "Good Night".
7. THE Clock SHALL update the displayed time every 1000 milliseconds without requiring a page reload.

---

### Requirement 3: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with Start, Stop, and Reset controls, so that I can manage focused work sessions.

#### Acceptance Criteria

1. WHEN the App loads, THE Focus_Timer SHALL display an initial countdown value of 25:00 (minutes:seconds).
2. WHEN the user activates the Start button, THE Focus_Timer SHALL begin counting down from the current displayed value at one-second intervals.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the Start button to prevent duplicate timers.
4. WHEN the user activates the Stop button, THE Focus_Timer SHALL pause the countdown and preserve the current remaining time.
5. WHEN the user activates the Reset button, THE Focus_Timer SHALL stop any active countdown and reset the displayed value to 25:00.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and display a visual or audible notification to the user.
7. IF the Focus_Timer is already at 00:00, THEN THE Focus_Timer SHALL ignore any Start button activation.

---

### Requirement 4: To-Do List — Adding Tasks

**User Story:** As a user, I want to add new tasks to my list, so that I can track what I need to do.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide a text input field and an "Add" button for creating new tasks.
2. WHEN the user submits a non-empty task description (via the Add button or the Enter key), THE Task_Manager SHALL append the new Task to the task list.
3. WHEN a new Task is added, THE Task_Manager SHALL clear the text input field.
4. WHEN a new Task is added, THE Task_Manager SHALL save the updated task list to the Task_Store in Local_Storage.
5. IF the user attempts to submit an empty or whitespace-only task description, THEN THE Task_Manager SHALL reject the input and display an inline validation message.

---

### Requirement 5: To-Do List — Editing Tasks

**User Story:** As a user, I want to edit the text of an existing task, so that I can correct mistakes or update descriptions.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide an Edit control for each Task in the list.
2. WHEN the user activates the Edit control for a Task, THE Task_Manager SHALL replace the task's display text with an editable input pre-filled with the current task description.
3. WHEN the user confirms the edit (via a Save/confirm button or the Enter key), THE Task_Manager SHALL update the Task's description with the new non-empty text and return to display mode.
4. WHEN the user confirms the edit, THE Task_Manager SHALL save the updated task list to the Task_Store in Local_Storage.
5. IF the user attempts to confirm an edit with an empty or whitespace-only description, THEN THE Task_Manager SHALL reject the change and retain the original task description.
6. WHEN the user cancels the edit (via a Cancel button or the Escape key), THE Task_Manager SHALL discard the change and return the Task to display mode.

---

### Requirement 6: To-Do List — Completing Tasks

**User Story:** As a user, I want to mark tasks as done, so that I can track my progress.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide a checkbox or toggle control for each Task to mark it as complete.
2. WHEN the user marks a Task as complete, THE Task_Manager SHALL apply a visual distinction (e.g., strikethrough text) to differentiate completed tasks from pending tasks.
3. WHEN the user marks a Task as complete, THE Task_Manager SHALL save the updated completion state to the Task_Store in Local_Storage.
4. WHEN the user un-marks a completed Task, THE Task_Manager SHALL restore the Task to its pending visual state and update the Task_Store in Local_Storage.

---

### Requirement 7: To-Do List — Deleting Tasks

**User Story:** As a user, I want to delete tasks I no longer need, so that my list stays relevant.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide a Delete control for each Task in the list.
2. WHEN the user activates the Delete control for a Task, THE Task_Manager SHALL remove that Task from the list immediately.
3. WHEN a Task is deleted, THE Task_Manager SHALL save the updated task list to the Task_Store in Local_Storage.

---

### Requirement 8: To-Do List — Persistence

**User Story:** As a user, I want my tasks to survive page reloads, so that I do not lose my list when I close or refresh the browser tab.

#### Acceptance Criteria

1. WHEN the App loads, THE Task_Manager SHALL read all tasks from the Task_Store in Local_Storage and render them in the task list.
2. THE Task_Manager SHALL store tasks as a JSON-serialised array in the Task_Store key.
3. WHEN tasks are loaded from Local_Storage, THE Task_Manager SHALL preserve each Task's description and completion state.
4. IF the Task_Store key is absent or contains invalid JSON, THEN THE Task_Manager SHALL initialise with an empty task list without throwing a runtime error.
5. FOR ALL valid task arrays, serialising to JSON then parsing the JSON SHALL produce an equivalent task array (round-trip property).

---

### Requirement 9: Quick Links — Managing Links

**User Story:** As a user, I want to add and save buttons that open my favourite websites, so that I can access them quickly from the app.

#### Acceptance Criteria

1. THE Quick_Links panel SHALL provide an input for a link label and an input for a URL, plus an "Add Link" button.
2. WHEN the user submits a non-empty label and a valid URL (beginning with `http://` or `https://`), THE Quick_Links panel SHALL add a new link button to the panel.
3. WHEN a new link is added, THE Quick_Links panel SHALL save the updated links array to the Link_Store in Local_Storage.
4. WHEN the user activates a link button, THE App SHALL open the associated URL in a new browser tab.
5. THE Quick_Links panel SHALL provide a Delete control for each link button, allowing the user to remove individual links.
6. WHEN a link is deleted, THE Quick_Links panel SHALL save the updated links array to the Link_Store in Local_Storage.
7. IF the user attempts to add a link with an empty label or a URL that does not begin with `http://` or `https://`, THEN THE Quick_Links panel SHALL reject the input and display an inline validation message.

---

### Requirement 10: Quick Links — Persistence

**User Story:** As a user, I want my quick links to survive page reloads, so that my bookmarks are always available.

#### Acceptance Criteria

1. WHEN the App loads, THE Quick_Links panel SHALL read all links from the Link_Store in Local_Storage and render them as buttons.
2. THE Quick_Links panel SHALL store links as a JSON-serialised array of objects (each with `label` and `url` properties) in the Link_Store key.
3. WHEN links are loaded from Local_Storage, THE Quick_Links panel SHALL preserve each link's label and URL.
4. IF the Link_Store key is absent or contains invalid JSON, THEN THE Quick_Links panel SHALL initialise with an empty links list without throwing a runtime error.
5. FOR ALL valid link arrays, serialising to JSON then parsing the JSON SHALL produce an equivalent links array (round-trip property).
