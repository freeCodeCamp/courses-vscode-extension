# Change Log

All notable changes to the `freecodecamp-courses` extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [Released]

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
