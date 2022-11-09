import { handleConfig } from "../handles";
import { handleMessage } from "../flash";
import { FlashTypes } from "../typings";
import { getConfig, getPackageJson } from "../usefuls";
import { checkForCourseUpdates } from "../updates";

export default async function developCourse() {
  try {
    const config = await getConfig();
    const rootPackage = await getPackageJson();
    const githubLink = rootPackage.repository.url;
    const isCourseUpdates = await checkForCourseUpdates(githubLink, config);
    if (isCourseUpdates) {
      handleMessage({
        message:
          "This course has been updated. It is recommended you re-clone the repository.",
        type: FlashTypes.WARNING,
      });
    }
    handleConfig(config, "develop-course");
  } catch (e) {
    console.error("freeCodeCamp > runCourse: ", e);
    return handleMessage({
      message: "Unable to develop course. See dev console for more details.",
      type: FlashTypes.ERROR,
    });
  }
}
