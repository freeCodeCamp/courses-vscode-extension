import { workspace, Uri } from "vscode";

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
          console.debug("freeCodeCamp > checkIfURLIsAvailable: ", e);
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
