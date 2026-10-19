const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^remark-gfm$': '<rootDir>/__mocks__/remark-gfm.js',
    '^rehype-sanitize$': '<rootDir>/__mocks__/rehype-sanitize.js',
    '^react-markdown$': '<rootDir>/__mocks__/react-markdown.js',
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts,jsx,tsx}',
    'lib/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!lib/env.ts',
    '!app/layout.tsx',
    '!app/page.tsx',
    '!src/components/ui/Card.tsx',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
