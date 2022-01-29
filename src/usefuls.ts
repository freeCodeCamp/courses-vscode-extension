import { workspace, Uri, FileType } from "vscode";

export const gitClone = (githubLink: string) => `git clone ${githubLink}.git .`;
export const PATH = ".freeCodeCamp";
export const liveServer = `live-server --port=8080 --entry-file=${PATH}/temp.html --no-browser`;
export const npmInstall = `cd ${PATH} && npm install`;
export const hotReload = `node ${PATH}/tooling/hot-reload.js`;
export const copyEnv = `cp ${PATH}/sample.env ${PATH}/.env`;

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
