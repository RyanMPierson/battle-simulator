/**
 * @jest-environment jsdom
 */

const createTestableModule = require('./moduleLoader');

// Load the battle.js functions
const battleModule = createTestableModule();

// Extract functions from the module
const {
  ARMY_PRESETS,
  calculateArmyPower,
  runSimulation,
  summarizeArmy
} = battleModule;

describe('Army Battle Simulator - Core Functions', () => {
  
  describe('ARMY_PRESETS', () => {
    test('should contain at least 15 army presets', () => {
      expect(ARMY_PRESETS).toBeDefined();
      expect(ARMY_PRESETS.length).toBeGreaterThanOrEqual(15);
    });

    test('each preset should have all required properties', () => {
      const requiredProps = [
        'name', 'training', 'weaponry', 'morale', 'tactics', 
        'logistics', 'tech', 'experience', 'leadership', 
        'terrain', 'homeAdvantage', 'baseSize'
      ];

      ARMY_PRESETS.forEach(preset => {
        requiredProps.forEach(prop => {
          expect(preset).toHaveProperty(prop);
          expect(typeof preset[prop]).toBe('number', `${prop} should be a number for ${preset.name}`);
        });
        expect(typeof preset.name).toBe('string');
      });
    });

    test('stat values should be within valid ranges (1-10)', () => {
      const statProps = [
        'training', 'weaponry', 'morale', 'tactics', 
        'logistics', 'tech', 'experience', 'leadership', 'terrain'
      ];

      ARMY_PRESETS.forEach(preset => {
        statProps.forEach(stat => {
          expect(preset[stat]).toBeWithinRange(1, 10);
        });
        expect(preset.homeAdvantage).toBeWithinRange(0, 2);
        expect(preset.baseSize).toBeGreaterThan(0);
      });
    });
  });

  describe('calculateArmyPower', () => {
    test('should calculate power for a basic army', () => {
      const army = {
        size: 500,
        training: 5,
        weaponry: 5,
        morale: 5,
        tactics: 5,
        logistics: 5,
        tech: 5,
        experience: 5,
        leadership: 5,
        terrain: 5,
        home: 0,
        visitor: 0
      };

      const power = calculateArmyPower(army);
      expect(power).toBeGreaterThan(0);
      expect(typeof power).toBe('number');
    });

    test('should give higher power to armies with better stats', () => {
      const weakArmy = {
        size: 500,
        training: 1, weaponry: 1, morale: 1, tactics: 1,
        logistics: 1, tech: 1, experience: 1, leadership: 1, terrain: 1,
        home: 0, visitor: 0
      };

      const strongArmy = {
        size: 500,
        training: 10, weaponry: 10, morale: 10, tactics: 10,
        logistics: 10, tech: 10, experience: 10, leadership: 10, terrain: 10,
        home: 0, visitor: 0
      };

      // Run multiple times due to randomness and check average
      let weakTotal = 0, strongTotal = 0;
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        weakTotal += calculateArmyPower(weakArmy);
        strongTotal += calculateArmyPower(strongArmy);
      }

      const weakAvg = weakTotal / iterations;
      const strongAvg = strongTotal / iterations;

      expect(strongAvg).toBeGreaterThan(weakAvg);
    });

    test('should apply home advantage correctly', () => {
      const baseArmy = {
        size: 500,
        training: 5, weaponry: 5, morale: 5, tactics: 5,
        logistics: 5, tech: 5, experience: 5, leadership: 5, terrain: 5,
        home: 0, visitor: 0
      };

      const homeArmy = { ...baseArmy, home: 1 };
      const strongHomeArmy = { ...baseArmy, home: 2 };

      // Test multiple times due to randomness
      let baseTotal = 0, homeTotal = 0, strongHomeTotal = 0;
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        baseTotal += calculateArmyPower(baseArmy);
        homeTotal += calculateArmyPower(homeArmy);
        strongHomeTotal += calculateArmyPower(strongHomeArmy);
      }

      const baseAvg = baseTotal / iterations;
      const homeAvg = homeTotal / iterations;
      const strongHomeAvg = strongHomeTotal / iterations;

      expect(homeAvg).toBeGreaterThan(baseAvg);
      expect(strongHomeAvg).toBeGreaterThan(homeAvg);
    });

    test('should apply visitor disadvantage correctly', () => {
      const baseArmy = {
        size: 500,
        training: 5, weaponry: 5, morale: 5, tactics: 5,
        logistics: 5, tech: 5, experience: 5, leadership: 5, terrain: 5,
        home: 0, visitor: 0
      };

      const visitorArmy = { ...baseArmy, visitor: 1 };

      // Test multiple times due to randomness
      let baseTotal = 0, visitorTotal = 0;
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        baseTotal += calculateArmyPower(baseArmy);
        visitorTotal += calculateArmyPower(visitorArmy);
      }

      const baseAvg = baseTotal / iterations;
      const visitorAvg = visitorTotal / iterations;

      expect(visitorAvg).toBeLessThan(baseAvg);
    });

    test('should scale with army size', () => {
      const smallArmy = {
        size: 100,
        training: 5, weaponry: 5, morale: 5, tactics: 5,
        logistics: 5, tech: 5, experience: 5, leadership: 5, terrain: 5,
        home: 0, visitor: 0
      };

      const largeArmy = { ...smallArmy, size: 1000 };

      // Test multiple times due to randomness
      let smallTotal = 0, largeTotal = 0;
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        smallTotal += calculateArmyPower(smallArmy);
        largeTotal += calculateArmyPower(largeArmy);
      }

      const smallAvg = smallTotal / iterations;
      const largeAvg = largeTotal / iterations;

      expect(largeAvg).toBeGreaterThan(smallAvg * 5); // Should be roughly 10x
    });
  });

  describe('runSimulation', () => {
    test('should return simulation results with expected structure', () => {
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
          size: 500,
          training: 7, weaponry: 7, morale: 7, tactics: 7,
          logistics: 7, tech: 7, experience: 7, leadership: 7, terrain: 7,
          home: 0, visitor: 0, count: 1
        }
      ];

      const result = runSimulation(armies);

      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('winners');
      expect(Array.isArray(result.results)).toBe(true);
      expect(Array.isArray(result.winners)).toBe(true);
      expect(result.results).toHaveLength(2);
      expect(result.winners.length).toBeGreaterThanOrEqual(1);
    });

    test('should handle multiple army counts correctly', () => {
      const armies = [
        {
          name: 'Army A',
          size: 500,
          training: 5, weaponry: 5, morale: 5, tactics: 5,
          logistics: 5, tech: 5, experience: 5, leadership: 5, terrain: 5,
          home: 0, visitor: 0, count: 2
        }
      ];

      const result = runSimulation(armies);
      expect(result.results).toHaveLength(2);
      expect(result.results[0].name).toBe('Army A');
      expect(result.results[1].name).toBe('Army A');
    });

    test('should determine winners correctly', () => {
      const armies = [
        {
          name: 'Weak Army',
          size: 100,
          training: 1, weaponry: 1, morale: 1, tactics: 1,
          logistics: 1, tech: 1, experience: 1, leadership: 1, terrain: 1,
          home: 0, visitor: 0, count: 1
        },
        {
          name: 'Strong Army',
          size: 1000,
          training: 10, weaponry: 10, morale: 10, tactics: 10,
          logistics: 10, tech: 10, experience: 10, leadership: 10, terrain: 10,
          home: 2, visitor: 0, count: 1
        }
      ];

      // Run multiple simulations to account for randomness
      let strongWins = 0;
      const simulations = 50;

      for (let i = 0; i < simulations; i++) {
        const result = runSimulation(armies);
        if (result.winners.some(w => w.name === 'Strong Army')) {
          strongWins++;
        }
      }

      // Strong army should win most of the time (at least 80%)
      expect(strongWins / simulations).toBeGreaterThan(0.8);
    });
  });

  describe('summarizeArmy', () => {
    test('should create readable army summary', () => {
      const army = {
        name: 'Test Army',
        size: 500,
        training: 5, weaponry: 6, morale: 7, tactics: 8,
        logistics: 5, tech: 6, experience: 7, leadership: 8, terrain: 5,
        home: 1, visitor: 0, count: 2
      };

      const summary = summarizeArmy(army);
      
      expect(summary).toContain('Test Army');
      expect(summary).toContain('Size: 500');
      expect(summary).toContain('Training: 5');
      expect(summary).toContain('x2');
      expect(typeof summary).toBe('string');
    });
  });
});
