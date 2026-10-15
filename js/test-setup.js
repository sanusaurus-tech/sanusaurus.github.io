/**
 * Test helper — loads app.js into the jsdom global scope.
 *
 * Because app.js uses plain global functions (no ES module exports),
 * we read the source and evaluate it in the current (jsdom) global so
 * all functions land on `globalThis`.
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Minimal DOM setup required by app.js — creates every element that the
 * module-level code or DOMContentLoaded handlers reference.
 */
export function setupDOM() {
  document.body.innerHTML = `
    <span id="clock"></span>
    <span id="date"></span>
    <h2 id="greeting"></h2>

    <span id="timer-display"></span>
    <button id="btn-start">Start</button>
    <button id="btn-stop">Stop</button>
    <button id="btn-reset">Reset</button>

    <input id="task-input" type="text" />
    <button id="btn-add-task">Add</button>
    <span id="task-error"></span>
    <ul id="task-list"></ul>

    <input id="link-label-input" type="text" />
    <input id="link-url-input" type="text" />
    <button id="btn-add-link">Add Link</button>
    <span id="link-error"></span>
    <div id="links-container"></div>
  `;
}

/**
 * Loads and evaluates app.js in the current global scope.
 * Call setupDOM() before this so the module-level localStorage reads
 * don't fail before DOMContentLoaded handlers are wired.
 */
export function loadApp() {
  const src = readFileSync(resolve(__dirname, 'app.js'), 'utf8');
  // eslint-disable-next-line no-eval
  (0, eval)(src);
}
