# code-template-generator
[![Node.js version](https://img.shields.io/node/v/code-template-generator.svg?style=flat)](https://nodejs.org)   [![code-template-generator](https://img.shields.io/npm/v/code-template-generator.svg?style=flat)](https://www.npmjs.com/package/code-template-generator/)

## Table of contents
1. Introduction
    * [Screenshot](#screenshot)
    * [What's new in version 2.1.x](#whats-new-in-version-21x)
2. [Main features](#main-features)
    * [Supported project templates](#supported-project-templates)
    * [Supported component templates](#supported-component-templates)
3. [Installation](#installation)
4. [Using](#using)
    * [Sub option](#sub-option)
    * [Aliases](#aliases)
5. [Examples](#examples)
6. [Thanks you!](#thank-you)

## 1. Introduction
This is the lightweight React code template generator that has two main parts in one npm package:
* Project template generation that has a part of the [Build environments](https://github.com/nguyenkhois/build-environments) project.
* Code template generation.

You have more choice for your development environment. It makes your life easier.

### Screenshot
![Demo](./assets/screenshot.gif)

### What's new in version 2.1.x
* New features:
    * `generate -u` to check and install automatic the latest stable version.
        * Administrator permission is required when you run this command.
        * Example for MacOS and Ubuntu: `$ sudo generate --update`
    * `simple-express-server` is new project template.
        * You don't need to use `body-parser` because Express 4.x has a built-in middleware [`express.json([options])`](https://expressjs.com/en/api.html#express.json) that is based on.
        * CORS is installed by default.
    * Aliases for the options.
    * Sub option `--no-install` is used when you don't need to install dependencies for a generated project.
* Improvement:
    * Performance.
    * Resolving handling.
    * Error handling.

## 2. Main features
* Project template generation:
    * Without Git support.
    * With Git support -> It runs automatically command `git init` and generates a `.gitignore` file while the project is generated.
* Component generation:
    * Two kinds of generated components: React and React-Redux.
    * It can become a single component that is a file `*.js, *.jsx` or a full component that is a directory with two files `*.js, *.css` are within.
* `.gitignore` file generation.
* Automatic update checking for the latest stable version.
* [Project templates](https://github.com/nguyenkhois/build-environments):
    * It's simple for:
        * Configuration and installation for the dependencies you need.
        * Using together with or moving to/from an other React build environment.
    * Code splitting.
    * Image handling.
    * CSS, JS code injected automatic into HTML template.
    * Hot Module Replacement (HMR) is enabled.
    * You don't need to care about the distribution directory `/dist`. The things you care are only in the source directory `/src`.
    * Anti-caching.

### Supported project templates
|Templates|Main dependencies|
|---|---|
|react-advance|Babel 7, Babel Loader 8, SplitChunksPlugin for code splitting|
|react-simple|Babel 7, Babel Loader 8|
|react-typescript|TypeScript 3, awesome-typescript-loader|

You can view more details about these project templates in this repository [Build environments](https://github.com/nguyenkhois/build-environments).

### Supported component templates
|Component|React|React-Redux (*)|Description|
|---|:---:|:---:|---|
|Single|X|X|A file with these supported extension `*.js, *.jsx`.|
|Full|X|X|A directory with two files `*.js, *.css` that are generated within.|

_(*) You install and config Redux, React-Redux by yourself._

## 3. Installation
`$ npm i -g code-template-generator`

System requirements:
* The minimum supported Node.js version is 8.3.0 (Node.js LTS is a good choice for many reasons).
* Administrator permission is required when you run the command `$ generate -u` for the latest stable version updating.

## 4. Using
`$ generate [option] <project-name>[<component-name>]`

| Argument | Used with | Description |
|:---:|:---:|---|
| `<project-name>` | - |  Generate a new project by the chosen template (without Git support) |
|`-g`|`<project-name>`| Git support is installed automatically by `git init` and a `.gitignore` file is also created on the root of work directory while a new project is generated|
|`-c`|`<component-name.js>`|It will be generate a single React component `(*.js or *.jsx)` in the current directory|
|`-r`|`<component-name.js>`|It will be generate a single React-Redux component `(*.js or *.jsx)` in the current directory|
|`-fc`|`<component-name>`|It will be generate a full React component that is a directory with `*.js, *.css` files in the current directory|
|`-fr`|`<component-name>`|It will be generate a full React-Redux component that is a directory with `*.js, *.css` files in the current directory|
| `-i` |-| A `.gitignore` file will be generated in the current directory |
|`-v`|-|View the installed version|
|`-help`|-|View the help information|
|`-u`|-| Automatic update checking and installation for the latest stable version (*) |

(*) Administrator permission is required. Here is an example for MacOS and Ubuntu system:
* `$ sudo generate -u`

### Sub option

* `--no-install`: no install dependencies when a project is generated.

|Main flag|Sub flag|Used with|Description|
|:---:|:---:|:---:|---|
|-|`--no-install`|`<project-name>`|Generate a project without both Git support and installation of dependencies|
|`-g`|`--no-install`|`<project-name>`|Generate a project with Git support but without installation of dependencies|

### Aliases
|Argument|Alias|
|:---:|:---|
|`-g`|`--git`|
|`-c`|`--component`|
|`-r`|`--redux-component`|
|`-fc`|`--full-component`|
|`-fr`|`--full-redux-component`|
| `-i` |`--gitignore`|
|`-v`|`--version`|
|`-help`|`--help`|
|`-u`|`--update`|

## 5. Examples

````
// Project
$ generate first-project                 // Without Git support
$ generate -g secondproject              // With Git support
$ generate --git ThirdProject            // Using alias --git instead of -g
$ generate -g --no-install OtherProject  // Without installation of dependencies
$ generate --no-install LastProject

// Single component -> A file
$ generate -c SearchComponent.js   // React component
$ generate -r ReviewComponent.jsx  // React-Redux component

// Full component -> A directory
$ generate -fc ProductComponent
$ generate -fr CartComponent

// Other
$ generate --gitignore  // A .gitignore file
$ generate -v           // View the installed version
$ generate -help        // View the help information
$ generate --update     // Check and install the latest stable version
````

## 6. Thank you!
Special thanks to [Harriet Ryder](https://medium.com/northcoders/creating-a-project-generator-with-node-29e13b3cd309)!

Many thanks to [Commander.js](https://github.com/tj/commander.js) for the inspiration.
