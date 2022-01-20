# freecodecamp-courses-plus README

This extension helps run the freeCodeCamp courses found here: []()

## Features

### User Stories

- [ ] Campers can download extension
- [x] Campers can select `Open Course` in the command palette
- [x] Campers can select a course from a list in the command palette
  - [x] If course is already downloaded, it is opened
  - [x] Course is downloaded from GitHub repo
- [x] Campers can select `Re-download Course`
- [x] Campers can select `Run Course`
- Once course is opened/downloaded:
  - [x] `live-server` is started
  - [x] _Watcher_ is started
  - [x] _Simple Browser_ is opened
- [x] Campers can select `Shutdown Course` in the command palette
  - [x] All services will gracefully be killed
- [ ] ? freeCodeCamp Courses hooks into `temp.html` to listen for button presses
- [ ] ? Campers can select `Restart Project` in the command palette
  - [ ] Current project lesson resets to 1
- [ ] ? Campers can select `Run Tests` in the command palette
  - [ ] Current project test script is run
- [ ] ? Campers can select `Restart Lesson` in the command palette
- [ ] ? Use _Virtual Workspaces_ for courses

### How to Open A Course

1. Press `Ctrl + Shift + P` to open the command palette

2. Select `Open Course`

![Open Course](images/open-course.png)

3. Select a course from the list

![Courses List](images/courses-list.png)

4. The following will happen:

- Course will be downloaded into current directory from GitHub
- [BACKGROUND]: Terminal will open and install dependencies
- [BACKGROUND]: _live-server_ will start
- [FOREGROUND]: _Simple Browser_ will open
- [BACKGROUND]: _Watcher_ will start watching for changes
- [FOREGROUND]: A new terminal will open in the CWD

![Opening Rust in Replit Course](images/opening-rust-in-replit.png)

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: enable/disable this extension
- `myExtension.thing`: set to `blah` to do something

## Known Issues

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Official release of the freeCodeCamp Courses extension!

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

**Note:** You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
- Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
- Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**

## Published Courses

- [External Project (test)](https://github.com/ShaunSHamilton/external-project)

## Contributing

- Create a new branch following naming convention provided here: https://contribute.freecodecamp.org/#/how-to-open-a-pull-request
- Include _vsix_ file, and specify if change is patch (`0.0.x`), minor (`0.x.0`), or major (`x.0.0`).

```bash
vsce package 0.0.2
```
