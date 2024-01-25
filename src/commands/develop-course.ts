import { handleConfig } from "../handles";
import { handleMessage } from "../flash";
import { FlashTypes } from "../typings";
import { workspace } from "vscode";

export default async function developCourse() {
  try {
    const config = workspace.getConfiguration("freecodecamp-courses");
    handleConfig(config, "develop-course");
  } catch (e) {
    console.error("freeCodeCamp > runCourse: ", e);
    return handleMessage({
      message: "Unable to develop course. See dev console for more details.",
      type: FlashTypes.ERROR,
    });
  }
}
