process.env.TZ = 'UTC'
process.env.NODE_ICU_DATA = 'node_modules/full-icu'

module.exports = {
  cacheDirectory: './jest-cache',
  coverageReporters: ['html', 'json', 'lcov', 'text'],
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/*{!(test),}.js',
    'src/*{!(test),}.jsx',
    'src/*{!(test),}.svelte',
    'src/**/*{!(test),}.js',
    'src/**/*{!(test),}.jsx',
    'src/**/*{!(test),}.svelte',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'svelte'],
  modulePathIgnorePatterns: [
    '<rootDir>/app/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/tools/',
  ],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tools/__mocks__/mock.js',
  },
  // setupFiles: ['<rootDir>/tools/helpers/jest.setup.js'],
  setupFilesAfterEnv: [
    '@babel/polyfill',
    'full-icu',
    '@testing-library/jest-dom/extend-expect',
    '<rootDir>/tools/helpers/jest.setup.afterEnv.js',
  ],
  testMatch: [
    '<rootDir>/src/*.test.js',
    '<rootDir>/src/*.test.jsx',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.jsx',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/tools/',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svelte$': 'svelte-jester',
  },
  verbose: true,
}
