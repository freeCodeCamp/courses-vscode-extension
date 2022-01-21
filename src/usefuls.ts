export const gitClone = (githubLink: string) => `git clone ${githubLink}.git .`;
export const npmInstall = "npm install";
export const liveServer = "live-server --port=8080 --entry-file=temp.html";
export const hotReload = "node ./tooling/hot-reload.js";
