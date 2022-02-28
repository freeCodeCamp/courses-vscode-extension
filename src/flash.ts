import { window } from "vscode";
import { FlashTypes, Flash } from "./typings";

export function showMessage(shower: Function) {
  return (s: string, opts: Flash["opts"]) => shower(s, opts);
}

export const flasher = {
  [FlashTypes.INFO]: showMessage(window.showInformationMessage),
  [FlashTypes.WARNING]: showMessage(window.showWarningMessage),
  [FlashTypes.ERROR]: showMessage(window.showErrorMessage),
};

export function handleMessage(flash: Flash) {
  flasher[flash.type](flash.message, flash.opts);
}
