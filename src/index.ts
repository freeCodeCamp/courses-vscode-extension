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
  cd,
} from "./usefuls";

export const everythingButHandles = {
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
  cd,
};
