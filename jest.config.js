module.exports = {
  verbose: true,
  collectCoverage: true,
  roots: ['<rootDir>/test'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: ['src/common/api/RestAPIService.ts', 'src/config/environments.ts'],
};
