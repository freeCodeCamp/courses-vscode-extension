import { window } from "vscode";
import fetch from "node-fetch";
import {
  openSimpleBrowser,
  currentDirectoryCourse,
  isConnectedToInternet,
} from "./components";
import { Courses, FlashTypes } from "./typings";
import { handleMessage, handleTerminal } from "./handles";
import {
  ensureDirectoryIsEmpty,
  gitClone,
  hotReload,
  liveServer,
  npmInstall,
  copyEnv,
} from "./usefuls";

/**
 * Shows a pick list using window.showQuickPick().
 */
export async function courseInput() {
  // TODO: Timeout fetch after X time
  const isConnected = await isConnectedToInternet();
  if (isConnected) {
    const { courses } = (await (
      await fetch(
        "https://raw.githubusercontent.com/ShaunSHamilton/courses-plus/main/resources/courses.json"
      )
    ).json()) as Courses;
    // Check if course is already downloaded
    const courseGitDownloaded = await currentDirectoryCourse();

    const courseNames = courses.map((course) => {
      if (courseGitDownloaded === course.githubLink) {
        return `Re-download: ${course.name}`;
      } else {
        return course.name;
      }
    });
    const result = await window.showQuickPick(courseNames, {
      placeHolder: "Select a course",
    });
    if (result) {
      window.showInformationMessage(`Opening Course: ${result}`);

      const course = courses.find(
        ({ name }) => name === result.replace("Re-download: ", "")
      );
      if (course?.githubLink !== courseGitDownloaded) {
        const isEmpty = await ensureDirectoryIsEmpty();
        if (!isEmpty) {
          return handleMessage({
            message:
              "Directory is not empty. Can only clone into empty directory.",
            type: FlashTypes.ERROR,
          });
        }
      }
      handleTerminal(
        "freeCodeCamp: Open Course",
        // @ts-expect-error TODO: strongly type this
        gitClone(course.githubLink),
        copyEnv,
        npmInstall,
        liveServer,
        "&",
        hotReload
      );
      openSimpleBrowser();
    }
  } else {
    handleMessage({
      message: "No connection found. Please check your internet connection",
      type: FlashTypes.ERROR,
    });
  }
}

/**
 * Shows an input box using window.showInputBox().
 */
export async function showInputBox() {
  const result = await window.showInputBox({
    value: "abcdef",
    valueSelection: [2, 4],
    placeHolder: "For example: fedcba. But not: 123",
    validateInput: (text) => {
      window.showInformationMessage(`Validating: ${text}`);
      return text === "123" ? "Not 123!" : null;
    },
  });
  window.showInformationMessage(`Got: ${result}`);
}
