/**
 * Unit tests — Focus Timer
 * Tests: formatTime(seconds), startTimer(), stopTimer(), resetTimer(), handleTimerEnd()
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setupDOM, loadApp } from './test-setup.js';

// ─── Setup ────────────────────────────────────────────────────────────────────
// We need a fresh DOM + fresh app state for every timer test because the
// module-level timerSeconds / timerInterval variables persist across tests
// when loaded once.  We reload the app before each test to get clean state.

beforeEach(() => {
  // Clear localStorage so loadTasks / loadLinks don't throw.
  localStorage.clear();
  setupDOM();
  loadApp();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ─── formatTime ───────────────────────────────────────────────────────────────

describe('formatTime(seconds)', () => {
  it('formats 1500 as "25:00"', () => {
    expect(formatTime(1500)).toBe('25:00');
  });

  it('formats 0 as "00:00"', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats 65 as "01:05"', () => {
    expect(formatTime(65)).toBe('01:05');
  });

  it('formats 59 as "00:59"', () => {
    expect(formatTime(59)).toBe('00:59');
  });

  it('formats 3600 as "60:00"', () => {
    expect(formatTime(3600)).toBe('60:00');
  });

  it('zero-pads both minutes and seconds', () => {
    const result = formatTime(5); // 0 minutes, 5 seconds
    expect(result).toMatch(/^\d{2}:\d{2}$/);
    expect(result).toBe('00:05');
  });
});

// ─── Initial display ──────────────────────────────────────────────────────────

describe('Timer initial state', () => {
  it('#timer-display shows "25:00" after DOMContentLoaded fires', () => {
    // DOMContentLoaded is fired by jsdom when the document is loaded.
    // loadApp() evaluates the script which registers the listener; we need to
    // dispatch the event to trigger it.
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(document.getElementById('timer-display').textContent).toBe('25:00');
  });
});

// ─── startTimer ───────────────────────────────────────────────────────────────

describe('startTimer()', () => {
  it('disables #btn-start when timer is running', () => {
    startTimer();
    expect(document.getElementById('btn-start').disabled).toBe(true);
  });

  it('decrements the display after 1 second', () => {
    // Set up initial display
    document.getElementById('timer-display').textContent = '25:00';
    startTimer();
    vi.advanceTimersByTime(1000);
    expect(document.getElementById('timer-display').textContent).toBe('24:59');
  });

  it('does nothing when timerSeconds is 0', () => {
    // Force timerSeconds to 0 by running down the timer
    // We can reset to 0 by calling resetTimer then manually setting state via
    // the public API: start and advance 1500 seconds.
    // Simpler: call startTimer() with seconds already at 0 by fast-forwarding
    // through a fresh timer entirely.
    startTimer();
    vi.advanceTimersByTime(1500 * 1000); // run to 0 — handleTimerEnd fires
    // timerSeconds is now 0; start button should be re-enabled
    const btnStart = document.getElementById('btn-start');
    expect(btnStart.disabled).toBe(false);
    // Starting again when at 0 should be a no-op
    startTimer(); // should not start
    expect(btnStart.disabled).toBe(false); // still not disabled = no-op
  });
});

// ─── stopTimer ────────────────────────────────────────────────────────────────

describe('stopTimer()', () => {
  it('does not throw when called with no active timer', () => {
    expect(() => stopTimer()).not.toThrow();
  });

  it('preserves timerSeconds when stopped mid-run', () => {
    document.getElementById('timer-display').textContent = '25:00';
    startTimer();
    vi.advanceTimersByTime(5000); // 5 seconds elapsed
    stopTimer();
    // Display should show 24:55
    expect(document.getElementById('timer-display').textContent).toBe('24:55');
  });

  it('stops counting down after stopTimer()', () => {
    document.getElementById('timer-display').textContent = '25:00';
    startTimer();
    vi.advanceTimersByTime(3000); // 3 seconds
    stopTimer();
    const displayAfterStop = document.getElementById('timer-display').textContent;
    vi.advanceTimersByTime(5000); // 5 more seconds — should NOT change display
    expect(document.getElementById('timer-display').textContent).toBe(displayAfterStop);
  });
});

// ─── resetTimer ───────────────────────────────────────────────────────────────

describe('resetTimer()', () => {
  it('resets display to "25:00"', () => {
    startTimer();
    vi.advanceTimersByTime(10000);
    resetTimer();
    expect(document.getElementById('timer-display').textContent).toBe('25:00');
  });

  it('re-enables #btn-start after reset', () => {
    startTimer(); // disables btn-start
    resetTimer();
    expect(document.getElementById('btn-start').disabled).toBe(false);
  });

  it('stops an active countdown', () => {
    startTimer();
    vi.advanceTimersByTime(3000);
    resetTimer();
    const displayAfterReset = document.getElementById('timer-display').textContent;
    vi.advanceTimersByTime(5000); // should not count down after reset
    expect(document.getElementById('timer-display').textContent).toBe(displayAfterReset);
  });
});

// ─── handleTimerEnd ───────────────────────────────────────────────────────────

describe('handleTimerEnd()', () => {
  it('sets display to "00:00" when called', () => {
    handleTimerEnd();
    expect(document.getElementById('timer-display').textContent).toBe('00:00');
  });

  it('re-enables #btn-start when called', () => {
    document.getElementById('btn-start').disabled = true;
    handleTimerEnd();
    expect(document.getElementById('btn-start').disabled).toBe(false);
  });

  it('display reaches "00:00" when countdown completes naturally', () => {
    startTimer();
    vi.advanceTimersByTime(1500 * 1000); // full 25 minutes
    expect(document.getElementById('timer-display').textContent).toBe('00:00');
  });
});
