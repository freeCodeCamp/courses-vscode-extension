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
} from "./handles";
import { FlashTypes } from "./typings";
import {
  getPackageJson,
  hotReload,
  liveServer,
  npmInstall,
  ensureFileOrFolder,
  copyEnv,
  PATH,
} from "./usefuls";

export function activate(context: ExtensionContext) {
  console.log("freeCodeCamp Courses extension is now active!");

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
      const t = await createBackgroundTerminal(
        "freeCodeCamp: Test",
        "echo 'hello Camper'"
      );
      console.log("Test: ", t);
    })
  );
}

async function runCourse() {
  const isNodeModulesExists = await ensureFileOrFolder(
    "node_modules",
    FileType.Directory,
    PATH
  );
  const isConnected = await isConnectedToInternet();
  const isPackageJsonExists = Object.keys(await getPackageJson()).length > 0;
  const isEnvExists = await ensureFileOrFolder(".env", FileType.File, PATH);
  const isSampleEnvExists = await ensureFileOrFolder(
    "sample.env",
    FileType.File,
    PATH
  );

  if (!isEnvExists && !isSampleEnvExists) {
    return handleMessage({
      message: "No `.env` or `sample.env` file found.",
      type: FlashTypes.ERROR,
    });
  } else if (!isEnvExists) {
    await createBackgroundTerminal("freeCodeCamp: Copy .env", copyEnv);
  }

  if (!isNodeModulesExists && isConnected) {
    if (!isPackageJsonExists) {
      return handleMessage({
        message: "No package.json found. Unable to install tooling",
        type: FlashTypes.ERROR,
      });
    }

    await createBackgroundTerminal("freeCodeCamp: NPM", npmInstall);
    handleTerminal("freeCodeCamp: Live Server", liveServer);
    handleTerminal("freeCodeCamp: Watcher", hotReload);
    // Hack to await live-server for Simple Browser
    await new Promise((resolve) => setTimeout(resolve, 10000));
    openSimpleBrowser();
    openTerminal();
  } else if (isNodeModulesExists) {
    handleTerminal(
      "freeCodeCamp: Run Course",
      "cd ..",
      liveServer,
      "&",
      hotReload
    );

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
