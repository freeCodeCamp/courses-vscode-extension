import { workspace, Uri, FileType } from "vscode";
import { handleMessage } from "./handles";
import { Config, FlashTypes } from "./typings";

export const gitClone = (githubLink: string) => `git clone ${githubLink}.git .`;
export const PATH = ".freeCodeCamp";
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
    const path = Uri.file(`${work}/${PATH}/package.json`);
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
    const uriArr = await workspace.findFiles(
      "**/freecodecamp.conf.json",
      "**/node_modules/**",
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
