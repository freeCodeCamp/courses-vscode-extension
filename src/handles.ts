import { Flash, FlashTypes } from "./typings";
import { env, window } from "vscode";

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
 * Example Usage: `handleTerminal("freeCodeCamp: Open Course", "git clone something", "npm install", "live-server .")`
 */
export function handleTerminal(name: string, ...commands: string[]) {
  const commandString = commands.join(" && ");
  const terminal = window.createTerminal(name);
  terminal.sendText(commandString, true);
  return terminal;
}
