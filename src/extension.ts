// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext, window, FileType } from "vscode";
import {
  isConnectedToInternet,
  openSimpleBrowser,
  openTerminal,
} from "./components";
import { courseInput } from "./course-input";
import {
  createBackgroundTerminal,
  handleMessage,
  handleTerminal,
  rebuildAndReopenInContainer,
} from "./handles";
import { FlashTypes } from "./typings";
import {
  getPackageJson,
  hotReload,
  liveServer,
  npmInstall,
  ensureFileOrFolder,
  copyEnv,
} from "./usefuls";

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
  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.test", async () => {
      await rebuildAndReopenInContainer();
    })
  );
}

async function runCourse() {
  const isNodeModulesExists = await ensureFileOrFolder(
    "../node_modules",
    FileType.Directory
  );
  const isConnected = await isConnectedToInternet();
  const isPackageJsonExists = Object.keys(await getPackageJson()).length > 0;
  const isEnvExists = await ensureFileOrFolder("../.env", FileType.File);
  const isSampleEnvExists = await ensureFileOrFolder(
    "../sample.env",
    FileType.File
  );

  if (!isEnvExists && !isSampleEnvExists) {
    return handleMessage({
      message: "No `.env` or `sample.env` file found.",
      type: FlashTypes.ERROR,
    });
  } else if (!isEnvExists) {
    handleTerminal("freeCodeCamp: Copy .env", copyEnv);
  }

  if (!isNodeModulesExists && isConnected) {
    if (!isPackageJsonExists) {
      return handleMessage({
        message: "No package.json found. Unable to install tooling",
        type: FlashTypes.ERROR,
      });
    }

    await createBackgroundTerminal("freeCodeCamp: NPM", npmInstall);
    handleTerminal("freeCodeCamp: Run Course", liveServer, "&", hotReload);
    // Hack to await live-server for Simple Browser
    await new Promise((resolve) => setTimeout(resolve, 10000));
    openSimpleBrowser();
    openTerminal();
  } else if (isNodeModulesExists) {
    handleTerminal("freeCodeCamp: Run Course", liveServer, "&", hotReload);

    handleMessage({
      message: "Using existing `node_modules`",
      type: FlashTypes.INFO,
    });
    // Hack to await live-server for Simple Browser
    await new Promise((resolve) => setTimeout(resolve, 3000));
    openSimpleBrowser();
    openTerminal();
  } else {
    handleMessage({
      message: "Connection needed install course tools",
      type: FlashTypes.ERROR,
    });
  }
}

function shutdownCourse() {
  // End all running terminal processes
  window.terminals.forEach((terminal) => {
    terminal.dispose();
  });

  // This is a bit of a hack to close the Simple Browser window
  // So, it might not work well.
  try {
    window.visibleTextEditors.forEach((editor) => {
      window.showTextDocument(editor.document).then((_) => {
        return commands.executeCommand("workbench.action.closeActiveEditor");
      });
    });
  } catch {}
}

// this method is called when your extension is deactivated
export function deactivate() {}
