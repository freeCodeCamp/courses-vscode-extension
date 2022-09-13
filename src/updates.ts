import { join } from "path";
import { Config } from "./typings";

export async function checkForCourseUpdates(
  githubLink: string,
  config: Config
): Promise<boolean> {
  const currentVersion = config.version;
  const repoVersion = await getConfigFromGitHub(githubLink);
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
  const res = await fetch(url.href);
  const config = await res.json();
  return config;
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
