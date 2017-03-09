# The bootstrap app design
As it is written in the project description this project contains the configuration files for *building, testing and debugging* an Electron app. The app itself doesn't do anything, the focus is not on the source files.

### Features

- [Built](#building-the-project) (both Main and Renderer code, and the tests as well) from TypeScript
- [Unit tests](#unit-testing-typescript) can be launched in two ways:
  1. [from the command line](#unit-testing-from-the-command-line), using *ts-node* without precompiling
  1. [in the browser](#unit-testing-in-browser), precompiled with Webpack
- [Code coverage](#code-coverage) using Istanbul
- [The application can be debugged](#debugging-electrons-main-process) from VSCode (both Main and Renderer processes)
- [Unit tests can also be debugged](#debugging-unit-tests) from VSCode

## Motivation
What is the reason for building a desktop app with web technologies instead of the good ol' programming languages?

First because it's cross platform. You can build your desktop app for Windows, OSX or Linux from the same source. Of course there are other cross platform languages out there (eg. Java), so why JavaScript?

For first, because it was *created for UI*. Not on its own, but if you add HTML DOM and CSS, they are very much UI technologies. Of course you can create UI with Java as well, there are libraries for that (SWT), but they are not as easy to work with or to customize as these web technologies.

For second, it's popular. Now something being popular wouldn't justify that being chosen, but it has a nice consequence: there are *thousands of libraries* created with that for all possible uses. Not only for small tasks, but complete UI widget toolkits (remember SWT?).

And for last, it's not that JavaScript that it used to be. These days there are unit testing frameworks, linters, packagers, complete state management libraries, polyfill libraries for the latest web APIs and even webservers written in JavaScript. It matured so much for the last years than it's not easier any more to write the source in Java and compile it into JavaScript (GWT).

Of course for that, coding in JavaScript had to go through several *paradigm changes* (and the performance of Google's V8 JavaScript engine also helped a lot). First JavaScript was only used for tasks like validation before form submit. Then with the use of MVC pattern and AJAX the Views were transferred from the server to the browser. Then when speed wasn't an issue any more, also Models and Controllers were brought into the browser. This was working quite well for small-mid sized applications, but for big ones the listener pattern MVC uses created messy and almost unmaintainable code. For that the answer was a one-way state machine setup with shadow DOM and Flux stores. And here we are today. In the meantime Node.js was also born bringing the JavaScript VM to the servers, and also making possible to build desktop applications like Electron apps.

JavaScript also evolved as a language in the last years, its ES6 version is already released with proper class definition syntax and arrow functions, and ES7 is already on its way. Even more, if you don't like that JavaScript is not a strongly typed language, there is [Flow](https://flowtype.org/) or [TypeScript](https://www.typescriptlang.org/) to help you to speed up the development process. It's still the same JavaScript syntax that you'll need to write, only with some extras.

So these days JavaScript is not a toy as it used to be, it's a proper language with a huge ecosystem around it, that's perfectly suitable for writing desktop applications with it.

## Tasks and hotkeys in VSCode
> TODO: generic task setup (with [coloured output](https://code.visualstudio.com/updates/v1_9#_task-execution-in-terminal)) and how keyboard shortcuts work

## Building the project
> TODO: here describe the necessary config files, the command to run from the command line, also the VSCode task, the keyboard shortcut and [the problem matcher](https://code.visualstudio.com/docs/editor/tasks#_defining-a-problem-matcher)

## Unit testing TypeScript
The most popular unit testing library (as of now) for JS is [Mocha](https://mochajs.org/). It can be used with several assertion frameworks to have different testing syntax. It can be invoked from JS, but can also be launched from the command line, or combined with other launchers like Karma. It's still going to be complicated without combining it with something else, so let's focus on launching it on its own. Even in this case there are two options:

1. running the tests in Node, in other words from the command line
2. running them in the browser

We'll see that neither of these option mean building some test bundle alongside with the production bundle, but performing a **special build** that takes all the tests, plus all other sources required by those test files. In other words these testing methods don't test the production code as-is, but test the functions in separation. Which is what unit testing is about, so it shouldn't be an issue.

### Unit testing from the command line
Though Mocha is for executing JavaScript tests, luckily it can pipe the test files through a complier before that. It can either be Babel for ES6/ES7 or [ts-node](https://www.npmjs.com/package/ts-node#mocha) for TypeScript. Since there are other command line options to set for Mocha, it's better to put them into a [config file](https://mochajs.org/#mochaopts) instead, so the launch command can be short in `package.json`.

```shell
--compilers ts:ts-node/register,tsx:ts-node/register
--reporter list
--watch-extensions tsx,ts
--timeout 90000
main/**/*.spec.ts
renderer/**/*.spec.ts
```

The last two lines are the path patterns fo the test files to pick. As a best practice, test files are beside of the sources they test but having `.spec.ts` extensions instead of `.ts`. It's easier to see if tests are missing and it doesn't affect the builds.

> TODO: task and keyboard shortcut setup in VSCode for running the tests
>
> [How to create tasks for building or testing in VSCode](https://code.visualstudio.com/docs/editor/tasks): these tasks can easily be done through the command line, the value in doing it in VSCode is to be able to use the results in the editors. Such as highlighting the compilation errors or jumping to failing tests. See [an example](https://code.visualstudio.com/docs/languages/typescript#_transpiling-typescript-into-javascript) for compilation errors in TypeScript. Also check the notes [here](http://blog.theburge.co/web/2016/02/27/typescript-testing-workflows-part-2-integrating-editors.html#vscode) for the keyboard shortcuts.

### Unit testing in browser
While command line testing is suitable both for server and browser code (Electron: main and renderer processes), for obvious reasons browser testing is more for browser code only.

To load the test in a browser they do have to be compiled and bundled. For that to work for Webpack, a small hack is required. Normally in Webpack a single file is given as the starter point for the bundle (chunk) and all other files are expected for included from there directly or indirectly. The test files however independent from each other (see the test file pattern above).

To solve the issue [most tutorials](http://stackoverflow.com/a/32386750) suggest an index file including all test files dynamically, but there's a neater way: since Webpack config is a normal JavaScript file itself, the file search can be done there as well.

```javascript
// in webpack.config.test.js
entry: {
  test: glob.sync("./renderer/**/*.spec.ts").map(path => "mocha-loader!" + path)
}
```

This code results an array of filenames for the *test* chunk and Wepack puts them nicely into the same output bundle. Also note the `mocha-loader` prefix on the filenames. The [mocha-loader](https://github.com/webpack-contrib/mocha-loader) is a small plugin with a non-existing documentation about that it does exactly, but if you look at its source you can see it's just does the [webpage preparation](https://mochajs.org/#running-mocha-in-the-browser) for the tests that could also be done manually. You just have to load the URL for the output JavaScript in *webpack-dev-server* and it works. No big magic.

## Code coverage
Code coverage in JavaScript is typically done by the [Istanbul](https://istanbul.js.org/) library. The library is currently under a bigger change, and [it's 2.0 command line tool](https://github.com/gotwarlost/istanbul/issues/706) became the [nyc project](https://github.com/istanbuljs/nyc). So that's what is used now to do the code coverage analysis. In it's current version it already supports source maps and can use *ts-node* like Mocha, so there's not much tweaking needed to make it work with TypeScript.

Similar to unit testing (and debugging), articles about TypeScript code coverage just contain the working setups, they don't explain them. This seems to be the minimal working setup:

```json
// in package.json
"scripts": {
  "test:coverage": "nyc npm test"
},
"nyc": {
  "include": [
    "main/**",
    "renderer/**"
  ],
  "extension": [
    ".ts",
    ".tsx"
  ],
  "require": [
    "ts-node/register"
  ],
  "tempDirectory": "output/.nyc_output",
  "reportDir": "output/coverage",
  "sourceMap": true,
  "instrument": true,
  "all": true,
  "reporter": [
    "text-summary",
    "html"
  ]
}
```

*nyc* [can handle](https://github.com/istanbuljs/nyc/blob/master/README.md#instrumenting-your-code) running Mocha through NPM, that's what the script line is doing. Setting options for *nyc* can be done in [3 different ways](https://github.com/istanbuljs/nyc/blob/master/README.md#configuring-nyc) and the simplest one is to put them into the `package.json` file. The options above are:

- **include**: Either with this or with the *exclude* option, but the source folders have to be filtered (`node_modules` and the output folder must definitely be excluded). The file patterns in Mocha config don't matter, since with code coverage untested files are also have to be reported.
- **extensions**: By default only `.js` files are scanned in the included folders, TypeScript extensions have to be added here.
- **require**: This works similarly to Mocha config: here can be the compiler specified if the source files are not simple JavaScript files. But why set it here, if in Mocha it's already set? That's right, those files tested by Mocha don't need this settings, they already been taken care of. This setting is for those files that are *not* tested, not covered. Removing this setting removes those files from the report.
- **tempDirectory** and **reportDir**: They are necessary so code coverage doesn't create additional directories in the project root folder. Removing them doesn't affect the analysis process.
- **sourceMap**: Source map file handling, but it's already `true` by default, so it can be omitted.
- **instrument** and **all**: With both set to `true` all source files are evaluated, even the completely untested ones. If either of them is false, only the tested files are included in the report. *(I'm not sure what's happening here, but that's the effect.)*
- **reporter**: Any of the [supported Istanbul reporters](https://github.com/istanbuljs/istanbul-reports/tree/master/lib) can be listed here. Note that if you want to parse the results in a CI tool (like [in GitLab CI](https://docs.gitlab.com/ce/user/project/pipelines/settings.html#test-coverage-parsing)) use something that has percentages like `text-summary`.

> TODO: Doing the same with [Karma](https://karma-runner.github.io/)

## Debugging TypeScript in VSCode

### Debugging Electron's main process
> Note: Beside of a single setting (see below) this setup could also apply to debugging Express or a command line app, it's not really Electron-specific.

For debugging in VSCode a launch config has to be created in `.vscode/launch.json`. A launch config can only do a single command, but since it's TypeScript, a compilation has to be done first. There are two options for that:

1. As described in the [official VSCode site](https://code.visualstudio.com/docs/extensions/debugging-extensions#_compiling-typescript): a `preLaunchTask` parameter has to be added that runs another task in `.vscode/tasks.json`.
1. [Launch an NPM task](https://code.visualstudio.com/docs/editor/node-debugging#_launch-configuration-support-for-npm-and-other-tools) that can compile and start the app after.

I picked the 2. option because that way application-specific launch scripts can stay in `package.json` along with other scripts, they don't have to be duplicated in a different form.

```json
// in package.json
"scripts": {
  "start": "electron .",
}

// in launch.json
"configurations": [
  {
    "type": "node",
    "request": "launch",
    "name": "Debug Main Process",
    "protocol": "legacy",
    "runtimeExecutable": "npm",
    "windows": {
      "runtimeExecutable": "npm.cmd"
    },
    "runtimeArgs": [ "run-script", "start", "--", "--debug-brk=5858", "--remote-debugging-port=9222" ],
    "port": 5858,
    "cwd": "${workspaceRoot}/output",
    "sourceMaps": true,
    "outFiles": [ "${workspaceRoot}/output/**/*.js" ]
  }
]
```

The "start" script runs Electron but it makes no difference for the launch setup what it actually runs. It could also apply to running Express or a command line app. Note the ``--debug-brk`` option: for Electron with normal ``--debug`` it doesn't work for some reason, nor the next-gen `--inspect`, also it has to have the same port as `port` option in launch config, and you also need to prepend these options with `--` so they are given to the command instead of NPM. You can see, there's no app specific setting in the launch config other than the name of the script (*start*). Also note `sourceMaps` and `outFiles` options: they are needed for VSCode to link TypeScript sources to the JavaScript being executed.

Speaking of them, the sourcemap files also have to be prepared, because default settings don't work. It's Webpack that creates source map files, and the `devtool: "cheap-module-source-map"` setting used before wasn't creating the sourcemap with the right file paths for the debugger plugin.

Fortunately that setting is just a shortcut for an internal Webpack plugin and that plugin can also be configured directly. Two changes have to be made to the map file: the paths in the `sources` array cannot have the "webpack:///" prefix, and the `sourceRoot` has to have the relative path of the project root folder from the output folder. This is how to set them in Webpack config file:

```javascript
// in webpack.config.main.js instead of "devtool: cheap-module-source-map"
plugins: [
  new webpack.SourceMapDevToolPlugin({
    filename: "[file].map",
    moduleFilenameTemplate: "[resourcePath]", // get rid of "webpack:///" prefix
    module: true,
    columns: false,
    sourceRoot: "../" // {workspaceRoot} relative to ./output/
  })
]
```

With these settings you should be able to set breakpoints in the main process' TypeSctipt source file and launching "Debug Main Process" will stop there.

> Note: There's going to be an easier way doing the above when Electron's Node will be [supporting](https://github.com/electron/electron/issues/6634) `--inspect` launch parameter. Then it will be possible to use the *node2* debugger with it's [sourceMapPathOverrides](https://github.com/Microsoft/vscode-node-debug2#sourcemappathoverrides) option, so the Webpack config above won't be necessary.

> TODO: keyboard shortcut setup launching the debugger

### Debugging Electron's renderer process
Setting up VSCode debugging to the renderer process might not be necessary, since Chrome's debugger is really good and also can handle sourcemaps, so not even TypeScript is a problem.

If for any reason debugging it in VSCode was necessary, probably the easiest is to attach to the launched process. For that the [Chrome debugger plugin](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) has to be installed in VSCode first. Debugger can be started with a separate launch config or it can be combined with the main process as well.

```json
// in launch.json
"configurations": [
  {
    "type": "chrome",
    "request": "attach",
    "name": "Debug Renderer Process",
    "port": 9222,
    "webRoot": "${workspaceRoot}",
    "sourceMaps": true,
    "sourceMapPathOverrides": {
      "webpack:///./*": "${workspaceRoot}/*"
    }
  }
],
"compounds": [
  {
    "name": "Debug both Main and Renderer processes",
    "configurations": ["Debug Main Process", "Debug Renderer Process"]
  }
]
```

If you were wondering about the `--remote-debugging-port` option for the Electron starting stript, it was for this config. Note that the port number there has to match the `port` option here. Also note that the debugger plugin can only attach itself to the renderer process if the Chrome debugger is **not** open.

The Webpack config tweak used for the main process is not needed here because the Chrome debugger plugin uses the same debug engine as *node2* and has the `sourceMapPathOverrides` option for fixing the paths in the sourcemaps.

### Debugging unit tests
Similar to the Main process debugging above, unit test debugging is also done through NPM. That results no application-specific launcher settings here as well.

There were two options for unit testing, in Node and in Browser. Either because the browser already has a debugger that can be used, and also because tests in Node cover all parts of the application, VSCode debugging is only set for Node tests.

Remember that those test didn't have a Webpack build before, but the source files were piped through *ts-node*. Fortunately *ts-node* does create sourcemaps in the background and VSCode is able to locate them without any extra configuration, so this launcher setting works:

```json
// in launch.json
"configurations": [
  {
    "type": "node",
    "request": "launch",
    "name": "Debug Tests",
    "protocol": "inspector",
    "runtimeExecutable": "npm",
    "windows": {
      "runtimeExecutable": "npm.cmd"
    },
    "runtimeArgs": [ "run-script", "test", "--", "--inspect=5858" ],
    "port": 5858,
    "cwd": "${workspaceRoot}/output",
    "sourceMaps": true
  }
]
```

Note the `inspector` protocol, it doesn't seem to work with the legacy mode.

## Future enhancements

- Make it modularized by creating three different kind of projects:
  1. a library project that can be loaded with NPM into the other two
  1. a command line project that can be installed globally with NPM and executed with its launcher script file
  1. a GUI project that can be installed as a regular software
- Create a native extension skeleton package

> TODO: App design considerations:
>
> - Functionality should be split between Main and Renderer processes like Main was the server and Renderer the web browser, only they don't communicate over HTTP but with IPC.
> - Main is more suitable for server-like functions also because it has access to operating system stuff.
