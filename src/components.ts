import { commands, Uri, workspace, window } from "vscode";
import { Course, FlashTypes } from "./typings";
import fetch from "node-fetch";
import { handleMessage } from "./handles";

export async function openTerminal() {
  const currentWorkspaceDir = await getRootWorkspaceDir();
  const terminal = window.createTerminal("freeCodeCamp");
  terminal.sendText(
    `echo '\n# freeCodeCamp Courses\nPROMPT_COMMAND="echo $PWD >> ${currentWorkspaceDir}/curriculum/.freecodecamp/.cwd; history -a"\ntrap "echo $BASH_COMMAND >> ${currentWorkspaceDir}/curriculum/.freecodecamp/.next_command" DEBUG' >> ~/.bashrc`,
    true
  );
  terminal.sendText(`source ~/.bashrc`, true);
  // TODO: clear terminal
  terminal.show();
}

/**
 * This function opens the built-in VSCode Simple Browser, and loads the local port started by live-server
 */
export function openSimpleBrowser() {
  commands.executeCommand("simpleBrowser.show", "http://127.0.0.1:8080/");
}

/**
 * Returns the current working directory `package.json > repository.url` or `null`
 */
export async function currentDirectoryCourse(): Promise<
  Course["githubLink"] | null
> {
  try {
    const path = Uri.file(workspace.workspaceFolders?.[0]?.uri?.fsPath ?? "");
    const bin = await workspace.fs.readFile(Uri.joinPath(path, "package.json"));
    const fileData = JSON.parse(bin.toString());
    const courseGithubLink = fileData?.repository?.url ?? null;
    return Promise.resolve(courseGithubLink);
  } catch (e) {
    console.error(e);
    handleMessage({ message: e as string, type: FlashTypes.INFO });
    return Promise.resolve(null);
  }
}

export async function getRootWorkspaceDir() {
  try {
    const path = Uri.file(workspace.workspaceFolders?.[0]?.uri?.fsPath ?? "");
    return Promise.resolve(path.path);
  } catch (e) {
    console.error(e);
    handleMessage({ message: e as string, type: FlashTypes.INFO });
    return Promise.resolve(null);
  }
}

/**
 * This function pings `google.com` to check if internet connection is available
 * @returns boolean
 */
export async function isConnectedToInternet(): Promise<boolean> {
  try {
    const res = await fetch("https://www.google.com");
    return Promise.resolve(res.ok);
  } catch (e) {
    console.log("isConnected: ", e);
    return Promise.resolve(false);
  }
}
