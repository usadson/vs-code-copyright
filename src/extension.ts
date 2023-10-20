// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fs = require('fs');

interface FileInfo {
	extension: string,
	text: string
}

function debug(text: string) {
	// console.log(text);
	// vscode.window.showInformationMessage(text);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let newFiles: string[] = [];

	vscode.workspace.onDidCreateFiles(e => {
		newFiles = e.files.map(x => x.fsPath);
		debug(`Did Create Files: ${JSON.stringify(newFiles)}`);
	});

	vscode.workspace.onDidOpenTextDocument(e => {
		debug('Did Open Text Document');
		if (e.isUntitled) {
			debug('Sorry: untitled');
			return;
		}

		const path = e.uri.fsPath;
		if (!newFiles.includes(path)) {
			debug(`Sorry: not a new file: ${JSON.stringify(path)}`);
			return;
		}

		const text = e.getText();
		if (text.trim().length !== 0) {
			debug(`Sorry: not empty: ${text}`);
			return;
		}

		const config = vscode.workspace.getConfiguration("copyright");
		debug(`Config: ${JSON.stringify(config)}`);
		console.log();

		const configData = config.get("files") as FileInfo[];
		debug(`Data: ${JSON.stringify(configData)}`);
		for (const info of configData) {
			if (path.endsWith(info.extension)) {
				fs.writeFileSync(e.uri.fsPath, info.text);
				return;
			}
		}
	})
}

// This method is called when your extension is deactivated
export function deactivate() {}
