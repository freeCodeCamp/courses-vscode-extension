import { join } from "path";
import { window } from "vscode";
import fetch from "node-fetch";
import { Config } from "./typings";

export async function checkForCourseUpdates(
  githubLink: string,
  config: Config
): Promise<boolean> {
  const currentVersion = config.version;
  if (!currentVersion) {
    window.showWarningMessage(
      "Unable to find curriculum version from `freecodecamp.conf.json` file"
    );
    return false;
  }

  const repoConfig = await getConfigFromGitHub(githubLink);
  if (!repoConfig) {
    return false;
  }

  const repoVersion = repoConfig.version;
  if (!repoVersion) {
    window.showWarningMessage("Unable to get curriculum version from upstream");
    return false;
  }

  const [currMajor, currMinor, currPatch] = semVer(currentVersion);
  const [repoMajor, repoMinor, repoPatch] = semVer(repoVersion);
  return (
    currMajor < repoMajor || currMinor < repoMinor || currPatch < repoPatch
  );
}

function semVer(version: string) {
  const mat = version.match(/(\d+)\.?(\d+)?\.?(\d+)?/);
  if (!mat) {
    return [0, 0, 0];
  }
  const major = Number(mat[1]);
  const minor = Number(mat?.[2]) || 0;
  const patch = Number(mat?.[3]) || 0;
  return [major, minor, patch];
}

async function getConfigFromGitHub(githubLink: string) {
  // Example: https://raw.githubusercontent.com/freeCodeCamp/web3-curriculum/main/freecodecamp.conf.json
  const url = githubLinkToURL(githubLink);
  try {
    const res = await fetch(url.href);
    const config = (await res.json()) as Config;
    return config;
  } catch (e) {
    console.error(e);
    window.showWarningMessage(
      "Unable to check for latest curriculum version: " + url.href
    );
  }
  return null;
}

function githubLinkToURL(githubLink: string) {
  const { pathname } = new URL(githubLink);
  const pathWithoutDotGit = pathname.replace(".git", "");
  const repo = pathWithoutDotGit.match(/\/[^\.\/]+\/[^\.\/]+$/);
  if (!repo) {
    return new URL(githubLink);
  }
  const RAW_DOMAIN = "https://raw.githubusercontent.com";
  const CONFIG_FILE = "main/freecodecamp.conf.json";
  const url = join(RAW_DOMAIN, repo[0], CONFIG_FILE);
  return new URL(url);
}
