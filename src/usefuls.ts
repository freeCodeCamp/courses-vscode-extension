import { workspace, Uri, FileType } from "vscode";

export const gitClone = (githubLink: string) => `git clone ${githubLink}.git .`;
export const npmInstall = "cd .. && npm install && cd curriculum";
export const liveServer = "live-server --port=8080 --entry-file=../temp.html";
export const hotReload = "node ../tooling/hot-reload.js";
export const copyEnv = "cp ../sample.env ../.env";

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
    const path = Uri.file(workspace.workspaceFolders?.[0]?.uri?.fsPath ?? "");
    const bin = await workspace.fs.readFile(
      Uri.joinPath(path, "..", "package.json")
    );
    const fileData = JSON.parse(bin.toString());
    return Promise.resolve(fileData);
  } catch (e) {
    console.error("freeCodeCamp > getPackageJson: ", e);
    return Promise.reject(e);
  }
}

export async function ensureFileOrFolder(
  fileOrFolder: string,
  type: FileType
): Promise<boolean> {
  try {
    const arrOfArrs = await workspace.fs.readDirectory(
      Uri.file(workspace.workspaceFolders?.[0]?.uri?.fsPath ?? "")
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
