export default {
  testEnvironment: "node",
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.js", "!src/config/**"],
  globalTeardown: "<rootDir>/tests/config/teardown.js",
};