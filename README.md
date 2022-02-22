# freeCodeCamp - Courses

This extension helps run the freeCodeCamp courses found here: []()

Downloading this extension for development testing:

```bash
wget https://github.com/ShaunSHamilton/courses-plus/raw/main/freecodecamp-courses-patch.vsix
```

## Config

Create a `freecodecamp.conf.json` file somewhere within the workspace.

### Basic Config File

```json
{
  "path": ".freeCodeCamp",
  "scripts": {
    "develop-course": "npm run dev:curriculum && npm run start",
    "run-course": "npm run dev:curriculum && npm run start",
    "test": ""
  },
  "preview": {
    "open": true,
    "url": "http://127.0.0.1:8080"
  },
  "bashrc": {
    "enabled": true,
    "path": "./.freeCodeCamp/tooling/.bashrc"
  },
  "requiredFiles": [".freeCodeCamp/package.json"], // Maybe?
  "requiredDirectories": [".freeCodeCamp"] // Maybe?
}
```

**Typing**

```ts
type Bashrc =
  | { enabled: true; path: string }
  | { enabled: false; path?: string };

type Preview =
  | {
      open: true;
      url: string;
    }
  | { open: false; url?: string };

export interface Config {
  path: string;
  scripts: {
    "develop-course": string;
    "run-course": string;
    test?: string;
  };
  preview?: Preview;
  bashrc?: Bashrc;
}
```

## TODO On Release

- [ ] Update `resources/courses.json` to match actual available courses
- [ ] Update this README to suit features
- [ ] Package major release
- [ ] Double-confirm LICENSE
- [ ] Develop CONTRIBUTION guide for this extension
- [ ] Iron out development guide for courses using extension

## Features

### How to Open A Course

1. Press `Ctrl + Shift + P` to open the command palette

2. Select `freeCodeCamp: Open Course`

![Open Course](images/open-course.png)

3. Select a course from the list

![Courses List](images/courses-list.png)

4. `Ctrl + Shift + P` and select `Remote-Containers: Rebuild and Reopen in Container`

5. `Ctrl + Shift + P` and select `freeCodeCamp: Run Course`

![Opening Example Course](images/opening-example-course.png)

<!-- ## Requirements -->

<!-- If you have any requirements or dependencies, add a section describing those and how to install and configure them. -->

<!-- ## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: enable/disable this extension
- `myExtension.thing`: set to `blah` to do something -->

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
npm run pack minor
```
