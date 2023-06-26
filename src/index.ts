import {
  openTerminal,
  openSimpleBrowser,
  currentDirectoryCourse,
  isConnectedToInternet,
} from "./components";
import { showInputBox, promptQuickPick } from "./inputs";
import { ensureDirectoryIsEmpty, getPackageJson, cd } from "./usefuls";

import { handleMessage, showMessage } from "./flash";

export const everythingButHandles = {
  currentDirectoryCourse,
  ensureDirectoryIsEmpty,
  getPackageJson,
  isConnectedToInternet,
  promptQuickPick,
  openSimpleBrowser,
  openTerminal,
  showInputBox,
  handleMessage,
  showMessage,
  cd,
};
