/**
 * @jest-environment jsdom
 */

const createTestableModule = require('./moduleLoader');

// Mock DOM setup
document.body.innerHTML = `
  <div class="container">
    <h1>Army Battle Simulator</h1>
    <form id="battle-config">
      <h2>Configure Armies</h2>
      <div id="armies-list"></div>
      <button type="button" id="add-army">Add Army</button>
      <h2>Simulation Settings</h2>
      <label>Number of Simulations: <input type="number" id="num-simulations" value="10" min="1"></label>
      <button type="submit">Run Simulation</button>
    </form>
    <div id="results"></div>
  </div>
`;

// Load the battle.js functions
const battleModule = createTestableModule();

// Extract functions from the module
const {
  ARMY_PRESETS,
  createArmyConfig,
  getArmyConfigs,
  showResults,
  runSimulation,
  setupArmyConfigUI,
  calculateArmyPower
} = battleModule;

describe('Army Battle Simulator - UI Integration', () => {
  
  beforeEach(() => {
    // Reset the DOM for each test
    document.getElementById('armies-list').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    document.getElementById('num-simulations').value = '10';
  });

  describe('createArmyConfig', () => {
    test('should create army configuration div with all required inputs', () => {
      const armyDiv = createArmyConfig(0);
      
      expect(armyDiv).toBeDefined();
      expect(armyDiv.className).toBe('army-config');
      
      // Check for required input fields by checking innerHTML contains the classes
      expect(armyDiv.innerHTML).toContain('army-name');
      expect(armyDiv.innerHTML).toContain('army-size');
      expect(armyDiv.innerHTML).toContain('army-training');
      expect(armyDiv.innerHTML).toContain('army-weaponry');
      expect(armyDiv.innerHTML).toContain('army-morale');
      expect(armyDiv.innerHTML).toContain('army-tactics');
      expect(armyDiv.innerHTML).toContain('army-logistics');
      expect(armyDiv.innerHTML).toContain('army-tech');
      expect(armyDiv.innerHTML).toContain('army-experience');
      expect(armyDiv.innerHTML).toContain('army-leadership');
      expect(armyDiv.innerHTML).toContain('army-terrain');
      expect(armyDiv.innerHTML).toContain('army-home');
      expect(armyDiv.innerHTML).toContain('army-visitor');
      expect(armyDiv.innerHTML).toContain('army-count');
      expect(armyDiv.innerHTML).toContain('preset-select');
      expect(armyDiv.innerHTML).toContain('remove-army');
    });

    test('should create army config with preset values', () => {
      const preset = ARMY_PRESETS[0]; // SAS (UK)
      const armyDiv = createArmyConfig(0, preset);
      
      expect(armyDiv.innerHTML).toContain(preset.name);
      expect(armyDiv.innerHTML).toContain(preset.baseSize.toString());
      expect(armyDiv.innerHTML).toContain(`value="${preset.training}"`);
      expect(armyDiv.innerHTML).toContain(`value="${preset.weaponry}"`);
    });

    test('should create army config with default values when no preset', () => {
      const armyDiv = createArmyConfig(0);
      
      expect(armyDiv.innerHTML).toContain('value=""'); // default name
      expect(armyDiv.innerHTML).toContain('value="500"'); // default size
      expect(armyDiv.innerHTML).toContain('value="5"'); // default training
      expect(armyDiv.innerHTML).toContain('value="1"'); // default count
    });
  });

  describe('getArmyConfigs', () => {
    test('should extract army configurations from DOM', () => {
      const armiesList = document.getElementById('armies-list');
      
      // Add two army configurations
      const army1 = createArmyConfig(0);
      const army2 = createArmyConfig(1);
      
      army1.querySelector('.army-name').value = 'Test Army 1';
      army1.querySelector('.army-size').value = '300';
      army1.querySelector('.army-training').value = '7';
      
      army2.querySelector('.army-name').value = 'Test Army 2';
      army2.querySelector('.army-size').value = '800';
      army2.querySelector('.army-training').value = '9';
      
      armiesList.appendChild(army1);
      armiesList.appendChild(army2);
      
      const configs = getArmyConfigs();
      
      expect(configs).toHaveLength(2);
      expect(configs[0].name).toBe('Test Army 1');
      expect(configs[0].size).toBe(300);
      expect(configs[0].training).toBe(7);
      expect(configs[1].name).toBe('Test Army 2');
      expect(configs[1].size).toBe(800);
      expect(configs[1].training).toBe(9);
    });

    test('should handle empty armies list', () => {
      const configs = getArmyConfigs();
      expect(configs).toHaveLength(0);
    });

    test('should parse numeric values correctly', () => {
      const armiesList = document.getElementById('armies-list');
      const armyDiv = createArmyConfig(0);
      
      // Set some values
      armyDiv.querySelector('.army-size').value = '1000';
      armyDiv.querySelector('.army-training').value = '10';
      armyDiv.querySelector('.army-home').value = '2';
      armyDiv.querySelector('.army-count').value = '3';
      
      armiesList.appendChild(armyDiv);
      
      const configs = getArmyConfigs();
      expect(configs[0].size).toBe(1000);
      expect(configs[0].training).toBe(10);
      expect(configs[0].home).toBe(2);
      expect(configs[0].count).toBe(3);
    });
  });

  describe('showResults', () => {
    test('should display simulation results in results div', () => {
      const armies = [
        {
          name: 'Army A',
          size: 500,
          training: 5, weaponry: 5, morale: 5, tactics: 5,
          logistics: 5, tech: 5, experience: 5, leadership: 5, terrain: 5,
          home: 0, visitor: 0, count: 1
        },
        {
          name: 'Army B',
          size: 600,
          training: 7, weaponry: 7, morale: 7, tactics: 7,
          logistics: 7, tech: 7, experience: 7, leadership: 7, terrain: 7,
          home: 1, visitor: 0, count: 1
        }
      ];

      const simResults = [];
      for (let i = 0; i < 5; i++) {
        simResults.push(runSimulation(armies));
      }

      showResults(simResults, armies);

      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.innerHTML).toContain('Army A');
      expect(resultsDiv.innerHTML).toContain('Army B');
      expect(resultsDiv.innerHTML).toContain('wins');
      expect(resultsDiv.innerHTML).toContain('Most influential stat');
    });

    test('should show army summaries', () => {
      const armies = [
        {
          name: 'Test Army',
          size: 500,
          training: 8, weaponry: 7, morale: 6, tactics: 5,
          logistics: 4, tech: 3, experience: 2, leadership: 1, terrain: 9,
          home: 2, visitor: 1, count: 2
        }
      ];

      const simResults = [runSimulation(armies)];
      showResults(simResults, armies);

      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.innerHTML).toContain('Test Army');
      expect(resultsDiv.innerHTML).toContain('Size: 500');
      expect(resultsDiv.innerHTML).toContain('Training: 8');
      expect(resultsDiv.innerHTML).toContain('x2');
    });
  });

  describe('UI Setup and Event Handling', () => {
    test('should setup initial UI correctly', () => {
      // Clear and reinitialize
      document.getElementById('armies-list').innerHTML = '';
      
      setupArmyConfigUI();
      
      const armiesList = document.getElementById('armies-list');
      expect(armiesList.children.length).toBe(2); // Two default armies
      
      // Check that add army button exists and works
      const addButton = document.getElementById('add-army');
      expect(addButton).toBeTruthy();
      
      addButton.click();
      expect(armiesList.children.length).toBe(3);
    });

    test('should handle remove army button clicks', () => {
      setupArmyConfigUI();
      
      const armiesList = document.getElementById('armies-list');
      const initialCount = armiesList.children.length;
      
      // Click remove button on first army
      const removeButton = armiesList.children[0].querySelector('.remove-army');
      removeButton.click();
      
      expect(armiesList.children.length).toBe(initialCount - 1);
    });

    test('should handle form submission', () => {
      setupArmyConfigUI();
      
      const form = document.getElementById('battle-config');
      const event = new Event('submit');
      event.preventDefault = jest.fn();
      
      form.dispatchEvent(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      
      // Check that results are shown
      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.innerHTML).toContain('wins');
    });

    test('should handle preset selection', (done) => {
      const armyDiv = createArmyConfig(0);
      document.getElementById('armies-list').appendChild(armyDiv);
      
      const presetSelect = armyDiv.querySelector('.preset-select');
      presetSelect.value = '0'; // Select first preset (SAS)
      
      // Simulate change event
      const event = new Event('change');
      presetSelect.dispatchEvent(event);
      
      // Use setTimeout to allow async preset loading
      setTimeout(() => {
        expect(armyDiv.querySelector('.army-name').value).toBe(ARMY_PRESETS[0].name);
        expect(armyDiv.querySelector('.army-training').value).toBe(ARMY_PRESETS[0].training.toString());
        done();
      }, 10);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle armies with zero size', () => {
      const army = {
        name: 'Empty Army',
        size: 0,
        training: 5, weaponry: 5, morale: 5, tactics: 5,
        logistics: 5, tech: 5, experience: 5, leadership: 5, terrain: 5,
        home: 0, visitor: 0
      };

      const power = calculateArmyPower(army);
      expect(power).toBe(0);
    });

    test('should handle simulation with no armies', () => {
      const result = runSimulation([]);
      expect(result.results).toHaveLength(0);
      expect(result.winners).toHaveLength(0);
    });

    test('should handle armies with extreme stat values', () => {
      const extremeArmy = {
        name: 'Extreme Army',
        size: 10000,
        training: 10, weaponry: 10, morale: 10, tactics: 10,
        logistics: 10, tech: 10, experience: 10, leadership: 10, terrain: 10,
        home: 2, visitor: 0, count: 1
      };

      const power = calculateArmyPower(extremeArmy);
      expect(power).toBeGreaterThan(0);
      expect(isFinite(power)).toBe(true);
    });

    test('should handle missing DOM elements gracefully', () => {
      // Remove a required element
      const originalElement = document.getElementById('armies-list');
      originalElement.remove();
      
      // This should not throw an error
      expect(() => {
        const configs = getArmyConfigs();
      }).not.toThrow();
    });
  });
});
