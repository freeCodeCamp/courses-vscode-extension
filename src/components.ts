import { commands, Uri, workspace, window } from "vscode";
import { Course, FlashTypes } from "./typings";
import { handleMessage } from "./flash";

export async function openTerminal() {
  const terminal = window.createTerminal("freeCodeCamp");
  terminal.sendText(`source ~/.bashrc`, true);
  // TODO: clear terminal
  terminal.show();
}

/**
 * This function opens the built-in VSCode Simple Browser, and loads the local port started by live-server
 */
export function openSimpleBrowser(url: string) {
  commands.executeCommand("simpleBrowser.show", url);
}

/**
 * Returns the current working directory `package.json > repository.url` or `null`
 */
export async function currentDirectoryCourse(): Promise<
  Course["githubLink"] | null
> {
  try {
    const work = workspace.workspaceFolders?.[0]?.uri?.fsPath ?? "";
    const path = Uri.file(work);
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
    return Promise.resolve(res.status === 200);
  } catch (e) {
    console.log("isConnected: ", e);
    return Promise.resolve(false);
  }
}
