import { readFileSync } from "fs";
import { commands, window } from "vscode";
import { Flash, Course, FlashTypes } from "./typings";

/**
 * This function opens the built-in VSCode Simple Browser, and loads the local port started by live-server
 */
export function openSimpleBrowser() {
  commands.executeCommand("simpleBrowser.show", "http://127.0.0.1:8080/");
}

export function openTerminal() {}

/**
 * Runs `live-server --port=8080 --entry-file=temp.html` in the background
 */
export function startLiveServer() {
  const terminal = window.createTerminal("freeCodeCamp: Live Server");
  terminal.sendText("live-server --port=8080 --entry-file=temp.html", true);
}

export function stopLiveServer() {}

/**
 * Runs `node ./tooling/hot-reload.js` in the background
 */
export function startWatcher() {
  const terminal = window.createTerminal("freeCodeCamp: Watcher");
  terminal.sendText("node ./tooling/hot-reload.js", true);
}

export async function installCourseTools(): Promise<Flash> {
  const terminal = window.createTerminal("freeCodeCamp: Install Course Tools");
  terminal.sendText("npm install", true);
  // TODO: Resolve on successful install, reject on exit

  return Promise.resolve({ message: "", type: FlashTypes.INFO });
}

/**
 * Uses Git to clone the course content from the GitHub link into the current directory. **The directory has to be empty!**
 */
export async function gitCourseContent(course: Course): Promise<Flash> {
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
  // TODO: Should maybe clear CWD?
  return Promise.resolve({ message: "", type: FlashTypes.INFO });
}

/**
 * Returns the current working directory `package.json > repository.url` or `null`
 */
export async function currentDirectoryCourse(): Promise<
  Course["githubLink"] | null
> {
  const data = JSON.parse(readFileSync("package.json", "utf8"));
  const courseGithubLink = data?.repository?.url ?? null;
  return Promise.resolve(courseGithubLink);
}
