# code-template-generator
[![Node.js version](https://img.shields.io/node/v/code-template-generator.svg?style=flat)](https://nodejs.org)   [![code-template-generator](https://img.shields.io/npm/v/code-template-generator.svg?style=flat)](https://www.npmjs.com/package/code-template-generator/)

## Table of contents
1. [Introduction](#1-introduction)
    * [Screenshot](#screenshot)
    * [What's new in version 2.2.x](#whats-new-in-version-22x)
2. [Main features](#2-main-features)
    * [Supported project templates](#supported-project-templates)
    * [Supported component templates](#supported-component-templates)
3. [Installation](#3-installation)
4. [Using](#4-using)
    * [Sub options](#sub-options)
    * [Aliases](#aliases)
5. [Examples](#5-examples)
6. [Thanks you!](#6-thank-you)

## 1. Introduction
This is the lightweight React code template generator that has these parts in one npm package:
* Project template generation that has a part of the [Build environments](https://github.com/nguyenkhois/build-environments) project.
* Component generation.
* Asset generation.
* Utility.

You have more choice for your development environment. It makes your life easier.

### Screenshot
![Demo](./assets/screenshot.gif)

### What's new in version 2.2.x

![Assets](./assets/userasset.jpg)

* Why?
    * You may have your own libraries, code templates and many more like .gitignore, .editorconfig, .eslinttrc.json, .eslintignore,... You need to use them while you are coding or when you start a new project. We say at they are your assets.
    * You don't want do the same things (copy/ paste) many times. You want to have them whenever you need.
    * It makes you happy with these new features `-cf`, `-m` and a new short command `gen`. ;-)
* New features:
    * New options:
        * `-cf, --config`
        * `-m, --my-asset`
    * Syntaxes (You can also view [how to use](#4-using) or [examples](#5-examples) are below):
        * `generate -cf --set-asset <path-to-your-directory>`
        * `generate -cf --view-asset`
        * `generate -m`
    * Config file `code-template-generator.json` is stored at your __Home directory__ and it depends on your platform. Examples:
        * Windows: `C:\Users\<yourname>`
        * Ubuntu: `/home/<yourname>`
        * MacOS: `/Users/<yourname>`
* A new command is added - You can start a command line by using one of them `generate` or `gen`. Examples:
    * `generate --version` -> Original command.
    * `gen --version` -> It is shorter and more quickly when you type a command line.
* Improvement:
    * Performance.
    * Resolving handling.
    * Error handling.

## 2. Main features
* Project template generation:
    * Without Git support.
    * With Git support -> It runs automatically the `git init` command and generates a `.gitignore` file while the project is generated.
* Component generation:
    * Two kinds of generated components: React and React-Redux.
    * It can become a single component that is a file `*.js, *.jsx` or a full component that is a directory with two files `*.js, *.css` are within.
* `.gitignore` file generation.
* Automatic update checking for the latest stable version.
* [Project templates](https://github.com/nguyenkhois/build-environments):
    * It's simple for:
        * Configuration and installation for the dependencies you need.
        * Using together or moving to/from an other React build environment.
    * Code splitting.
    * Image handling.
    * CSS, JS code injected automatic into HTML template.
    * Hot Module Replacement (HMR) is enabled.
    * You don't need to care about the distribution directory `/dist`. The things you care are only the source directory `/src`.
    * Anti-caching.
* Your own asset(s) generation.

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

_(*) You can install and config Redux, React-Redux by yourself._

## 3. Installation
`$ npm i -g code-template-generator`

System requirements:
* The minimum supported Node.js version is 8.3.0 (Node.js LTS is a good choice for many reasons).
* Administrator permission is required when you run the command `$ generate -u` for the latest stable version installation.

## 4. Using
`$ generate [-option] [--sub-option] [project-name][component-name][path]`

__Tip!__ You can use command `gen` instead of `generate` from version 2.2.0.

| Argument | Used with | Description |
|:---:|:---:|---|
| `<project-name>` | - |  Generate a new project by the chosen template (without Git support) |
|`-g`|`<project-name>`| Run automatically the `git init` command and generate a `.gitignore` file on the root of project directory during generation|
|`-c`|`<component-name.js>`|Generate a single React component `(*.js or *.jsx)` in the current directory|
|`-r`|`<component-name.js>`|Generate a single React-Redux component `(*.js or *.jsx)` in the current directory|
|`-fc`|`<component-name>`|Generate a full React component that is a directory with `*.js, *.css` files in the current directory|
|`-fr`|`<component-name>`|Generate a full React-Redux component that is a directory with `*.js, *.css` files in the current directory|
| `-i` |-| A `.gitignore` file will be generated in the current directory |
|`-v`|-|View the installed version|
|`-help`|-|View the help information|
|`-u`|-| Automatic update checking and installation for the latest stable version (*) |
|`-cf`| (**) |Using with one of these sub options: `--set-asset`, `--view-asset`|
|`-m`|-|Show a list to retrieve chosen asset(s) into the current work directory|

(*) Administrator permission is required. Here is an example for MacOS and Ubuntu system:
* `$ sudo generate -u`

(**) View how to use with its sub options that is below.

### Sub options

* `--no-install` (No install dependencies)
* `--set-asset`
* `--view-asset`

|Main flag|Sub flag|Used with|Description|
|:---:|:---:|:---:|---|
|-|`--no-install`|`<project-name>`|Generate a project without both Git support and installation of dependencies|
|`-g`|`--no-install`|`<project-name>`|Generate a project with Git support but without installation of dependencies|
|`-cf`|`--set-asset`|`<path>`|Store the local path to your asset(s) directory|
|`-cf`|`--view-asset`|-|View the current asset directory path|

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
|`-cf`|`--config`|
|`-m`|`--my-asset`|

## 5. Examples

````
// Project generation
$ generate first-project             // Without options
$ generate -g secondproject          // Run git init
$ generate --git ThirdProject        // Using alias --git instead of -g
$ generate -g --no-install OtherProject
$ generate --no-install LastProject  // Without installation of dependencies

// Single component -> A file
$ generate -c SearchComponent.js   // React component
$ generate -r ReviewComponent.jsx  // React-Redux component

// Full component -> A directory
$ generate -fc ProductComponent
$ generate -fr CartComponent

// Asset generation
$ generate -cf --set-asset "C:\Users\name\myassets"  // Windows
$ generate -cf --set-asset "/home/name/myassets"     // Ubuntu
$ generate -cf --set-asset "/Users/name/myassets"    // MacOS
$ generate -cf --view-asset   // View the current asset location
$ generate -m                 // Show asset list

// Others
$ generate --gitignore  // Generate a .gitignore file
$ generate --version    // View the installed version
$ generate --help       // View the help information
$ generate --update     // Check and install the latest stable version
````

## 6. Thank you!
Special thanks to [Harriet Ryder](https://medium.com/northcoders/creating-a-project-generator-with-node-29e13b3cd309)!

Many thanks to [Commander.js](https://github.com/tj/commander.js) for the inspiration.
