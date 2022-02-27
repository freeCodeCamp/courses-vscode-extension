import { commands, ExtensionContext, window } from "vscode";
import openCourse from "./commands/open-course";
import runCourse from "./commands/run-course";
import developCourse from "./commands/develop-course";
import createNewCourse from "./commands/create-new-course";
import { handleConfig } from "./handles";
import { getConfig } from "./usefuls";
import test from "./commands/test";

export function activate(context: ExtensionContext) {
  console.log("freeCodeCamp Courses extension is now active!");

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
    commands.registerCommand(
      "freecodecamp-courses.shutdownCourse",
      async () => {
        shutdownCourse();
      }
    )
  );
  context.subscriptions.push(
    commands.registerCommand(
      "freecodecamp-courses.createNewCourse",
      async () => {
        createNewCourse();
      }
    )
  );
  context.subscriptions.push(
    commands.registerCommand("freecodecamp-courses.test", async () => {
      // Find open remote ports in vscode
      try {
        const res = await test();
        console.log("test: ", res);
      } catch (e) {
        console.error("test: ", e);
      }
    })
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
