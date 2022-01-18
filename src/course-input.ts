import { window } from "vscode";
import fetch from "node-fetch";
import {
  openSimpleBrowser,
  startLiveServer,
  startWatcher,
  installCourseTools,
  gitCourseContent,
} from "./components";

interface Course {
  name: string;
  githubLink: string;
  tags: string[];
}

interface Courses {
  courses: Course[];
}

/**
 * Shows a pick list using window.showQuickPick().
 */
export async function courseInput() {
  const { courses } = (await (
    await fetch(
      "https://raw.githubusercontent.com/ShaunSHamilton/courses-plus/main/resources/courses.json"
    )
  ).json()) as Courses;
  const result = await window.showQuickPick(
    courses.map(({ name }) => name),
    {
      placeHolder: "Select a course",
      // onDidSelectItem: (course) =>
    }
  );
  if (result) {
    window.showInformationMessage(`Opening Course: ${result}`);

    await gitCourseContent(courses.find(({ name }) => name === result));
    installCourseTools();
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
