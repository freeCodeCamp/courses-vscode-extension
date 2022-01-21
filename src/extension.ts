// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  commands,
  ExtensionContext,
  FileType,
  Uri,
  window,
  workspace,
} from "vscode";
import { isConnectedToInternet, openSimpleBrowser } from "./components";
import { courseInput } from "./course-input";
import { handleMessage, handleTerminal } from "./handles";
import { FlashTypes } from "./typings";
import { hotReload, liveServer, npmInstall } from "./usefuls";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Your extension is now active!");

  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.openCourse", async () => {
      courseInput();
    })
  );
  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.runCourse", async () => {
      runCourse();
    })
  );
  context.subscriptions.push(
    commands.registerCommand(
      "freecodecamp-courses.shutdownCourse",
      async () => {
        shutdownCourse();
      }
    )
  );
}

async function runCourse() {
  const isNodeModulesExists = await ensureNodeModules();
  const isConnected = await isConnectedToInternet();
  try {
    let term;
    if (!isNodeModulesExists) {
      term = handleTerminal(
        "freeCodeCamp: Install Node Modules",
        npmInstall,
        liveServer,
        hotReload
      );
    } else {
      term = handleTerminal("freeCodeCamp: Run Course", liveServer, hotReload);
    }
    if (term.exitStatus?.code !== 0) {
      handleMessage({
        message: "Error: " + term.exitStatus?.code,
        type: FlashTypes.ERROR,
      });
    }
    openSimpleBrowser();
  } catch (e) {
    if (!isConnected) {
      handleMessage({
        message: "No connection found. Using existing `node_modules`",
        type: FlashTypes.WARNING,
        opts: { detail: e as string },
      });
    } else {
      handleMessage({
        message: "Unable to install course tools",
        type: FlashTypes.ERROR,
        opts: { detail: e as string },
      });
    }
  }
}

async function ensureNodeModules(): Promise<boolean> {
  try {
    const arrOfArrs = await workspace.fs.readDirectory(
      Uri.file("./node_modules")
    );
    if (arrOfArrs.includes(["node_modules", FileType.Directory])) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  } catch (e) {
    return Promise.resolve(false);
  }
}

function shutdownCourse() {
  // End all running terminal processes
  window.terminals.forEach((terminal) => {
    terminal.dispose();
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
