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
export async function showInputBox(placeHolder: string) {
  const result = await window.showInputBox({
    placeHolder,
  });
  return result;
}
