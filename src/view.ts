import * as vscode from "vscode";
import * as fs from "fs";

type ProjectEvent = Project | undefined | void;

type Superblock = {
  dashedName: string;
  public: boolean;
  title: string;
};

export class ProjectsProvider implements vscode.TreeDataProvider<Project> {
  private _onDidChangeTreeData: vscode.EventEmitter<ProjectEvent> =
    new vscode.EventEmitter<ProjectEvent>();
  readonly onDidChangeTreeData: vscode.Event<ProjectEvent> =
    this._onDidChangeTreeData.event;
  readonly superblocks: Superblock[];

  constructor(superblocks: Superblock[]) {
    this.superblocks = superblocks;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Project): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Project): Thenable<Project[]> {
    if (element) {
      const superblock = this.superblocks.find(
        ({ title }) => title === element.label
      );
      return Promise.resolve(this.getProjects(superblock));
    } else {
      return Promise.resolve(this.getProjects());
    }
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  private async getProjects(superblock?: Superblock): Promise<Project[]> {
    if (superblock) {
      const superblockMeta = await (
        await fetch(
          `https://freecodecamp.org/curriculum-data/v1/${superblock.dashedName}.json`
        )
      ).json();
      const blocks = Object.entries(
        superblockMeta[superblock.dashedName].blocks
      ).map(([key, value]) => {
        return new Project(
          // @ts-ignore
          value.challenges.name,
          vscode.TreeItemCollapsibleState.None
        );
      });
      return Promise.resolve(blocks);
    }
    const projects = this.superblocks.map(({ title }) => {
      return new Project(title, vscode.TreeItemCollapsibleState.Collapsed);
    });
    return Promise.resolve(projects);
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }

    return true;
  }
}

export class Project extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    this.tooltip = this.label;
    this.description = "";
  }

  // iconPath = {
  //   light: path.join(
  //     __filename,
  //     "..",
  //     "..",
  //     "resources",
  //     "light",
  //     "dependency.svg"
  //   ),
  //   dark: path.join(
  //     __filename,
  //     "..",
  //     "..",
  //     "resources",
  //     "dark",
  //     "dependency.svg"
  //   ),
  // };

  contextValue = "project";
}
