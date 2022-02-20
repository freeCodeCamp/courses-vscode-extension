import { window } from "vscode";
import { handleConnection, handleEmptyDirectory } from "../handles";
import { createBackgroundTerminal } from "../handles";
import { gitClone } from "../usefuls";

export default async function createNewCourse() {
  const course = "https://github.com/ShaunSHamilton/external-project";
  try {
    await handleConnection();

    window.showInformationMessage(`Downloading Course Template: ${course}`);
    await handleEmptyDirectory();
    await createBackgroundTerminal(
      "freeCodeCamp: Git Course",
      gitClone(course)
    );
  } catch (e) {
    console.error(e);
  }
}
