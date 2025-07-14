// Jest setup file
require('@testing-library/jest-dom');

// Mock DOM APIs that might not be available in Jest environment
global.HTMLElement = window.HTMLElement;
global.HTMLInputElement = window.HTMLInputElement;
global.HTMLSelectElement = window.HTMLSelectElement;
global.HTMLTextAreaElement = window.HTMLTextAreaElement;

// Add custom matchers for better testing
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});
