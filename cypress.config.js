const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const createEsbuildPlugin =
  require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;
const addCucumberPreprocessorPlugin =
  require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  projectId: "rs368b",
  chromeWebSecurity: false,
  video: false,
  record: true,
  parallel: true,
  pageLoadTimeout: 60000,
  e2e: {
    baseUrl: "https://santa-secret.ru",
    specPattern: "**/*.feature",
    browser: "chrome",
    viewportWidth: 1280,
    viewportHeight: 800,
    testIsolation: false,
    setupNodeEvents(on, config) {
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });

      on("file:preprocessor", bundler);
      addCucumberPreprocessorPlugin(on, config);
      allureWriter(on, config);
      return config;
    },
    env: {
      allureReuseAfterSpec: true,
      allureResultsPath: "allure-results",
      allurePlugin: true,
    },
  },
});
