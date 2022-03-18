import * as vscode from 'vscode';
import { NodeDependenciesProvider } from './MiHomeProjectTreeDataProjvider';

export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(vscode.commands.registerCommand(
    'vscode-mihome.publish',
    (project) => {
      const cmd = `npm run publish ${project.id}`;
      if (vscode.window.activeTerminal) {
        vscode.window.activeTerminal.sendText(cmd);
      } else {
        vscode.window.createTerminal().sendText(cmd);
      }
      vscode.window.showInformationMessage('发布: ' + project.label);
    }
  ));

  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;
  if (rootPath) {
    const provider = new NodeDependenciesProvider(rootPath);

    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('mihome.projectAliasMap')) {
        provider.refresh();
      }
    }));
    vscode.window.registerTreeDataProvider(
      'mihomeProject',
      provider
    );
  } else {
    vscode.window.showErrorMessage('No workspace opened');
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
