# code-template-generator
This is the lightweight React code template generator that has two parts in one npm package:
* Project template generation that has a part of the [Build environments](https://github.com/nguyenkhois/build-environments) project.
* Code template generation.

You have more choice for your development environment. It makes your life easier.

## Main features
* Project template generation has two options:
    * Without Git support.
    * With Git support - It runs automatically `git init` and generates a `.gitignore` file while the project is generated.
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

## Supported project templates:
|Templates|Main dependencies|
|---|---|
|react-advance|Babel 7, Babel Loader 8, SplitChunksPlugin for code splitting|
|react-simple|Babel 7, Babel Loader 8|
|react-typescript|TypeScript 3, awesome-typescript-loader|

## Supported component templates:
|Component|React|React-Redux (*)|Description|
|---|:---:|:---:|---|
|Single|X|X|A file with these supported extension `*.js, *.jsx`.|
|Full|X|X|A directory with two files `*.js, *.css` that are generated within.|

_(*) You install and config Redux, React-Redux by yourself._

## Installation
`$ npm i -g code-template-generator@next`

## Using
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

## Breaking changes:
- Removed the project template `react-babel-6`.
- Changed the `git` support option.
    * Version 1: `$ generate react-counter git`
    * Version 2: `$ generate -g react-counter`
- Requirement for Node.js version is larger than 8.0.0 (Node.js LTS is a good choice for many reasons).

## Examples

````
// Project
$ generate first-project      // Without Git support
$ generate -g second-project  // With Git support

// Single component -> A file
$ generate -c SearchComponent.js   // React component
$ generate -c ReviewComponent.jsx
$ generate -r PaymentComponent.js  // React-Redux component

// Full component -> A directory
$ generate -fc ProductComponent
$ generate -fr CartComponent

// Other
$ generate -i     // A .gitignore file
$ generate -v     // Installed version
$ generate -help  // Help information
````

## Thank you!
Special thanks to [Harriet Ryder](https://medium.com/northcoders/creating-a-project-generator-with-node-29e13b3cd309)!