import { Flash, FlashTypes } from "./typings";
import { window } from "vscode";

const flasher = {
  [FlashTypes.INFO]: (s: string) => window.showInformationMessage(s),
  [FlashTypes.WARNING]: (s: string) => window.showWarningMessage(s),
  [FlashTypes.ERROR]: (s: string) => window.showErrorMessage(s),
};

export function handleMessage(flash: Flash) {
  flasher[flash.type](flash.message);
}
