# freeCodeCamp - Courses

<!-- TODO: Add link to potential page with course descriptions/images -->

This extension helps run the freeCodeCamp courses found here: [./resources/courses.json](resources/courses.json)

## Features

### How to Open A Course

1. Press `Ctrl + Shift + P` and select `freeCodeCamp: Open Course`

![Open Course](images/open-course.png)

3. Select a course from the list

![Courses List](images/courses-list.png)

4. `Ctrl + Shift + P` and select `Remote-Containers: Rebuild and Reopen in Container`

5. `Ctrl + Shift + P` and select `freeCodeCamp: Run Course`

![Opening Example Course](images/opening-example-course.png)

## Known Issues

## Release Notes

### 1.0.0

Official release of the freeCodeCamp Courses extension!

---

## Published Courses

- [Project Euler: Rust](https://github.com/freeCodeCamp/euler-rust/)

## Course Config

Create a `freecodecamp.conf.json` file somewhere within the workspace.

### Basic Config File

See up-to-date example here: [./src/fixture.ts](src/fixture.ts)

```js
// This should be in JSON
const exampleConfig = {
  bashrc: {
    // The .bashrc file to be sourced
    enabled: true, // Whether or not to source .bashrc file
    path: "./.freeCodeCamp/.bashrc", // Relative path to .bashrc file
  },
  path: ".freeCodeCamp", // Relative path to tooling directory where scripts will be run
  scripts: {
    // Scripts linked to extension commands
    "develop-course": "npm run develop", // Run when `Develop Course` command is executed
    "run-course": "npm run start", // Run when `Run Course` command is executed
    test: {
      // Run when `Test` command is executed
      functionName: "handleMessage", // Name of the function to be called
      arguments: [
        {
          message: "Hello World!",
          type: "info",
        },
      ], // Arguments to be passed to the function
    },
  }
  workspace: {
    // Workspace settings
    files: [
      // Files to be opened in workspace
      {
        path: "README.md", // Relative path to file
        order: {
          // Order to display file in workspace. Similar to grid-template-area
          rows: [0], // First row
          cols: [0], // First column
        },
      },
    ],
    previews: [
      // Previews to be opened in workspace
      {
        open: true, // Whether or not to open preview
        order: {
          // Order to display preview in workspace
          rows: [0], // First row
          cols: [1], // Second column
        },
        timeout: 100, // Timeout before opening preview, if required
        url: "https://www.freecodecamp.org/", // URL to open
      },
    ],
    terminals: [
      // Terminals to be opened in workspace
      {
        directory: ".", // Relative path to open terminal with
        message: "'Hello World!'", // Message to display in terminal
        name: "Camper", // Name of terminal
        order: {
          // Order to display terminal in workspace
          rows: [1], // Second row
          cols: [0, 1], // Span across first and second columns
        },
        show: true, // Whether or not to show terminal
      },
    ],
  },
};
```

**Typing**

```ts
export type Bashrc =
  | { enabled: true; path: string }
  | { enabled: false; path?: string };

type Preview =
  | {
      open: true;
      order?: Order;
      timeout: number;
      url: string;
    }
  | {
      open: false;
      order?: Order;
      timeout?: number;
      url?: string;
    };

type Terminal = {
  directory: string;
  message?: string;
  name: string;
  order?: Order;
  show: boolean;
};

type Order = { rows: number[]; cols: number[] };

type File = { path: string; order?: Order };

export type Test = {
  functionName: string;
  arguments?: unknown[];
};

export interface Config {
  bashrc?: Bashrc;
  path: string;
  scripts: {
    "develop-course": string;
    "run-course": string;
    test?: Test;
  };
  workspace?: {
    files?: File[];
    previews?: Preview[];
    terminals?: Terminal[];
  };
}
```
