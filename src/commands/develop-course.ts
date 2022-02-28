import { handleConfig } from "../handles";
import { handleMessage } from "../flash";
import { FlashTypes } from "../typings";
import { getConfig } from "../usefuls";

export default async function developCourse() {
  try {
    const config = await getConfig();
    handleConfig(config, "develop-course");
  } catch (e) {
    console.error("freeCodeCamp > runCourse: ", e);
    return handleMessage({
      message: "Unable to find a `freecodecamp.conf.json` file in workspace.",
      type: FlashTypes.ERROR,
    });
  }
}
