# Change Log

All notable changes to the `freecodecamp-courses` extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [Released]

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
