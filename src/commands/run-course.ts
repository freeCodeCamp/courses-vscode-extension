import { FileType } from "vscode";
import {
  isConnectedToInternet,
  openSimpleBrowser,
  openTerminal,
} from "../components";
import {
  createBackgroundTerminal,
  handleMessage,
  handleTerminal,
} from "../handles";
import { FlashTypes } from "../typings";
import { getPackageJson, ensureFileOrFolder, PATH, cd } from "../usefuls";

export default async function runCourse() {
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
    await createBackgroundTerminal(
      "freeCodeCamp: Copy .env",
      cd("npm run ensure-env")
    );
  }

  if (!isNodeModulesExists && isConnected) {
    if (!isPackageJsonExists) {
      return handleMessage({
        message: "No package.json found. Unable to install tooling",
        type: FlashTypes.ERROR,
      });
    }

    await createBackgroundTerminal("freeCodeCamp: NPM", cd("npm install"));
    handleTerminal("freeCodeCamp: Live Server", cd("npm run live-server"));
    handleTerminal("freeCodeCamp: Watcher", cd("npm run watcher"));
    // Hack to await live-server for Simple Browser
    await new Promise((resolve) => setTimeout(resolve, 10000));
    openSimpleBrowser();
    openTerminal();
  } else if (isNodeModulesExists) {
    handleTerminal("freeCodeCamp: Live Server", cd("npm run live-server"));
    handleTerminal("freeCodeCamp: Watcher", cd("npm run watcher"));

    handleMessage({
      message: "Using existing `node_modules`",
      type: FlashTypes.INFO,
    });
    // Hack to await live-server for Simple Browser
    await new Promise((resolve) => setTimeout(resolve, 9000));
    openSimpleBrowser();
    openTerminal();
  } else {
    handleMessage({
      message: "Connection needed to install course tools",
      type: FlashTypes.ERROR,
    });
  }
}
