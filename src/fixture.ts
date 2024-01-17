/* eslint-disable @typescript-eslint/naming-convention */
import { Config } from "./typings";

export const exampleConfig: Config = {
  bashrc: {
    // The .bashrc file to be sourced
    enabled: true, // Whether or not to source .bashrc file
    path: "./.freeCodeCamp/.bashrc", // Relative path to .bashrc file
  },
  version: "1.1.1",
  path: ".freeCodeCamp", // Relative path to tooling directory where scripts will be run
  prepare: "cp sample.env .env && source ./tooling/.bashrc && npm ci", // Run before running scripts
  scripts: {
    // Scripts linked to extension commands
    "develop-course": "npm run develop", // Run when `Develop Course` command is executed
    "run-course": "npm run start", // Run when `Run Course` command is executed
  },
  workspace: {
    // Workspace settings
    autoStart: false, // Whether or not to automatically start course on open of VSCode
    files: [
      // Files to be opened in workspace
      {
        path: "README.md", // Relative path to file
      },
    ],
    previews: [
      // Previews to be opened in workspace
      {
        open: true, // Whether or not to open preview
        showLoader: true, // Whether or not to show loading indicator
        url: "https://www.freecodecamp.org/", // URL to open
        timeout: 10000, // Timeout for URL to respond with 200
      },
    ],
    terminals: [
      // Terminals to be opened in workspace
      {
        directory: ".", // Relative path to open terminal with
        message: "'Hello World!'", // Message to display in terminal
        name: "Camper", // Name of terminal
        show: true, // Whether or not to show terminal
      },
    ],
  },
  client: {
    assets: {
      header: "./client/assets/fcc_primary_small.svg",
      favicon: "./client/assets/fcc_primary_small.svg",
    },
    landing: {
      description: "Placeholder description",
      "faq-link": "#",
      "faq-text": "Link to FAQ related to course",
    },
  },
  config: {
    "projects.json": "./config/projects.json",
    "state.json": "./config/state.json",
  },
  curriculum: {
    locales: {
      english: "./curriculum/locales/english",
    },
  },
  hotReload: {
    ignore: ["some/path/to/ignore"],
  },
  tooling: {
    helpers: "./tooling/test-utils.js",
  },
};
