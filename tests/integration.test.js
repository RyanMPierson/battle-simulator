/**
 * @jest-environment jsdom
 */

const createTestableModule = require('./moduleLoader');

// Mock DOM
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
  setupArmyConfigUI,
  getArmyConfigs,
  runSimulation,
  showResults
} = battleModule;

describe('Army Battle Simulator - End-to-End Integration Tests', () => {
  
  beforeEach(() => {
    // Reset the DOM for each test
    document.getElementById('armies-list').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    document.getElementById('num-simulations').value = '10';
  });

  describe('Complete Battle Simulation Workflow', () => {
    test('should complete full simulation from setup to results', () => {
      // Step 1: Setup UI
      setupArmyConfigUI();
      
      // Step 2: Verify initial state
      const armiesList = document.getElementById('armies-list');
      expect(armiesList.children.length).toBe(2);
      
      // Step 3: Configure armies
      const army1 = armiesList.children[0];
      const army2 = armiesList.children[1];
      
      // Configure first army
      army1.querySelector('.army-name').value = 'Elite Forces';
      army1.querySelector('.army-size').value = '800';
      army1.querySelector('.army-training').value = '9';
      army1.querySelector('.army-weaponry').value = '8';
      army1.querySelector('.army-morale').value = '9';
      army1.querySelector('.army-home').value = '1';
      
      // Configure second army
      army2.querySelector('.army-name').value = 'Regular Army';
      army2.querySelector('.army-size').value = '1000';
      army2.querySelector('.army-training').value = '6';
      army2.querySelector('.army-weaponry').value = '7';
      army2.querySelector('.army-morale').value = '7';
      army2.querySelector('.army-visitor').value = '1';
      
      // Step 4: Set simulation parameters
      document.getElementById('num-simulations').value = '20';
      
      // Step 5: Run simulation
      const form = document.getElementById('battle-config');
      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn();
      form.dispatchEvent(submitEvent);
      
      // Step 6: Verify results
      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.innerHTML).toContain('Elite Forces');
      expect(resultsDiv.innerHTML).toContain('Regular Army');
      expect(resultsDiv.innerHTML).toContain('wins');
      expect(resultsDiv.innerHTML).toContain('Most influential stat');
      
      // Verify army summaries are shown
      expect(resultsDiv.innerHTML).toContain('Size: 800');
      expect(resultsDiv.innerHTML).toContain('Size: 1000');
      expect(resultsDiv.innerHTML).toContain('Training: 9');
      expect(resultsDiv.innerHTML).toContain('Training: 6');
    });

    test('should handle adding and removing armies dynamically', () => {
      setupArmyConfigUI();
      
      const armiesList = document.getElementById('armies-list');
      const addButton = document.getElementById('add-army');
      
      // Start with 2 armies
      expect(armiesList.children.length).toBe(2);
      
      // Add a third army
      addButton.click();
      expect(armiesList.children.length).toBe(3);
      
      // Configure the new army
      const newArmy = armiesList.children[2];
      newArmy.querySelector('.army-name').value = 'Mercenaries';
      newArmy.querySelector('.army-size').value = '600';
      newArmy.querySelector('.army-training').value = '7';
      
      // Remove the first army
      const removeButton = armiesList.children[0].querySelector('.remove-army');
      removeButton.click();
      expect(armiesList.children.length).toBe(2);
      
      // Run simulation with remaining armies
      const form = document.getElementById('battle-config');
      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn();
      form.dispatchEvent(submitEvent);
      
      // Verify results show the remaining armies
      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.innerHTML).toContain('Mercenaries');
      expect(resultsDiv.innerHTML).toContain('wins');
    });

    test('should handle preset selection and customization', (done) => {
      setupArmyConfigUI();
      
      const armiesList = document.getElementById('armies-list');
      const army1 = armiesList.children[0];
      
      // Select a preset
      const presetSelect = army1.querySelector('.preset-select');
      presetSelect.value = '0'; // SAS preset
      
      const event = new Event('change');
      presetSelect.dispatchEvent(event);
      
      setTimeout(() => {
        // Verify preset values were applied
        expect(army1.querySelector('.army-name').value).toBe('SAS (UK)');
        expect(army1.querySelector('.army-training').value).toBe('10');
        expect(army1.querySelector('.army-weaponry').value).toBe('9');
        
        // Customize the preset
        army1.querySelector('.army-size').value = '300';
        army1.querySelector('.army-morale').value = '8';
        
        // Run simulation
        const form = document.getElementById('battle-config');
        const submitEvent = new Event('submit');
        submitEvent.preventDefault = jest.fn();
        form.dispatchEvent(submitEvent);
        
        // Verify customized values in results
        const resultsDiv = document.getElementById('results');
        expect(resultsDiv.innerHTML).toContain('SAS (UK)');
        expect(resultsDiv.innerHTML).toContain('Size: 300');
        expect(resultsDiv.innerHTML).toContain('Morale: 8');
        
        done();
      }, 20);
    });

    test('should handle multiple army counts correctly', () => {
      setupArmyConfigUI();
      
      const armiesList = document.getElementById('armies-list');
      const army1 = armiesList.children[0];
      
      // Configure army with multiple count
      army1.querySelector('.army-name').value = 'Clone Army';
      army1.querySelector('.army-size').value = '500';
      army1.querySelector('.army-training').value = '8';
      army1.querySelector('.army-count').value = '3';
      
      // Remove second army for cleaner test
      const removeButton = armiesList.children[1].querySelector('.remove-army');
      removeButton.click();
      
      // Run simulation
      const form = document.getElementById('battle-config');
      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn();
      form.dispatchEvent(submitEvent);
      
      // Verify results show the army count
      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.innerHTML).toContain('Clone Army');
      expect(resultsDiv.innerHTML).toContain('x3');
    });

    test('should handle large number of simulations', () => {
      setupArmyConfigUI();
      
      // Set high simulation count
      document.getElementById('num-simulations').value = '100';
      
      // Run simulation
      const form = document.getElementById('battle-config');
      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn();
      
      const startTime = performance.now();
      form.dispatchEvent(submitEvent);
      const endTime = performance.now();
      
      // Should complete within reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
      
      // Verify results are shown
      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.innerHTML).toContain('wins');
      expect(resultsDiv.innerHTML).toContain('Most influential stat');
    });
  });

  describe('Data Consistency and Validation', () => {
    test('should maintain consistent army data throughout simulation', () => {
      setupArmyConfigUI();
      
      const armiesList = document.getElementById('armies-list');
      const army1 = armiesList.children[0];
      
      // Set specific values
      army1.querySelector('.army-name').value = 'Test Army';
      army1.querySelector('.army-size').value = '750';
      army1.querySelector('.army-training').value = '8';
      army1.querySelector('.army-weaponry').value = '7';
      army1.querySelector('.army-morale').value = '9';
      army1.querySelector('.army-tactics').value = '6';
      army1.querySelector('.army-logistics').value = '5';
      army1.querySelector('.army-tech').value = '8';
      army1.querySelector('.army-experience').value = '7';
      army1.querySelector('.army-leadership').value = '9';
      army1.querySelector('.army-terrain').value = '6';
      army1.querySelector('.army-home').value = '1';
      army1.querySelector('.army-visitor').value = '0';
      army1.querySelector('.army-count').value = '2';
      
      // Extract configuration
      const configs = getArmyConfigs();
      expect(configs[0]).toEqual({
        name: 'Test Army',
        size: 750,
        training: 8,
        weaponry: 7,
        morale: 9,
        tactics: 6,
        logistics: 5,
        tech: 8,
        experience: 7,
        leadership: 9,
        terrain: 6,
        home: 1,
        visitor: 0,
        count: 2
      });
      
      // Run simulation and verify data consistency
      const form = document.getElementById('battle-config');
      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn();
      form.dispatchEvent(submitEvent);
      
      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.innerHTML).toContain('Test Army');
      expect(resultsDiv.innerHTML).toContain('Size: 750');
      expect(resultsDiv.innerHTML).toContain('Training: 8');
      expect(resultsDiv.innerHTML).toContain('x2');
    });

    test('should handle statistical analysis correctly', () => {
      setupArmyConfigUI();
      
      const armiesList = document.getElementById('armies-list');
      
      // Configure armies with different stat profiles
      const army1 = armiesList.children[0];
      army1.querySelector('.army-name').value = 'High Training Army';
      army1.querySelector('.army-training').value = '10';
      army1.querySelector('.army-weaponry').value = '5';
      army1.querySelector('.army-morale').value = '5';
      
      const army2 = armiesList.children[1];
      army2.querySelector('.army-name').value = 'High Weaponry Army';
      army2.querySelector('.army-training').value = '5';
      army2.querySelector('.army-weaponry').value = '10';
      army2.querySelector('.army-morale').value = '5';
      
      // Run many simulations for statistical significance
      document.getElementById('num-simulations').value = '50';
      
      const form = document.getElementById('battle-config');
      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn();
      form.dispatchEvent(submitEvent);
      
      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.innerHTML).toContain('Most influential stat');
      expect(resultsDiv.innerHTML).toContain('High Training Army');
      expect(resultsDiv.innerHTML).toContain('High Weaponry Army');
    });
  });

  describe('Performance and Scalability', () => {
    test('should handle multiple armies efficiently', () => {
      setupArmyConfigUI();
      
      const armiesList = document.getElementById('armies-list');
      const addButton = document.getElementById('add-army');
      
      // Add several armies
      for (let i = 0; i < 5; i++) {
        addButton.click();
      }
      
      // Configure all armies
      Array.from(armiesList.children).forEach((army, index) => {
        army.querySelector('.army-name').value = `Army ${index + 1}`;
        army.querySelector('.army-size').value = String(500 + index * 100);
        army.querySelector('.army-training').value = String(5 + index);
      });
      
      // Run simulation
      const startTime = performance.now();
      const form = document.getElementById('battle-config');
      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn();
      form.dispatchEvent(submitEvent);
      const endTime = performance.now();
      
      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(500);
      
      // Verify all armies are in results
      const resultsDiv = document.getElementById('results');
      for (let i = 1; i <= 7; i++) { // 2 default + 5 added
        expect(resultsDiv.innerHTML).toContain(`Army ${i}`);
      }
    });

    test('should maintain accuracy with high army counts', () => {
      setupArmyConfigUI();
      
      const armiesList = document.getElementById('armies-list');
      const army1 = armiesList.children[0];
      
      // Set high count for single army
      army1.querySelector('.army-name').value = 'Mass Army';
      army1.querySelector('.army-count').value = '20';
      
      // Remove second army
      const removeButton = armiesList.children[1].querySelector('.remove-army');
      removeButton.click();
      
      // Run simulation
      const form = document.getElementById('battle-config');
      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn();
      form.dispatchEvent(submitEvent);
      
      const resultsDiv = document.getElementById('results');
      expect(resultsDiv.innerHTML).toContain('Mass Army');
      expect(resultsDiv.innerHTML).toContain('x20');
      expect(resultsDiv.innerHTML).toContain('wins');
    });
  });
});
