import { handleEmptyDirectory, handleTerminal, pollTerminal } from "../handles";
import { handleMessage } from "../flash";
import { FlashTypes } from "../typings";

export default async function createNewCourse() {
  // Ensure directory is empty
  await handleEmptyDirectory();
  const terminalId = "freeCodeCamp: Create New Course";

  // Clone just the contents of the `minimal-example` directory from the `main` branch of `https://github.com/freeCodeCamp/freeCodeCampOS`
  const commands = [
    `git clone -n --depth=1 --filter=tree:0 https://github.com/freeCodeCamp/freeCodeCampOS.git`,
    `cd freeCodeCampOS`,
    `git sparse-checkout set --no-cone minimal-example`,
    `git checkout`,
    `mv minimal-example/* ../`,
    `cd ..`,
    `rm -rf freeCodeCampOS`,
    `exit`,
  ];

  const terminal = handleTerminal(".", terminalId, ...commands);
  const exitStatus = await pollTerminal(terminal);
  if (exitStatus?.code !== 0) {
    handleMessage({
      message: "Error creating new course. See terminal for details.",
      type: FlashTypes.ERROR,
    });
    return Promise.reject();
  }
}
