const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const createEsbuildPlugin =
  require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;
const addCucumberPreprocessorPlugin =
  require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;

module.exports = defineConfig({
  projectId: "rs368b",
  video: false,
  record: true,
  parallel: true,
  pageLoadTimeout: 60000,
  e2e: {
    baseUrl: "https://santa-secret.ru",
    specPattern: "**/*.feature",
    browser: "electron",
    viewportWidth: 1920,
    viewportHeight: 1080,
    testIsolation: false,
    setupNodeEvents(on, config) {
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });

      on("file:preprocessor", bundler);
      addCucumberPreprocessorPlugin(on, config);
      return config;
    },
  },
});
