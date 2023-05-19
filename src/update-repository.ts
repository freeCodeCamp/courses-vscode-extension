import { window } from "vscode";
import { currentDirectoryCourse } from "./components";
import { createBackgroundTerminal } from "./handles";

/**
 * Pulls the latest changes from the remote repository.
 */
export async function updateRepository() {
  const courseGitDownloaded = await currentDirectoryCourse();

  // git checkout -b "<timestamp>"
  // git commit -m "test"
  // git checkout main
  // git pull upstream main
  // git reset --hard upstream/main
  // Tell camper where to find history
  const termStatus = await createBackgroundTerminal(
    "freeCodeCamp: Git Pull",
    `git pull ${courseGitDownloaded} main`
  );

  if (termStatus.code !== 0) {
    window.showErrorMessage("Error updating course.");
  } else {
    window.showInformationMessage("Course updated successfully.");
  }
}
