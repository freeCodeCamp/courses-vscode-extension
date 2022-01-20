import { readFileSync } from "fs";
import {
  commands,
  Terminal,
  TerminalExitStatus,
  TerminalState,
  window,
} from "vscode";
import { handleMessage } from "./handles";
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
  const status = await pollTerminal(terminal);
  // TODO: Resolve on successful install, reject on exit
  if (status.code === 0) {
    return Promise.resolve({ message: "T1", type: FlashTypes.INFO });
  } else {
    return Promise.reject({ message: "T2", type: FlashTypes.ERROR });
  }
}

/**
 * Uses Git to clone the course content from the GitHub link into the current directory. **The directory has to be empty!**
 */
export async function gitCourseContent(course: Course): Promise<Flash> {
  // const terminal = window.createTerminal("freeCodeCamp: Git Course Content");
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
  try {
    const data = JSON.parse(readFileSync("./package.json", "utf8"));

    const courseGithubLink = data?.repository?.url ?? null;
    return Promise.resolve(courseGithubLink);
  } catch (e) {
    console.error(e);
    return Promise.resolve(null);
  }
}

/**
 * If `terminal` is still running, await. Otherwise, respond with `status`
 */
export async function pollTerminal(
  terminal: Terminal
): Promise<TerminalExitStatus> {
  const status = terminal.exitStatus;
  console.log(status);
  if (status === undefined) {
    handleMessage({
      message: "Unable to install course tools",
      type: FlashTypes.ERROR,
    });
    return Promise.reject();
  }
  return Promise.resolve(status);
}
