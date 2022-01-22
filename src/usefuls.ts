import { workspace, Uri, FileType } from "vscode";

export const gitClone = (githubLink: string) => `git clone ${githubLink}.git .`;
export const npmInstall = "npm install";
export const liveServer = "live-server --port=8080 --entry-file=temp.html";
export const hotReload = "node ./tooling/hot-reload.js";

export async function ensureDirectoryIsEmpty(): Promise<boolean> {
  try {
    const arrOfArrs = await workspace.fs.readDirectory(
      Uri.file(workspace.workspaceFolders?.[0]?.uri?.fsPath ?? "")
    );
    console.log("arrorror: ", arrOfArrs);
    if (arrOfArrs.length === 0) {
      return Promise.resolve(false);
    } else {
      return Promise.resolve(true);
    }
  } catch (e) {
    console.log("ensureDirectoryIsEmpty: ", e);
    return Promise.resolve(false);
  }
}

export async function ensurePackageJsonExists(): Promise<boolean> {
  try {
    const dir = await workspace.fs.readDirectory(
      Uri.file(workspace.workspaceFolders?.[0]?.uri?.fsPath ?? "")
    );
    if (dir.includes(["package.json", FileType.File])) {
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
}
