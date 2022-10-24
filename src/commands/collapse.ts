import { window, commands } from "vscode";

export default async function collapse() {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }
  const selections = editor.selections;
  try {
    await commands.executeCommand("editor.action.selectHighlights");
  } catch (e) {
    console.error("freeCodeCamp Courses: ", e);
  }
  selections.forEach(async (selection) => {
    try {
      await commands.executeCommand("editor.fold", selection.start);
    } catch (e) {
      console.error("freeCodeCamp Courses: ", e);
    }
  });
}
