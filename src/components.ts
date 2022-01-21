import { commands, Uri, workspace } from "vscode";
import { Course } from "./typings";

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
    const bin = await workspace.fs.readFile(Uri.file("./package.json"));
    // Turn Uint8Array into string
    const fileData = JSON.parse(bin.toString());
    const courseGithubLink = fileData?.repository?.url ?? null;
    return Promise.resolve(courseGithubLink);
  } catch (e) {
    console.error(e);
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
    return Promise.resolve(false);
  }
}
