/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^types/(.*)$": "<rootDir>/types/$1",
  },
};
// module.exports = {
//   preset: "ts-jest", // ts-jest/presets/default-esm  // ts-jest/presets/js-with-ts-esm
//   testEnvironment: "node",
// };
