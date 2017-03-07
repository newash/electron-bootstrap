# Desktop app bootstrap 2017
Written in TypeScript and using React, Redux and [Electron](https://electron.atom.io/).

This bootstrap project is created to provide all the essential setup and configuration files for **building, testing and debugging** a JavaScript app having both a UI and a backend part. The necessary information for that were collected from several articles on the Internet, and combined together to support this specific setup:

- source written in TypeScript (because especially for larger projects it's faster and more efficient than regular JavaScript)
- using Visual Studio Code as the editor / debugger (because currently it has the best intellisense features for TypeScript)
- and using the Electron framework (that is the most popular framework for creating desktop apps in JS).

For the complete list of features and for the explanations, see [the documentation](docs/README.md).

## Folder contents

- [**.vscode/**](.vscode) - VSCode task and debug configurations
- [**assets/**](assets) - static assets
- [**docs/**](docs/README.md) - documentation
- [**main/**](main) - Electron's Main process code (aka the server)
- [**renderer/**](renderer) - Electron's Renderer process code (aka the GUI)
- [**typings/**](typings) - custom type declaration files for some Node packages
- [**mocha.opts**](mocha.opts) - Mocha tests' config file
- [**package.json**](package.json) - Node project definition file with all the command line scripts
- [**tsconfig.json**](tsconfig.json) - TypeScript project definition file
- [**webpack.config.***](webpack.config.base.js) - build configs for Webpack
