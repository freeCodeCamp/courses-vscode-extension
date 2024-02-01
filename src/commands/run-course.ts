import { handleConfig } from "../handles";
import { handleMessage } from "../flash";
import { FlashTypes } from "../typings";
import { workspace } from "vscode";

export default async function runCourse() {
  try {
    const config = workspace.getConfiguration("freecodecamp-courses");
    handleConfig(config, "run-course");
  } catch (e) {
    console.error("freeCodeCamp > runCourse: ", e);
    return handleMessage({
      message: "Unable to run course. See dev console for more details.",
      type: FlashTypes.ERROR,
    });
  }
}
