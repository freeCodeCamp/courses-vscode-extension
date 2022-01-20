import { window } from "vscode";
import fetch from "node-fetch";
import {
  openSimpleBrowser,
  startLiveServer,
  startWatcher,
  installCourseTools,
  gitCourseContent,
  currentDirectoryCourse,
} from "./components";
import { Courses } from "./typings";

/**
 * Shows a pick list using window.showQuickPick().
 */
export async function courseInput() {
  // TODO: Timeout fetch after X time
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
    // @ts-expect-error TODO: strongly type this
    await gitCourseContent(course);
    await installCourseTools();
    startLiveServer();
    openSimpleBrowser();
    startWatcher();
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
