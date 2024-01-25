import { commands, ExtensionContext, window, workspace } from "vscode";
import openCourse from "./commands/open-course";
import runCourse from "./commands/run-course";
import developCourse from "./commands/develop-course";
import collapse from "./commands/collapse";

export async function activate(context: ExtensionContext) {
  console.log("freeCodeCamp Courses extension is now active!");

  // Get extension settings
  const configuration = workspace.getConfiguration("freecodecamp-courses");
  try {
    if (configuration.get("autoStart")) {
      runCourse();
    }
  } catch (e) {
    console.debug(e);
  }

  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.openCourse", async () => {
      openCourse();
    })
  );
  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.runCourse", async () => {
      runCourse();
    })
  );
  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.developCourse", async () => {
      developCourse();
    })
  );
  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.collapse", async () => {
      collapse();
    })
  );
  context.subscriptions.push(
    commands.registerCommand(
      "freecodecamp-courses.shutdownCourse",
      async () => {
        shutdownCourse();
      }
    )
  );
}

function shutdownCourse() {
  // End all running terminal processes
  window.terminals.forEach((terminal) => {
    terminal.dispose();
  });

  // This is a bit of a hack to close the Simple Browser window
  // So, it might not work well.
  try {
    window.visibleTextEditors.forEach((editor) => {
      window.showTextDocument(editor.document).then((_) => {
        return commands.executeCommand("workbench.action.closeActiveEditor");
      });
    });
  } catch {}
}

// this method is called when your extension is deactivated
export function deactivate() {}
