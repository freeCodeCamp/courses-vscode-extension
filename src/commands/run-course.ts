import { handleConfig } from "../handles";
import { window } from "vscode";
import { getConfig, getPackageJson } from "../usefuls";
import { checkForCourseUpdates } from "../updates";
import { updateRepository } from "../update-repository";

export default async function runCourse() {
  try {
    const config = await getConfig();
    const rootPackage = await getPackageJson();
    const githubLink = rootPackage.repository.url;
    const isCourseUpdates = await checkForCourseUpdates(githubLink, config);
    if (isCourseUpdates) {
      /**
       * There is an update to the curriculum, it is recommended that you update your local copy of the curriculum and rebuild the container.
       * NOTE: You will lose any progress in your container.
       */
      const camperChoice = await window.showWarningMessage(
        "This course has been updated. It is recommended you update the repository.",
        "Update",
        "Dismiss"
      );
      if (camperChoice === "Update") {
        return updateRepository();
      }
    }
    handleConfig(config, "run-course");
  } catch (e) {
    console.error("freeCodeCamp > runCourse: ", e);
    return window.showErrorMessage(
      "Unable to run course. See dev console for more details."
    );
  }
}
