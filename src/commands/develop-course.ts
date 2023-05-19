import { window } from "vscode";
import { handleConfig } from "../handles";
import { getConfig, getPackageJson } from "../usefuls";
import { checkForCourseUpdates } from "../updates";
import { updateRepository } from "../update-repository";

export default async function developCourse() {
  try {
    const config = await getConfig();
    const rootPackage = await getPackageJson();
    const githubLink = rootPackage.repository.url;
    const isCourseUpdates = await checkForCourseUpdates(githubLink, config);
    if (isCourseUpdates) {
      const camperChoice = await window.showWarningMessage(
        "This course has been updated. It is recommended you re-clone the repository.",
        "Update",
        "Dismiss"
      );
      if (camperChoice === "Update") {
        return updateRepository();
      }
    }
    handleConfig(config, "develop-course");
  } catch (e) {
    console.error("freeCodeCamp > runCourse: ", e);
    return window.showErrorMessage(
      "Unable to develop course. See dev console for more details."
    );
  }
}
