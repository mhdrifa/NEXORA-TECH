module.exports = {
  projects: [
    {
      displayName: 'backend',
      testEnvironment: 'node',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/tests/backend/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/tests/frontend/**/*.test.tsx', '<rootDir>/tests/frontend/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        // Mock CSS/assets
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
      transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.app.json' }],
      },
    },
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
