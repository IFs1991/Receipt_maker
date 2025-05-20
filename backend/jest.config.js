/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/app', '<rootDir>/tests'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/app/$1',
    '@app/(.*)': '<rootDir>/app/$1',
    '@config/(.*)': '<rootDir>/app/config/$1',
    '@modules/(.*)': '<rootDir>/app/modules/$1',
    '@middleware/(.*)': '<rootDir>/app/middleware/$1',
    '@lib/(.*)': '<rootDir>/app/lib/$1',
    '@utils/(.*)': '<rootDir>/utils/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    '<rootDir>/app/**/*.{ts,tsx}',
    '!<rootDir>/app/**/*.d.ts',
    '!<rootDir>/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};