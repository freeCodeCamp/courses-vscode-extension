import { QuickPickOptions, window } from "vscode";

export async function promptQuickPick(
  selections: string[],
  options: QuickPickOptions & {
    canPickMany: boolean;
  }
) {
  return await window.showQuickPick(selections, options);
}

/**
 * Shows an input box using window.showInputBox().
 */
export async function showInputBox() {
  const result = await window.showInputBox({
    value: "abcdef",
    valueSelection: [2, 4],
    placeHolder: "",
    validateInput: (text) => {
      window.showInformationMessage(`Validating: ${text}`);
      return text === "123" ? "Not 123!" : null;
    },
  });
  window.showInformationMessage(`Got: ${result}`);
}
