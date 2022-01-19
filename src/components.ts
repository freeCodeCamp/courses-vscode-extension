import { commands, window } from "vscode";

/**
 * This function opens the built-in VSCode Simple Browser, and loads the local port started by live-server
 */
export function openSimpleBrowser() {
  commands.executeCommand("simpleBrowser.show", "http://127.0.0.1:8080/");
}

export function openTerminal() {}

/**
 * This function runs `live-server --port=8080 --entry-file=temp.html` in the background
 */
export function startLiveServer() {
  const terminal = window.createTerminal("freeCodeCamp: Live Server");
  terminal.sendText("live-server --port=8080 --entry-file=temp.html", true);
}

export function stopLiveServer() {}

/**
 * This function runs `node ./tooling/hot-reload.js` in the background
 */
export function startWatcher() {
  const terminal = window.createTerminal("freeCodeCamp: Watcher");
  terminal.sendText("node ./tooling/hot-reload.js", true);
}

export function installCourseTools() {
  const terminal = window.createTerminal("freeCodeCamp: Install Course Tools");
  terminal.sendText("npm install", true);
}

interface Course {
  name: string;
  githubLink: string;
  tags: string[];
}
/**
 * This function uses Git to clone the course content from the GitHub link into the current directory. **The directory has to be empty!**
 */
export async function gitCourseContent(course: Course): Promise<void> {
  const terminal = window.createTerminal("freeCodeCamp: Git Course Content");
  // terminal.sendText(`git clone ${course.githubLink}.git .`, true);
  // window.onDidChangeActiveTerminal(status => {
  //   if (status === 0) {
  //     window.showInformationMessage(`Successfully cloned ${course.name}`);
  //   } else {
  //     window.showErrorMessage(`Failed to clone ${course.name}`);
  //   }
  // }
  // );
}
