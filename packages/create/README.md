# Deenruv Create

A CLI tool for rapidly scaffolding a new Deenruv server application. Heavily inspired by [create-react-app](https://github.com/facebook/create-react-app).

The generated project uses **PostgreSQL** as its database and ships as a **server-only** application (no bundled admin UI).

## Usage

Deenruv Create requires [Node.js](https://nodejs.org/en/) v18+ to be installed and a running PostgreSQL instance.

To create a new project, you may choose one of the following methods:

### npx

```sh
npx @deenruv/create my-app
```

_[npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher._

### npm

```sh
npm init @deenruv my-app
```

_`npm init <initializer>` is available in npm 6+_

### Yarn

```sh
yarn create @deenruv my-app
```

_`yarn create` is available in Yarn 0.25+_

It will create a directory called `my-app` inside the current folder.

## Options

### `--use-npm`

By default, Deenruv Create will detect whether a compatible version of Yarn is installed, and if so will display a prompt to select the preferred package manager.
You can override this and force it to use npm with the `--use-npm` flag.

### `--log-level`

You can control how much output is generated during the installation and setup with this flag. Valid options are `silent`, `info` and `verbose`. The default is `silent`

Example:

```sh
npx @deenruv/create my-app --log-level verbose
```
