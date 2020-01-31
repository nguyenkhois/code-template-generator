# code-template-generator
[![Node.js version](https://img.shields.io/node/v/code-template-generator.svg?style=flat)](https://nodejs.org)   [![code-template-generator](https://img.shields.io/npm/v/code-template-generator.svg?style=flat)](https://www.npmjs.com/package/code-template-generator/)

## Table of contents
1. [Introduction](#1-introduction)
2. [Main features](#2-main-features)
    * [Project templates](#21-project-templates)
    * [Component templates](#22-component-templates)
    * [Asset generation](#23-asset-generation)
3. [Installation](#3-installation)
4. [Usage](#4-usage)
    * [Options](#41-options)
    * [Sub options](#42-sub-options)
    * [Aliases](#43-aliases)
5. [Examples](#5-examples)
6. [Thanks you!](#6-thank-you)

(*) [Tips and tricks for the project templates](https://github.com/nguyenkhois/build-environments/blob/master/HOWTO.md)

## 1. Introduction
You like to build yourself development environment and install only what you need in your project. You want to know how it works and have more controll as much as possible. Sometimes you just want to have a little tool to show an idea. The application gives you a step on your way and it makes your life more exciting. (^_~)

The application is a lightweight Node.js CLI tool that is using for front-end web development with  [React](https://reactjs.org/). Main features:
* Project generation that has a part of the [Build environments](https://github.com/nguyenkhois/build-environments) project.
* Component generation.
* Asset generation that is useful when you want using your own project template or config files etc.

### Screenshot
![Screenshot](https://raw.githubusercontent.com/nguyenkhois/code-template-generator/master/assets/screenshot.gif)

## 2. Main features
* Project template generation
    * Two alternative for Git support during the generation:
        * Without Git support _(default)_.
        * With Git support by running the `git init` command and generation of a `.gitignore` file while the project is generated from a chosen template.
    * [Project templates](https://github.com/nguyenkhois/build-environments):
        * It's simple for configuration and installation of only dependencies you need.
            * Fast and flexible.
            * Only the minimum needed dependencies are installed and preconfigured.
            * Easy to change to _(or from)_ another build environment.
            * Compatibility with another projects that are generated from [create-react-app](https://facebook.github.io/create-react-app/).
        * Code splitting.
        * Image handling.
        * Minification for production.
        * CSS, JS code injected automatic into the HTML template `/src/index.html`.
        * Hot Module Replacement (HMR) is enabled.
        * You don't need to care about the distribution directory `/dist`. The things you care are only the directory `/src`.
        * Anti-caching.
* React component generation can be:
    * A single React component that is a JavaScript file _(*.js, *.jsx, *.ts, *.tsx)_.
    * A full React component that is a directory with two files are within: a CSS file and a JS file _(*.js, *.jsx, *.tsx)_.
* Asset generation - You can retrieve your own assets _(project templates, component templates, config files for ESLint, Webpack etc.)_ from a directory on local.
* `.gitignore` file generation.
* Automatic update checking for the latest stable version that is found on npmjs.com.

### 2.1 Project templates
|Templates|Main dependencies|
|---|---|
|react-hooks|React Hooks, Babel |
|react-sass|React Hooks, Babel and SASS |
|react-typescript|React Hooks, TypeScript, ts-loader|

You can view more details and other project templates in the repository [Build environments](https://github.com/nguyenkhois/build-environments).

### 2.2 Component templates
|Component|Single (*)|Full (**)|Description|
|---|:---:|:---:|---|
|Plain JavaScript|*.js|*.css, *.js|Can using *.jsx|
|TypeScript|*.tsx|*.css, *.tsx||

_(*) Single component is a JavaScript file with these supported extensions: *.js, *.jsx, *.ts and *.tsx._

_(**) Full component is a directory with two files are within: a CSS file and a JS file (*.js, *.jsx, *.tsx)._

### 2.3 Asset generation
You can retrieve your own assets from a directory on local.

Reasons:
* You may have your own project templates, code templates, libraries and many more _(.gitignore, .editorconfig, .eslinttrc.json, .eslintignore, webpack.config.js ect)_.
* You don't want to do the same things as search-copy-paste the assets many times while you are coding or starting a new project.

![Asset generation](https://raw.githubusercontent.com/nguyenkhois/code-template-generator/master/assets/userasset.gif)

_(You can view [how to use](#4-usage) and the [examples](#5-examples) are below for more details)_

## 3. Installation
`$ npm install --global code-template-generator`

System requirements:
* The minimum supported Node.js version is __8.9.0__ _(Node.js LTS version is a good choice for the stability)_.
* Administrator permission is required by your operating system for these things:
    * Installation of `code-template-generator` on global by using the option `--global`.
    * Running the command `generate --update` for the latest stable version updating.

## 4. Usage
`$ generate [-option] [--sub-option] [project-name][component-name][path]`

__Tip!__ You can use the command `gen` instead of `generate` from version 2.2.x. It's more quickly when you enter a command line.

Examples:

* `generate -v` -> Main command.
* `gen -v` -> Short command.

### 4.1 Options
| Option | Used with | Description |
|:---:|:---:|---|
| - | `<project-name>` |  Generate a new project from a chosen template __without__ Git support. |
|`-g`|`<project-name>`| Run automatically the `git init` command and generate a `.gitignore` file on the root of project directory during the generation.|
|`-c`|`<component-name>.<extension>`|Generate a __single__ React component in the current directory _(*.js, *.jsx, *.ts, *.tsx)_.|
|`-f`|`<component-name>`|Generate a __full__ React component in the current directory _(*.js, *.jsx, *.tsx)_.|
|`-i`|-| A `.gitignore` file will be generated in the current directory. |
|`-v`|-|View the installed version.|
|`-help`|-|View help documentation.|
|`-u`|-| Automatic update checking and installation for the latest stable version. (*) |
|`-cf`| (**) |Using with one of these sub options: `--set-asset`, `--view-asset`.|
|`-a`|-|Show a list to retrieve chosen asset(s) into the current work directory.|

(*) Administrator permission is required by your operating system. Here are the examples for MacOS and Ubuntu systems by using `sudo`:
* `$ sudo generate -u`
* `$ sudo generate --update` _(Using alias)_

(**) View how to use with its sub options that are below.

### 4.2 Sub options
* `--no-install` _(No install dependencies)_
* `--set-asset` _(Set a local path to the asset directory)_
* `--view-asset` _(View the current local path to the asset directory)_
* `--jsx` _(Using *.jsx instead of *.js)_
* `--tsx` _(Using *.tsx instead of *.js)_

|Option|Sub option|Used with|Description|
|:---:|:---:|:---:|---|
|-|`--no-install`|`<project-name>`|Generate a project __without__ both running the `git init` command and installation of dependencies.|
|`-g`|`--no-install`|`<project-name>`|Generate a project with running the `git init` command but __without__ installation of dependencies.|
|`-cf`|`--set-asset`|`<local-path>`|Store a local path to the asset directory into the application config file.|
|`-cf`|`--view-asset`|-|View the current asset path.|
|`-f`|`--jsx`|`<component-name>`|The application creates a `*.jsx` file instead of a `*.js` file that is default when it generates a full component.|
|`-f`|`--tsx`|`<component-name>`|The application creates a `*.tsx` file instead of a `*.js` file that is default when it generates a full component.|

### 4.3 Aliases
|Option|Alias|
|:---:|:---|
|`-g`|`--git`|
|`-c`|`--component`|
|`-f`|`--full-component`|
|`-i`|`--gitignore`|
|`-v`|`--version`|
|`-help`|`--help`|
|`-u`|`--update`|
|`-cf`|`--config`|
|`-a`|`--asset`|

## 5. Examples

````
// Project generation
$ generate first-project   // Generates a project without any options

$ generate -g secondproject   // With Git support by running 'git init'
$ generate --git ThirdProject   // Using alias --git instead of -g
$ generate -g --no-install OtherProject
$ generate --no-install LastProject  // No install dependencies

// Single component -> A JavaScript file
$ generate -c SearchService.js
$ generate -c ReviewComponent.jsx
$ generate -c CountService.ts
$ generate -c CounterComponent.tsx

// Full component
// -> A directory with two files are within (*.css, *.js|jsx|tsx)
$ generate -f Product         // Default is using *.js
$ generate -f --jsx Cart      // Using *.jsx
$ generate -f --tsx Counter   // Using *.tsx

// Asset generation
$ generate -cf --set-asset "C:\Users\name\myassets"  // Windows
$ generate -cf --set-asset "/Users/name/myassets"    // MacOS
$ generate -cf --set-asset "/home/name/myassets"     // Ubuntu
$ generate -cf --view-asset   // View info about the current asset location
$ generate -a                 // Show the asset list and retrieve them

// Others
$ generate -i      // Generate a .gitignore file
$ generate -v      // View the installed version
$ generate -help   // View help documentation
$ generate -u      // Install the latest stable version
````

## 6. Thank you!
Special thanks to [Harriet Ryder](https://medium.com/northcoders/creating-a-project-generator-with-node-29e13b3cd309)!

Many thanks to [Commander.js](https://github.com/tj/commander.js) for the inspiration.
