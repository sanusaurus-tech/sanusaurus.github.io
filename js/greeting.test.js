/**
 * Unit tests — Greeting Panel
 * Tests: getGreeting(hour), formatDate(date), startClock()
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { setupDOM, loadApp } from './test-setup.js';

// Load app.js once; functions are exposed on globalThis.
beforeAll(() => {
  setupDOM();
  loadApp();
});

// ─── getGreeting ─────────────────────────────────────────────────────────────

describe('getGreeting(hour)', () => {
  it('returns "Good Night" for midnight (0)', () => {
    expect(getGreeting(0)).toBe('Good Night');
  });

  it('returns "Good Night" for hours 1–4', () => {
    for (let h = 1; h <= 4; h++) {
      expect(getGreeting(h)).toBe('Good Night');
    }
  });

  it('returns "Good Morning" for hours 5–11', () => {
    for (let h = 5; h <= 11; h++) {
      expect(getGreeting(h)).toBe('Good Morning');
    }
  });

  it('returns "Good Afternoon" for hours 12–17', () => {
    for (let h = 12; h <= 17; h++) {
      expect(getGreeting(h)).toBe('Good Afternoon');
    }
  });

  it('returns "Good Evening" for hours 18–20', () => {
    for (let h = 18; h <= 20; h++) {
      expect(getGreeting(h)).toBe('Good Evening');
    }
  });

  it('returns "Good Night" for hours 21–23', () => {
    for (let h = 21; h <= 23; h++) {
      expect(getGreeting(h)).toBe('Good Night');
    }
  });
});

// ─── formatDate ──────────────────────────────────────────────────────────────

describe('formatDate(date)', () => {
  it('formats a known date correctly — Monday, 15 October 2018', () => {
    // 15 Oct 2018 was a Monday
    const d = new Date(2018, 9, 15); // month is 0-indexed
    const result = formatDate(d);
    expect(result).toContain('Monday');
    expect(result).toContain('15');
    expect(result).toContain('October');
    expect(result).toContain('2018');
  });

  it('output contains a weekday name', () => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const result = formatDate(new Date(2024, 0, 1)); // 1 Jan 2024 — Monday
    expect(weekdays.some(d => result.includes(d))).toBe(true);
  });

  it('output contains the numeric day', () => {
    const d = new Date(2024, 5, 7); // 7 June 2024
    const result = formatDate(d);
    expect(result).toContain('7');
  });

  it('output contains a full month name', () => {
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    const d = new Date(2024, 5, 7); // June
    const result = formatDate(d);
    expect(months.some(m => result.includes(m))).toBe(true);
  });

  it('output contains a four-digit year', () => {
    const d = new Date(2026, 3, 21);
    const result = formatDate(d);
    expect(result).toContain('2026');
  });
});

// ─── startClock ──────────────────────────────────────────────────────────────

describe('startClock()', () => {
  beforeEach(() => {
    // Provide fresh DOM elements and fake timers per test
    document.getElementById('clock').textContent = '';
    document.getElementById('date').textContent = '';
    document.getElementById('greeting').textContent = '';
    vi.useFakeTimers();
  });

  it('updates #clock to HH:MM:SS format immediately on call', () => {
    // Set a deterministic time: 14:05:09
    vi.setSystemTime(new Date(2024, 0, 15, 14, 5, 9));
    startClock();
    expect(document.getElementById('clock').textContent).toBe('14:05:09');
    vi.useRealTimers();
  });

  it('updates #date on call', () => {
    vi.setSystemTime(new Date(2024, 0, 15, 14, 5, 9));
    startClock();
    const dateText = document.getElementById('date').textContent;
    expect(dateText).toContain('2024');
    vi.useRealTimers();
  });

  it('updates #greeting on call', () => {
    vi.setSystemTime(new Date(2024, 0, 15, 14, 5, 9)); // hour 14 → Good Afternoon
    startClock();
    expect(document.getElementById('greeting').textContent).toBe('Good Afternoon');
    vi.useRealTimers();
  });

  it('updates #clock again after 1 second via setInterval', () => {
    vi.setSystemTime(new Date(2024, 0, 15, 14, 5, 9));
    startClock();
    // Advance clock by 1 second
    vi.advanceTimersByTime(1000);
    const clockText = document.getElementById('clock').textContent;
    // Should now be 14:05:10
    expect(clockText).toBe('14:05:10');
    vi.useRealTimers();
  });
});
