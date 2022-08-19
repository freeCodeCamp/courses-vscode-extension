import { window } from "vscode";
import {
  handleConnection,
  handleEmptyDirectory,
  createBackgroundTerminal,
} from "../handles";

import { Courses } from "../typings";
import { promptQuickPick } from "../inputs";
import { currentDirectoryCourse } from "../components";
import { gitClone } from "../usefuls";

export default async function openCourse() {
  try {
    await handleConnection();

    const { courses } = (await (
      await fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/freecodecamp-courses/main/resources/courses.json"
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
    const coursePicked = await promptQuickPick(courseNames, {
      placeHolder: "Select a course",
      canPickMany: false,
    });

    if (coursePicked) {
      window.showInformationMessage(`Downloading Course: ${coursePicked}`);

      const course = courses.find(
        ({ name }) => name === coursePicked.replace("Re-download: ", "")
      );
      if (course?.githubLink !== courseGitDownloaded) {
        await handleEmptyDirectory();
        await createBackgroundTerminal(
          "freeCodeCamp: Git Course",
          // @ts-expect-error TODO: strongly type this
          gitClone(course.githubLink)
        );
      } else {
        await createBackgroundTerminal("freeCodeCamp: Re-Git", "git pull");
      }

      // TODO: This does not work for some reason
      // await rebuildAndReopenInContainer();
    }
  } catch (e) {
    console.error(e);
  }
}
