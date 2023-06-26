# Change Log

All notable changes to the `freecodecamp-courses` extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [Released]

##[2.0.0](#v2.0.0) (2023-06-22)

### Removed

- `freeCodeCamp: Test`
  - `config.scripts.test`
- `config.bash`

### Changed

- `freeCodeCamp: Collapse` -> `freeCodeCamp Dev: Collapse`
- `freeCodeCamp: Create New Course`
  - Does not clone a repo. Instead, uses the terminal to clone the `minimal-example` folder from `freecodecamp-os`

##[1.7.5](#v1.7.5) (2023-05-19)

### Updated

- `@types/node` to `18.16.9`
- `@types/vscode` to `1.78.0`
- `@typescript-eslint/eslint-plugin` to `5.59.6`
- `@typescript-eslint/parser` to `5.59.6`
- `typescript` to `5.0.4`
- `webpack` to `5.83.1`

##[1.7.4](#v1.7.4) (2022-03-30)

### Updated

- Use `@vscode/vsce` instead of `vsce`
- Update all dependencies
- Year in `LICENSE`
- Remove `activationEvents` from `package.json`

##[1.7.3](#v1.7.3) (2022-01-26)

### Fixed

- `schema.json` definition for `freecodecamp.conf.json`

### Removed

- `glob`
- `@types/glob`
- `mocha`
- `@types/mocha`
- `vscode-test-electron`
- `src/test` directory

### Updated

- `webpack-cli` to `5.0.1`

##[1.7.2](#v1.7.2) (2022-12-15)

### Added

- `schema.json` for `freecodecamp.conf.json`

### Updated

- `vscode` engine to `1.74.0`

##[1.7.1](#v1.7.1) (2022-11-07)

### Fixed

- `freeCodeCamp: Run Course` checks for new version of curriculum from `raw.githubusercontent.com`. Prevent fail-fast if fetch fails.

##[1.7.0](#v1.7.0) (2022-10-24)

### Added

- `freeCodeCamp: Collapse` command to collapse all matched text levels in the editor

##[1.6.1](#v1.6.1) (2022-10-22)

### Updated

- `vscode` engine to `^1.72.0`
- `vsce` to `2.13.0`
- `typescript-eslint` monorepo to `5.40.0`
- `eslint` to `8.25.0`
- `typescript` to `4.8.4`

##[1.6.0](#v1.6.0) (2022-09-14)

### Added

- New `freecodecamp.conf.json` property:
  - `version`
  - `hotReload.ignore`
- On `freeCodeCamp: Run Course`, if a course version has been updated, a Camper is warned.

### Fixed

- Added `node-fetch` dependency, because `fetch` does not appear in `vscode@1.71.0`

##[1.5.1](#v1.5.1) (2022-09-13)

### Updated

- `vscode` engine to `^1.71.1`

##[1.5.0](#v1.5.0) (2022-09-06)

### Changed

- `config.prepare` is no longer required
- freeCodeCamp - Courses extension version is now tied to [freeCodeCampOS](https://github.com/freeCodeCamp/freeCodeCampOS) version

### Added

- New `freecodecamp.conf.json` properties:
  - `bash`
  - `client`
  - `config`
  - `curriculum`
  - `tooling`

### Updated

- `vscode` engine to `1.71.0`

##[1.4.4](#v1.4.4) (2022-08-19)

### Updated

- `vscode` engine to `1.70.0`
- `node` engine to `>=18`

### Changed

- Removed `axios` for native Node.js `fetch`

##[1.4.0](#v1.4.0) (2022-07-23)

### Added

- feat: previews ping `url` until it is available
- feat: previews have `timeout` to wait for `url` to be available

### Changed

- feat: loader looks more fCC -like

##[1.3.2](#v1.3.2) (2022-07-23)

- chore(patch): update dependencies

##[1.3.1](#v1.3.1) (2022-06-20)

### Changed

- chore(minor): minor package updates

##[1.2.3](#v1.2.3) (2022-06-20)

### Test

##[1.2.2](#v1.2.2) (2022-06-20)

### Added

- fix(minor): change terminal directory if `!term`

### Fixed

- chore(patch): update dependencies

##[1.2.1](#v1.2.1) (2022-06-10)

### Updated

- chore(deps): update dependency @types/vscode to v1.68.0
- chore(deps): update typescript-eslint monorepo to v5.27.0
- chore(deps): update dependency webpack to v5.73.0
- chore(deps): update dependency vsce to v2.9.1
- chore(deps): update dependency eslint to v8.17.0
- chore(deps): update dependency typescript to v4.7.3
- chore(deps): update dependency @types/node to v14.18.20
- chore(deps): update dependency glob to v7.2.3

##[1.2.0](#v1.2.0) (2022-04-30)

### Changed

- Removed idea of `order` in workspace - too difficult to implement

### Fixed

- Do not try change directory, if terminal has already existed

##[1.1.1](#v1.1.1) (2022-04-28)

### Fixed

- Did you know, in HTML, the `className` attribute is just `class`... 🤦‍♂️

### Changed

- Re-used terminal logic to simplify loader logic

##[1.1.0](#v1.1.0) (2022-04-28)

### Added

- Loader Screen to conf
- `prepare` script to conf

##[1.0.2](#v1.0.2) (2022-04-27)

### Changed

- `freeCodeCamp: Develop Course` and `freeCodeCamp: Start Course`
  - Re-uses the same terminal, if it exists

##[1.0.1](#v1.0.1) (2022-03-02)

### Added

- General first patch for release
- `freeCodeCamp: Test` for development

##[1.0.0](#v1.0.0) (2022-03-02)

### Added

- Initial Release 🎉 🚀
- Added License, README, and CHANGELOG
- Added `resources/courses.json` to list available courses
- Added `freecodecamp.conf.json` usage
  - Added the following commands:
  - `freeCodeCamp: Open Course`
  - `freeCodeCamp: Run Course`
  - `freeCodeCamp: Develop Course`
  - `freeCodeCamp: Shutdown Course`
  - `freeCodeCamp: Create New Course`
