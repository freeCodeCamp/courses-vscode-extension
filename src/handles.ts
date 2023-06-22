import { Bashrc, Config, FlashTypes } from "./typings";
import { exampleConfig } from "./fixture";
import { commands, Terminal, TerminalExitStatus, window } from "vscode";
import { isConnectedToInternet, openSimpleBrowser } from "./components";
import { cd, checkIfURLIsAvailable, ensureDirectoryIsEmpty } from "./usefuls";
import { handleMessage } from "./flash";
import { createLoaderWebView } from "./loader";

/**
 * Creates a terminal with the given name and executes the given commands.
 * @example
 * handleTerminal(".freeCodeCamp", "freeCodeCamp: Open Course", "npm install", "live-server .")
 */
export function handleTerminal(
  path: string,
  name: string,
  ...commands: string[]
) {
  const commandString = commands
    .join(" && ")
    .replace(/ ?([^&]+) && & && ([^&]+)/g, " ($1 & $2)");

  // If terminal already exists, then re-use it:
  const existingTerminal = window.terminals.find(
    (terminal) => terminal.name === name
  );
  if (existingTerminal) {
    existingTerminal.sendText(commandString);
    return existingTerminal;
  }
  const terminal = window.createTerminal(name);
  terminal.sendText(cd(path, commandString), true);
  return terminal;
}

export async function createBackgroundTerminal(name: string, command: string) {
  const terminal = window.createTerminal(name);
  terminal.sendText(`${command} && exit`, true);
  const exitStatus = await pollTerminal(terminal);
  if (exitStatus) {
    terminal.dispose();
    return Promise.resolve(exitStatus);
  }
  return Promise.reject();
}

export async function pollTerminal(
  terminal: Terminal
): Promise<Terminal["exitStatus"]> {
  // Every 400ms, check if `terminal.exitStatus` is `undefined`. If it is not `undefined`, resolve promise to `terminal.exitStatus`.
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (terminal.exitStatus) {
        resolve(terminal.exitStatus);
        clearInterval(interval);
      }
    }, 400);
  });
}

// Does not work. Unsure why not.
export function rebuildAndReopenInContainer() {
  commands.executeCommand("remote-containers.rebuildAndReopenInContainer");
}

export async function handleConnection() {
  const isConnected = await isConnectedToInternet();
  if (!isConnected) {
    handleMessage({
      message: "No connection found. Please check your internet connection",
      type: FlashTypes.ERROR,
    });
    return Promise.reject();
  }
  return Promise.resolve();
}

export async function handleEmptyDirectory() {
  const isEmpty = await ensureDirectoryIsEmpty();
  if (!isEmpty) {
    handleMessage({
      message: "Directory is not empty.",
      type: FlashTypes.WARNING,
      opts: {
        detail: "Please empty working directory, and try again.",
        modal: true,
      },
    });

    return Promise.reject();
  }
  return Promise.resolve();
}

const scripts = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "develop-course": (path: string, val: string) => {
    handleTerminal(path, "freeCodeCamp: Develop Course", val);
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "run-course": (path: string, val: string) => {
    handleTerminal(path, "freeCodeCamp: Run Course", val);
  },
};

export function sourceBashrc(val: Bashrc, path: string): void {
  if (val?.enabled) {
    createBackgroundTerminal(
      "freeCodeCamp: Source bashrc",
      cd(path, `source ${val.path}`)
    );
  }
}

export async function handleWorkspace(
  workspace: Config["workspace"],
  prepareTerminalClose: ReturnType<typeof createBackgroundTerminal>
): Promise<void> {
  if (workspace!.previews) {
    const compulsoryKeys = ["open"];
    for (const preview of workspace!.previews) {
      const notSets = getNotSets(preview, compulsoryKeys);
      if (notSets.length) {
        handleMessage({
          message: `Preview missing keys: ${notSets.join(", ")}`,
          type: FlashTypes.ERROR,
        });
        return Promise.reject();
      }
      if (preview.showLoader) {
        const panel = createLoaderWebView();
        // TODO: could use result here to show error in loader webview
        await prepareTerminalClose;

        // Wait for the port to be available, before disposing the panel.
        new Promise(async (resolve) => {
          if (preview.url) {
            await checkIfURLIsAvailable(preview.url, preview.timeout);
          }
          if (preview?.open) {
            // After 1000ms, open the preview.
            setTimeout(() => {
              openSimpleBrowser(preview.url);
            }, 500);
          }
          panel.dispose();
        });
      }
      if (!preview.url && preview?.open) {
        // After 1000ms, open the preview.
        setTimeout(() => {
          openSimpleBrowser(preview.url);
        }, 500);
      }
    }
  }
  if (workspace!.terminals) {
    const compulsoryKeys = ["directory"];
    for (const term of workspace!.terminals) {
      const notSets = getNotSets(term, compulsoryKeys);
      if (notSets.length) {
        handleMessage({
          message: `Terminals missing keys: ${notSets.join(", ")}`,
          type: FlashTypes.ERROR,
        });
        return Promise.reject();
      }
      if (term?.name) {
        const t = handleTerminal(
          term.directory,
          term.name,
          `echo ${term.message || ""}`
        );
        if (term?.show) {
          t.show();
        }
      }
    }
  }
  if (workspace!.files) {
    const compulsoryKeys = ["name"];
    for (const file of workspace!.files) {
      const notSets = getNotSets(file, compulsoryKeys);
      if (notSets.length) {
        handleMessage({
          message: `Files missing keys: ${notSets.join(", ")}`,
          type: FlashTypes.ERROR,
        });
        return Promise.reject();
      }
      // TODO: Open file
    }
  }
  return Promise.resolve();
}

export async function handleConfig(
  config: Config,
  caller: keyof Config["scripts"]
) {
  // Ensure compulsory keys and values are set
  const path = config.path;
  const compulsoryKeys = [
    "path",
    "scripts",
    "scripts.develop-course",
    "scripts.run-course",
    "curriculum",
    "curriculum.locales",
  ];

  ensureNoExtraKeys(config, exampleConfig);

  const notSets = getNotSets<Config>(config, compulsoryKeys);
  if (notSets.length) {
    return handleMessage({
      type: FlashTypes.ERROR,
      message: `${notSets.join(", and ")} not set.`,
    });
  }

  // Run prepare script
  let prepareTerminalClose: Promise<TerminalExitStatus> = new Promise(
    (resolve) => resolve({ code: 0 } as TerminalExitStatus)
  );
  if (config.prepare) {
    prepareTerminalClose = createBackgroundTerminal(
      "freeCodeCamp: Preparing Course",
      cd(path, config.prepare)
    );
  }

  if (config.workspace) {
    await handleWorkspace(config.workspace, prepareTerminalClose);
  }

  const calledScript = config.scripts[caller];
  if (typeof calledScript === "string") {
    scripts[caller](path, calledScript);
  }

  if (config.bashrc) {
    sourceBashrc(config.bashrc, path);
  }
}

export function getNotSets<T>(obj: T, compulsoryKeys: string[]) {
  return compulsoryKeys.filter((key) => !hasProp<T>(obj, key));
}

export function hasProp<T>(obj: T, keys: string): boolean {
  const keysArr = keys.split(".");
  let currObj: any = obj;
  for (const key of keysArr) {
    if (!currObj[key]) {
      return false;
    }
    currObj = currObj[key];
  }
  return true;
}

export function ensureNoExtraKeys(obj: any, exampleObject: any) {
  const unrecognisedKeys = [];
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      continue;
    }
    if (!exampleObject.hasOwnProperty(key)) {
      unrecognisedKeys.push(key);
      continue;
    }
    if (typeof obj[key] === "object") {
      ensureNoExtraKeys(obj[key], exampleObject[key]);
    }
  }
  if (unrecognisedKeys.length) {
    console.log(
      "There are keys that are not recognised in the `freecodecamp.conf.json` file. Double-check the specification."
    );
    handleMessage({
      type: FlashTypes.WARNING,
      message: `Unrecognised keys: ${unrecognisedKeys.join(", ")}`,
    });
  }
}
