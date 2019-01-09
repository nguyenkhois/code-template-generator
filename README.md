# code-template-generator (version 2)
This is the lightweight React code template generator that has two parts in one npm package:
* Code template generation.
* Project template generation that is the [Build environments](https://github.com/nguyenkhois/build-environments) project.

You have more choice for your development environment. It makes your life easier.

## Main features
* Project generation with two options:
    * Without Git support.
    * With Git support - It runs automatically `git init` and generates a `.gitignore` file while the project is generated.
* Component generation:
    * Two kinds of components: React and React-Redux.
    * It can become a single component that is a file `*.js, *.jsx` or a full component that is a directory with two files `*.js, *.css`.
* `.gitignore` file generation whenever you want.
* Automatic update checking for the latest stable version.
* [Project template generation](https://github.com/nguyenkhois/build-environments):
    * It's simple for:
        * Configuration and installation of the dependencies you need.
        * Moving to (or from) an other React build environment.
    * Code splitting.
    * Image handling.
    * CSS, JS code injected automatic into HTML template.
    * Hot Module Replacement (HMR) is enabled.
    * You don't need to care about the distribution directory `/dist`. The things you care are only in the source directory `/src`.
    * Anti-caching.

## Supported templates:
|Templates|Main dependencies|
|---|---|
|react-babel-6|Babel 6, Babel Loader 7|
|react-babel-7|Babel 7, Babel Loader 8|
|react-code-splitting|Babel 7, Babel Loader 8, SplitChunksPlugin for code splitting|
|react-typescript-3|TypeScript 3 and using awesome-typescript-loader|

## Installation
`$ npm i -g code-template-generator@next`

## Using
`$ generate [option] <project-name>[<component-name>]`

| Argument | Used with | Description |
|:---:|:---:|---|
| `<project-name>` | - |  Generate a new project by the chosen code template (without Git support) |
|`-g`|`<project-name>`| Git support is installed automatically by `git init` and a `.gitignore` file is also created on the root of work directory while a new project is generated|
|`-c`|`<component-name.js>`|It will be generate a single React component `(*.js or *.jsx)` in the current directory|
|`-r`|`<component-name.js>`|It will be generate a single React-Redux component `(*.js or *.jsx)` in the current directory|
|`-fc`|`<component-name>`|It will be generate a full React component that is a directory with `*.js, *.css` files in the current directory|
|`-fr`|`<component-name>`|It will be generate a full React-Redux component that is a directory with `*.js, *.css` files in the current directory|
| `-i` |-| A `.gitignore` file will be generated in the current directory |
|`-v`|-|View the installed version|
|`-help`|-|View the help information|

## Breaking changes:
- The `git` support option.
    * Version 1: `$ generate react-counter git`
    * Version 2: `$ generate -g react-counter`
- Requirement for Node.js version is larger than 8.0.0 (Node.js LTS is a good choice for many reasons).

## Examples

````
$ generate new-project
$ generate -g other-project
$ generate -c ProductList.js
$ generate -c Payment.jsx
$ generate -r Cart.js
$ generate -fc Product
$ generate -fr ShoppingCart
$ generate -i
$ generate -v
$ generate -help
````

## Thank you!
Special thanks to [Harriet Ryder](https://medium.com/northcoders/creating-a-project-generator-with-node-29e13b3cd309)!