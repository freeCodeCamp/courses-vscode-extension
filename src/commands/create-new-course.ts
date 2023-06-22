import { handleEmptyDirectory, handleTerminal, pollTerminal } from "../handles";
import { handleMessage } from "../flash";
import { FlashTypes } from "../typings";

export default async function createNewCourse() {
  // Ensure directory is empty
  await handleEmptyDirectory();
  const terminalId = "freeCodeCamp: Create New Course";
  const commands = [
    "npm init -y",
    "npm i @freecodecamp/freecodecamp-os",
    "touch freecodecamp.conf.json",
    'echo \'{"path": ".","version":"0.0.1","scripts":{"develop-course": "NODE_ENV=development node ./node_modules/@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/server.js","run-course": "NODE_ENV=production node ./node_modules/@freecodecamp/freecodecamp-os/.freeCodeCamp/tooling/server.js"},"curriculum":{"locales":{"english":"./curriculum/locales/english"}}}\' > freecodecamp.conf.json',
    "mkdir -p curriculum/locales/english",
    "touch curriculum/locales/english/example.md",
    'echo "# Example - Course\n\nThis is an example course.\n\n## 1\n\n## --fcc-end--\n" > curriculum/locales/english/example.md',
    "mkdir config",
    "touch config/projects.json",
    'echo \'[{"id": 0, "title": "Example", "dashedName": "example"}]\' > config/projects.json',
    "touch config/state.json",
    'echo \'{"currentProject": null, "locale": "english"}\' > config/state.json',
    "mkdir example",
    "touch example/.gitkeep",
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
