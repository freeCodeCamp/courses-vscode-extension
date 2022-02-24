import { Config, Flash, FlashTypes } from "./typings";
import { commands, Terminal, window } from "vscode";
import { isConnectedToInternet, openSimpleBrowser } from "./components";
import { cd, ensureDirectoryIsEmpty } from "./usefuls";

const showMessage = (shower: Function) => (s: string, opts: Flash["opts"]) =>
  shower(s, opts);

const flasher = {
  [FlashTypes.INFO]: showMessage(window.showInformationMessage),
  [FlashTypes.WARNING]: showMessage(window.showWarningMessage),
  [FlashTypes.ERROR]: showMessage(window.showErrorMessage),
};

export function handleMessage(flash: Flash) {
  flasher[flash.type](flash.message, flash.opts);
}

/**
 * Creates a terminal with the given name and executes the given commands.
 * @example
 * handleTerminal("freeCodeCamp: Open Course", "git clone something", "npm install", "live-server .")
 */
export function handleTerminal(name: string, ...commands: string[]) {
  const commandString = commands
    .join(" && ")
    .replace(/ ?([^&]+) && & && ([^&]+)/g, " ($1 & $2)");
  const terminal = window.createTerminal(name);
  terminal.sendText(commandString, true);
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
  "develop-course": (path: string, val: string) => {
    handleTerminal("freeCodeCamp: Develop Course", cd(path, val));
  },
  "run-course": (path: string, val: string) => {
    handleTerminal("freeCodeCamp: Run Course", cd(path, val));
  },
  test: (path: string, val: string) => {
    handleTerminal("freeCodeCamp: Test", cd(path, val));
  },
};

type ConfigKeys = keyof Omit<Omit<Config, "path">, "scripts">;

const confs: {
  [T in ConfigKeys]: (val: Config[T], path: string) => void;
} = {
  preview: async (val, _path: string) => {
    if (val?.open) {
      // Timeout for to ensure server is running
      await new Promise((resolve) => setTimeout(resolve, val?.timeout || 100));
      openSimpleBrowser(val.url);
    }
  },
  bashrc: (val, path: string) => {
    if (val?.enabled) {
      createBackgroundTerminal(
        "freeCodeCamp: Source bashrc",
        cd(path, `source ${val.path}`)
      );
    }
  },
  terminals: (val = [], _path: string) => {
    for (const term of val) {
      if (term?.name) {
        const t = handleTerminal(
          term.name,
          cd(term.directory, `echo ${term.message || ""}`)
        );
        if (term?.show) {
          t.show();
        }
      }
    }
  },
  // TODO
  files: (_val = [], _path: string) => {},
};

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
  ];

  const notSets = getNotSets<Config>(config, compulsoryKeys);
  if (notSets.length) {
    return handleMessage({
      type: FlashTypes.ERROR,
      message: `${notSets.join(", and ")} not set.`,
    });
  }

  const calledScript = config.scripts[caller];
  if (typeof calledScript === "string") {
    scripts[caller](path, calledScript);
  }

  for (const key in config) {
    // @ts-expect-error it's not sure which config it's passing to confs. Might
    // be possible to handle this with generics, though.
    await confs[key as ConfigKeys]?.(config[key as ConfigKeys], path);
  }
}

function getNotSets<T>(obj: T, compulsoryKeys: string[]) {
  return compulsoryKeys.filter((key) => !hasProp<T>(obj, key));
}

function hasProp<T>(obj: T, keys: string): boolean {
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
