import { window } from "vscode";
import { handleConnection, handleEmptyDirectory } from "../handles";
import { handleMessage } from "../flash";
import { createBackgroundTerminal } from "../handles";
import { showInputBox } from "../inputs";
import { FlashTypes } from "../typings";
import { gitClone } from "../usefuls";

export default async function createNewCourse() {
  const course = await showInputBox();
  if (!course) {
    handleMessage({
      message: "No course name provided.",
      type: FlashTypes.ERROR,
    });
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
    handleMessage({
      message: "Error cloning course. See console for details.",
      type: FlashTypes.ERROR,
    });
    return Promise.reject();
  }
}
