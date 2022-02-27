import {
  openTerminal,
  openSimpleBrowser,
  currentDirectoryCourse,
  getRootWorkspaceDir,
  isConnectedToInternet,
} from "./components";
import { showInputBox, promptQuickPick } from "./inputs";
import {
  ensureDirectoryIsEmpty,
  getPackageJson,
  ensureFileOrFolder,
} from "./usefuls";

const allAvailableFunctions = {
  currentDirectoryCourse,
  ensureDirectoryIsEmpty,
  ensureFileOrFolder,
  getPackageJson,
  getRootWorkspaceDir,
  isConnectedToInternet,
  promptQuickPick,
  openSimpleBrowser,
  openTerminal,
  showInputBox,
};

export default allAvailableFunctions;
