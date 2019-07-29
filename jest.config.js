module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 98,
      lines: 95,
      statements: 92
    }
  },  
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/src/**/*.test.(ts)'],
  testEnvironment: 'node',
};
