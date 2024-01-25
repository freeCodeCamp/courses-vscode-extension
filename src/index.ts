import {
  openTerminal,
  openSimpleBrowser,
  currentDirectoryCourse,
} from "./components";
import { showInputBox, promptQuickPick } from "./inputs";
import { ensureDirectoryIsEmpty, cd } from "./usefuls";

import { handleMessage, showMessage } from "./flash";

export const everythingButHandles = {
  currentDirectoryCourse,
  ensureDirectoryIsEmpty,
  promptQuickPick,
  openSimpleBrowser,
  openTerminal,
  showInputBox,
  handleMessage,
  showMessage,
  cd,
};
