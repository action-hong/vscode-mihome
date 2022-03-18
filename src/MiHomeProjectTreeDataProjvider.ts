import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class NodeDependenciesProvider
  implements vscode.TreeDataProvider<Dependency>
{
  constructor(private workspaceRoot: string) {}

  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | null | void> = new vscode.EventEmitter<Dependency | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No dependency in empty workspace');
      return Promise.resolve([]);
    }

    const projectsPath = path.join(this.workspaceRoot, 'projects');
    if (this.pathExists(projectsPath)) {
      return Promise.resolve(this.getProjects(projectsPath));
    } else {
      vscode.window.showInformationMessage('Workspace has projects');
      return Promise.resolve([]);
    }
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  private getProjects(projectsPath: string): Dependency[] {
    if (this.pathExists(projectsPath)) {
      const map = vscode.workspace.getConfiguration().get("mihome.projectAliasMap") as Record<string, string> || {};
      return fs.readdirSync(projectsPath)
        .filter(file => fs.statSync(path.join(projectsPath, file)).isDirectory())
        .map(id => {
          let project = id;
          if (map[project]) {
            project = `${project}(${map[project]})`;
          }
          const dependency = new Dependency(project);
          dependency.id = id;
          return dependency;
        });
    } else {
      return [];
    }
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

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState);
  }
}
