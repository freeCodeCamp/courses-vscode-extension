// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, window, ExtensionContext } from "vscode";
import { courseInput } from "./course-input";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Your extension is now active!");

  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.openCourse", async () => {
      courseInput(context);
    })
  );
  // The code you place here will be executed every time your command is executed
  // Display a message box to the user
  // openSimpleBrowser();
  // startLiveServer();
  // startWatcher();
}

// this method is called when your extension is deactivated
export function deactivate() {}

/**
 * This function opens the built-in VSCode Simple Browser, and loads the local port started by live-server
 */
export function openSimpleBrowser() {
  commands.executeCommand("simpleBrowser.show", "http://127.0.0.1:8080/");
}

export function openTerminal() {}

/**
 * This function runs `live-server --port=8080 --entry-file=temp.html` in the background
 */
export function startLiveServer() {
  const terminal = window.createTerminal("freeCodeCamp: Live Server");
  terminal.sendText("live-server --port=8080 --entry-file=temp.html");
}

export function stopLiveServer() {}

/**
 * This function runs `node ./tooling/hot-reload.js` in the background
 */
export function startWatcher() {
  const terminal = window.createTerminal("freeCodeCamp: Watcher");
  terminal.sendText("node ./tooling/hot-reload.js");
}
