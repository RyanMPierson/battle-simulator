# Battle Simulator Test Suite

This directory contains comprehensive tests for the Army Battle Simulator application.

## Test Structure

### Unit Tests (`battle.test.js`)
- **ARMY_PRESETS**: Validates army preset data structure and values
- **calculateArmyPower**: Tests power calculation logic with various scenarios
- **runSimulation**: Tests simulation mechanics and winner determination
- **summarizeArmy**: Tests army summary string generation

### UI Integration Tests (`ui.test.js`) 
- **createArmyConfig**: Tests army configuration UI generation
- **getArmyConfigs**: Tests data extraction from DOM elements
- **showResults**: Tests result display functionality
- **Event Handling**: Tests user interactions (add/remove armies, preset selection)
- **Edge Cases**: Tests error handling and boundary conditions

### End-to-End Integration Tests (`integration.test.js`)
- **Complete Workflow**: Tests full simulation from setup to results
- **Dynamic Army Management**: Tests adding/removing armies during use
- **Preset Integration**: Tests preset selection and customization
- **Data Consistency**: Validates data integrity throughout the process
- **Performance**: Tests scalability with multiple armies and simulations

## Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Coverage Goals

The test suite aims for:
- **80%+ Line Coverage**: Ensures most code paths are tested
- **80%+ Function Coverage**: Tests all major functions
- **80%+ Branch Coverage**: Tests different execution branches
- **80%+ Statement Coverage**: Validates all statements execute correctly

## Test Features

### Custom Matchers
- `toBeWithinRange(min, max)`: Validates numeric values within expected ranges

### Mock Environment
- Complete DOM simulation using jsdom
- Event handling simulation
- Performance timing tests

### Statistical Testing
- Randomness validation through multiple iterations
- Statistical significance testing for battle outcomes
- Performance benchmarking

## Key Test Scenarios

1. **Army Configuration**
   - Preset loading and validation
   - Custom army creation
   - Input validation and bounds checking

2. **Battle Mechanics**
   - Power calculation accuracy
   - Home/visitor advantage effects
   - Size scaling verification
   - Statistical outcome validation

3. **User Interface**
   - Dynamic army addition/removal
   - Form submission handling
   - Result display formatting
   - Error state management

4. **Edge Cases**
   - Zero-size armies
   - Extreme stat values
   - Missing DOM elements
   - Large-scale simulations

## Performance Expectations

- Single simulation: < 10ms
- 100 simulations: < 100ms
- 7 armies simulation: < 500ms
- UI operations: < 50ms
