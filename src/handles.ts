import { Flash, FlashTypes } from "./typings";
import { window } from "vscode";

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
