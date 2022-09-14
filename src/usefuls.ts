import { workspace, Uri, FileType } from "vscode";
import fetch from "node-fetch";
import { handleMessage } from "./flash";
import { Config, FlashTypes } from "./typings";

export const gitClone = (githubLink: string) => `git clone ${githubLink}.git .`;
export const cd = (path: string, cmd: string) => `cd ${path} && ${cmd}`;

export async function ensureDirectoryIsEmpty(): Promise<boolean> {
  try {
    const arrOfArrs = await workspace.fs.readDirectory(
      Uri.file(workspace.workspaceFolders?.[0]?.uri?.fsPath ?? "")
    );
    if (arrOfArrs.length === 0) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  } catch (e) {
    console.error("freeCodeCamp > ensureDirectoryIsEmpty: ", e);
    return Promise.reject(false);
  }
}

export async function getPackageJson(): Promise<any> {
  try {
    const work = workspace.workspaceFolders?.[0]?.uri?.fsPath ?? "";
    const path = Uri.file(`${work}/package.json`);
    const bin = await workspace.fs.readFile(path);
    const fileData = JSON.parse(bin.toString());
    return Promise.resolve(fileData);
  } catch (e) {
    console.error("freeCodeCamp > getPackageJson: ", e);
    return Promise.reject(e);
  }
}

export async function ensureFileOrFolder(
  fileOrFolder: string,
  type: FileType,
  parentDirectory: string = ""
): Promise<boolean> {
  try {
    const work = Uri.file(workspace.workspaceFolders?.[0]?.uri?.fsPath ?? "");
    const arrOfArrs = await workspace.fs.readDirectory(
      Uri.joinPath(work, parentDirectory)
    );
    if (
      arrOfArrs.find(
        ([name, fileType]) => name === fileOrFolder && fileType === type
      )
    ) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  } catch (e) {
    console.log("freeCodeCamp > ensureFileOrFolder: ", e);
    return Promise.reject(false);
  }
}

/**
 * Finds the `freecodecamp.conf.json` file somewhere in the workspace.
 */
export async function getConfig(): Promise<Config> {
  try {
    // Without `null` in pos. 2, `.vscode > files.exclude` will apply to search.
    const uriArr = await workspace.findFiles(
      "**/freecodecamp.conf.json",
      null,
      1
    );
    if (uriArr.length === 0) {
      return Promise.reject(
        "Unable to find a `freecodecamp.conf.json` file in workspace."
      );
    }
    const bin = await workspace.fs.readFile(uriArr[0]);
    const fileData = JSON.parse(bin.toString());
    return Promise.resolve(fileData);
  } catch (e) {
    console.error("freeCodeCamp > getConfig: ", e);
    handleMessage({
      message: "Unable to find a `freecodecamp.conf.json` file in workspace.",
      type: FlashTypes.ERROR,
    });
    return Promise.reject(e);
  }
}

/**
 * Requests the argument URL every 250ms until it returns a 200 status code, or until the timeout is reached.
 * @param url The URL to ping.
 * @param timeout The timeout in milliseconds.
 */
export async function checkIfURLIsAvailable(
  url: string,
  timeout: number = 10000
): Promise<boolean> {
  try {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const response = await fetchWithTimeout(url, 250);
          if (response.status === 200) {
            clearInterval(interval);
            resolve(true);
          }
        } catch (e) {
          // Do nothing.
          console.log("freeCodeCamp > checkIfURLIsAvailable: ", e);
        }
      }, 250);
      setTimeout(() => {
        clearInterval(interval);
        resolve(false);
      }, timeout);
    });
  } catch (e) {
    console.error("freeCodeCamp > checkIfURLIsAvailable: ", e);
    return Promise.reject(false);
  }
}

async function fetchWithTimeout(url: string, timeout: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, {
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}
