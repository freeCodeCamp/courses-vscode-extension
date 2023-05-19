import { window } from "vscode";
import { handleConnection, handleEmptyDirectory } from "../handles";
import { createBackgroundTerminal } from "../handles";
import { showInputBox } from "../inputs";
import { gitClone } from "../usefuls";

export default async function createNewCourse() {
  const course = await showInputBox();
  if (!course) {
    window.showErrorMessage("No course name provided.");
    return Promise.reject();
  }
  try {
    await handleConnection();

    window.showInformationMessage(`Downloading Course Template: ${course}`);
    await handleEmptyDirectory();
    await createBackgroundTerminal(
      "freeCodeCamp: Git Course",
      gitClone(course)
    );
    return Promise.resolve();
  } catch (e) {
    console.error(e);
    window.showErrorMessage("Error cloning course. See console for details.");
    return Promise.reject();
  }
}
