import { handleConfig, handleMessage } from "../handles";
import { FlashTypes } from "../typings";
import { getConfig } from "../usefuls";

export default async function runCourse() {
  try {
    const config = await getConfig();
    handleConfig(config);
  } catch (e) {
    console.error("freeCodeCamp > runCourse: ", e);
    return handleMessage({
      message: "Unable to find a `freecodecamp.conf.json` file in workspace.",
      type: FlashTypes.ERROR,
    });
  }
}
