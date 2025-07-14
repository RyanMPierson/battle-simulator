/**
 * Test for preset selection behavior
 * Tests that when a preset is selected, it stays selected instead of reverting to "Custom"
 */

const createTestableModule = require('./moduleLoader');

// Load the battle.js functions
const battleModule = createTestableModule();

// Extract functions from the module
const {
  ARMY_PRESETS,
  createArmyConfig
} = battleModule;

describe('Preset Selection Behavior', () => {
  
  describe('Initial Preset Selection', () => {
    test('should set preset select value when creating army with preset', () => {
      const sasPreset = ARMY_PRESETS[0]; // SAS (UK)
      const armyDiv = createArmyConfig(0, sasPreset);
      
      // Check that the preset select shows the correct preset
      expect(armyDiv.innerHTML).toContain('value="0" selected');
      expect(armyDiv.innerHTML).toContain(sasPreset.name);
      
      // Check that the preset values are populated
      expect(armyDiv.innerHTML).toContain(`value="${sasPreset.name}"`);
      expect(armyDiv.innerHTML).toContain(`value="${sasPreset.baseSize}"`);
      expect(armyDiv.innerHTML).toContain(`value="${sasPreset.training}"`);
    });

    test('should show "Custom" when no preset is provided', () => {
      const armyDiv = createArmyConfig(0);
      
      // Check that Custom is selected by default
      expect(armyDiv.innerHTML).toContain('<option value="">Custom</option>');
      expect(armyDiv.innerHTML).not.toContain('selected');
    });

    test('should correctly identify preset index for different armies', () => {
      const usMarinesPreset = ARMY_PRESETS[1]; // US Marines
      const romanPreset = ARMY_PRESETS[7]; // Roman Legion
      
      const marinesDiv = createArmyConfig(0, usMarinesPreset);
      const romanDiv = createArmyConfig(0, romanPreset);
      
      // Check that correct preset indices are selected
      expect(marinesDiv.innerHTML).toContain('value="1" selected');
      expect(marinesDiv.innerHTML).toContain('US Marines');
      
      expect(romanDiv.innerHTML).toContain('value="7" selected');
      expect(romanDiv.innerHTML).toContain('Roman Legion');
    });
  });

  describe('Preset Selection Persistence', () => {
    test('should maintain preset selection after creation', () => {
      const spartanPreset = ARMY_PRESETS.find(p => p.name === 'Spartan Hoplites');
      const armyDiv = createArmyConfig(0, spartanPreset);
      
      // The preset should be selected in the dropdown
      const presetIndex = ARMY_PRESETS.findIndex(p => p.name === 'Spartan Hoplites');
      expect(armyDiv.innerHTML).toContain(`value="${presetIndex}" selected`);
      
      // The army stats should match the preset
      expect(armyDiv.innerHTML).toContain(`value="${spartanPreset.training}"`);
      expect(armyDiv.innerHTML).toContain(`value="${spartanPreset.weaponry}"`);
      expect(armyDiv.innerHTML).toContain(`value="${spartanPreset.morale}"`);
    });

    test('should handle all preset armies correctly', () => {
      ARMY_PRESETS.forEach((preset, index) => {
        const armyDiv = createArmyConfig(0, preset);
        
        // Check that the correct preset is selected
        expect(armyDiv.innerHTML).toContain(`value="${index}" selected`);
        expect(armyDiv.innerHTML).toContain(preset.name);
        
        // Check that the stats are populated
        expect(armyDiv.innerHTML).toContain(`value="${preset.training}"`);
        expect(armyDiv.innerHTML).toContain(`value="${preset.baseSize}"`);
      });
    });
  });

  describe('Maximum Simulations Setting', () => {
    test('should verify max simulations is set to 1 million', () => {
      // This test checks that the HTML has been updated correctly
      const fs = require('fs');
      const path = require('path');
      
      const htmlPath = path.join(__dirname, '../index.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      // Check that the max attribute is set to 1000000
      expect(htmlContent).toContain('max="1000000"');
      expect(htmlContent).toContain('id="num-simulations"');
    });
  });

  describe('Edge Cases', () => {
    test('should handle preset not found in ARMY_PRESETS', () => {
      const fakePreset = {
        name: 'Fake Army',
        baseSize: 500,
        training: 5,
        weaponry: 5,
        morale: 5,
        tactics: 5,
        logistics: 5,
        tech: 5,
        experience: 5,
        leadership: 5,
        terrain: 5,
        homeAdvantage: 0  // Changed to 0 to avoid "selected" in home advantage
      };
      
      const armyDiv = createArmyConfig(0, fakePreset);
      
      // Should not have any preset selected in the preset dropdown
      expect(armyDiv.innerHTML).not.toContain('value="0" selected');
      expect(armyDiv.innerHTML).not.toContain('value="1" selected');
      
      // But should still populate the values
      expect(armyDiv.innerHTML).toContain(`value="${fakePreset.name}"`);
      expect(armyDiv.innerHTML).toContain(`value="${fakePreset.baseSize}"`);
    });

    test('should handle null preset gracefully', () => {
      const armyDiv = createArmyConfig(0, null);
      
      // Should show default values
      expect(armyDiv.innerHTML).toContain('value=""'); // empty name
      expect(armyDiv.innerHTML).toContain('value="500"'); // default size
      expect(armyDiv.innerHTML).toContain('value="5"'); // default training
      
      // Should not have any preset selected
      expect(armyDiv.innerHTML).not.toContain('selected');
    });
  });
});
