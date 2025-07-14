// Test helper to extract functions from battle.js
const fs = require('fs');
const path = require('path');

// Read the battle.js file
const battleJS = fs.readFileSync(path.join(__dirname, '../assets/battle.js'), 'utf8');

// Create a mock DOM environment for functions that need it
const mockDOM = () => {
  global.document = {
    createElement: (tag) => {
      const element = {
        className: '',
        innerHTML: '',
        querySelector: (selector) => {
          // Mock querySelector to return mock elements
          return {
            value: '5',
            addEventListener: () => {},
            dispatchEvent: () => {}
          };
        },
        querySelectorAll: () => [],
        addEventListener: () => {},
        dispatchEvent: () => {}
      };
      return element;
    },
    getElementById: (id) => {
      return {
        children: [],
        innerHTML: '',
        value: '10',
        appendChild: () => {},
        removeChild: () => {},
        querySelector: () => ({
          value: '5',
          addEventListener: () => {}
        }),
        querySelectorAll: () => []
      };
    },
    addEventListener: () => {},
    querySelectorAll: () => []
  };
};

// Execute the battle.js code in a controlled environment
const loadBattleJS = () => {
  mockDOM();
  
  // Execute the code in the global scope
  const vm = require('vm');
  const context = {
    ...global,
    document: global.document,
    setTimeout: global.setTimeout,
    console: global.console
  };
  
  vm.createContext(context);
  vm.runInContext(battleJS, context);
  
  return context;
};

module.exports = loadBattleJS;
