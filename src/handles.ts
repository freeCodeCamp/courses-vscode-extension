import { Config, FlashTypes } from "./typings";
import {
  commands,
  Terminal,
  TerminalExitStatus,
  window,
  WorkspaceConfiguration,
} from "vscode";
import { openSimpleBrowser } from "./components";
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

export async function handleWorkspace(
  workspace: Config["workspace"],
  prepareTerminalClose: ReturnType<typeof createBackgroundTerminal>
): Promise<void> {
  if (workspace!.previews) {
    for (const preview of workspace!.previews) {
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
            setTimeout(() => {
              openSimpleBrowser(preview.url);
            }, 500);
          }
          panel.dispose();
        });
      }
      if (!preview.url && preview?.open) {
        setTimeout(() => {
          openSimpleBrowser(preview.url);
        }, 500);
      }
    }
  }
  if (workspace!.terminals) {
    for (const term of workspace!.terminals) {
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
    for (const _file of workspace!.files) {
      // TODO: Open file
    }
  }
  return Promise.resolve();
}

export async function handleConfig(
  config: WorkspaceConfiguration,
  caller: keyof Config["scripts"]
) {
  // Ensure compulsory keys and values are set
  const path = config.path || ".";
  // Run prepare script
  let prepareTerminalClose: Promise<TerminalExitStatus> = new Promise(
    (resolve) => resolve({ code: 0 } as TerminalExitStatus)
  );
  if (config.get("prepare")) {
    prepareTerminalClose = createBackgroundTerminal(
      "freeCodeCamp: Preparing Course",
      cd(path, config.prepare)
    );
  }

  if (config.get("workspace")) {
    await handleWorkspace(config.workspace, prepareTerminalClose);
  }

  const calledScript = config.scripts[caller];
  if (typeof calledScript === "string") {
    scripts[caller](path, calledScript);
  }
}
