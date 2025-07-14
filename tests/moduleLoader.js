// Simple test approach - directly test the functions
const fs = require('fs');
const path = require('path');

// Read and execute the battle.js file
const battleJSPath = path.join(__dirname, '../assets/battle.js');
const battleJS = fs.readFileSync(battleJSPath, 'utf8');

// Create a test-friendly version by wrapping in a function
const createTestableModule = () => {
  // Mock the DOM environment with more complete implementation
  const mockElements = new Map();
  
  const createMockElement = (tag = 'div') => {
    const element = {
      tagName: tag.toUpperCase(),
      className: '',
      innerHTML: '',
      value: ['input', 'select', 'textarea'].includes(tag.toLowerCase()) ? '' : undefined,
      children: [],
      parentNode: null,
      
      querySelector: function(selector) {
        // Simple selector matching for tests
        if (selector.startsWith('.')) {
          const className = selector.substring(1);
          return findByClass(this, className);
        }
        if (selector.startsWith('#')) {
          const id = selector.substring(1);
          return findById(this, id);
        }
        // For tag selectors, just return a new element
        return createMockElement(selector);
      },
      
      querySelectorAll: function(selector) {
        if (selector.startsWith('.')) {
          const className = selector.substring(1);
          return findAllByClass(this, className);
        }
        return [];
      },
      
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      
      appendChild: function(child) {
        this.children.push(child);
        child.parentNode = this;
      },
      
      removeChild: function(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
          this.children.splice(index, 1);
          child.parentNode = null;
        }
      },
      
      click: function() {
        // Simulate click event
        const event = { type: 'click', preventDefault: jest.fn() };
        if (this.onclick) this.onclick(event);
      },
      
      dispatchEvent: function(event) {
        // Simple event dispatch simulation
        return true;
      },
      
      // Add support for innerHTML manipulation
      get innerHTML() {
        return this._innerHTML || '';
      },
      
      set innerHTML(value) {
        this._innerHTML = value;
        // Parse basic HTML structure for testing
        if (value.includes('input')) {
          this.children = []; // Clear existing children
          // Add mock input elements based on class names found
          const classMatches = value.match(/class="([^"]+)"/g) || [];
          classMatches.forEach(match => {
            const className = match.match(/class="([^"]+)"/)[1];
            const input = createMockElement('input');
            input.className = className;
            input.value = className.includes('size') ? '500' : '5';
            this.children.push(input);
          });
          
          // Add select elements
          const selectMatches = value.match(/class="([^"]*select[^"]*)"/g) || [];
          selectMatches.forEach(match => {
            const className = match.match(/class="([^"]+)"/)[1];
            const select = createMockElement('select');
            select.className = className;
            select.value = '';
            this.children.push(select);
          });
          
          // Add button elements
          const buttonMatches = value.match(/class="([^"]*button[^"]*)"/g) || [];
          buttonMatches.forEach(match => {
            const className = match.match(/class="([^"]+)"/)[1];
            const button = createMockElement('button');
            button.className = className;
            this.children.push(button);
          });
        }
      }
    };
    
    return element;
  };
  
  const findByClass = (parent, className) => {
    if (parent.className && parent.className.includes(className)) return parent;
    for (let child of parent.children) {
      const found = findByClass(child, className);
      if (found) return found;
    }
    return null;
  };
  
  const findAllByClass = (parent, className) => {
    const results = [];
    if (parent.className && parent.className.includes(className)) results.push(parent);
    for (let child of parent.children) {
      results.push(...findAllByClass(child, className));
    }
    return results;
  };
  
  const findById = (parent, id) => {
    if (parent.id === id) return parent;
    for (let child of parent.children) {
      const found = findById(child, id);
      if (found) return found;
    }
    return null;
  };

  const mockDocument = {
    createElement: createMockElement,
    
    getElementById: (id) => {
      // Return existing element if already created, otherwise create new
      if (mockElements.has(id)) {
        return mockElements.get(id);
      }
      
      const element = createMockElement();
      element.id = id;
      
      // Set up specific behaviors for known elements
      if (id === 'armies-list') {
        element.children = [];
      } else if (id === 'results') {
        element.innerHTML = '';
      } else if (id === 'num-simulations') {
        element.value = '10';
        element.tagName = 'INPUT';
      } else if (id === 'battle-config') {
        element.tagName = 'FORM';
        element.onsubmit = null;
      } else if (id === 'add-army') {
        element.tagName = 'BUTTON';
        element.onclick = null;
      }
      
      mockElements.set(id, element);
      return element;
    },
    
    addEventListener: jest.fn(),
    querySelectorAll: () => []
  };

  // Create a context with the mocked DOM
  const context = {
    document: mockDocument,
    setTimeout: global.setTimeout,
    console: global.console,
    Event: class Event {
      constructor(type) {
        this.type = type;
        this.preventDefault = jest.fn();
      }
    },
    performance: {
      now: () => Date.now()
    }
  };

  // Execute the battle.js code with our context
  const Function = global.Function;
  const wrappedCode = `
    ${battleJS}
    
    // Return the functions we need for testing
    return {
      ARMY_PRESETS,
      calculateArmyPower,
      runSimulation,
      summarizeArmy,
      createArmyConfig,
      getArmyConfigs,
      showResults,
      setupArmyConfigUI
    };
  `;

  const executor = new Function('document', 'setTimeout', 'console', 'Event', 'performance', wrappedCode);
  return executor(context.document, context.setTimeout, context.console, context.Event, context.performance);
};

module.exports = createTestableModule;
