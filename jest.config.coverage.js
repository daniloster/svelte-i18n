const jestConfig = require('./jest.config')
module.exports = {
  ...jestConfig,
  coverageDirectory: '<rootDir>/.coverage/',
}
