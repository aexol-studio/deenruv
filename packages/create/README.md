# Deenruv Create

A CLI tool for rapidly scaffolding a new Deenruv server application with a React admin panel. Heavily inspired by [create-react-app](https://github.com/facebook/create-react-app).

The generated project uses **PostgreSQL** as its database and ships with:
- A **server application** (NestJS + GraphQL)
- A **React admin panel** (Vite + React) powered by `@deenruv/admin-dashboard`

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

It will create a directory called `my-app` inside the current folder containing:
- Server source code in `src/`
- React admin panel in `admin/`

## Generated Project Structure

```
my-app/
├── src/                    # Server source (NestJS + GraphQL)
│   ├── index.ts            # Server entry point
│   ├── index-worker.ts     # Worker entry point
│   ├── deenruv-config.ts   # Server configuration
│   └── plugins/            # Custom plugins directory
├── admin/                  # React admin panel (Vite + React)
│   ├── src/
│   │   ├── main.tsx        # React entry point
│   │   └── App.tsx         # Main App component
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── static/                 # Static assets and email templates
├── package.json
├── .env
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Development

After creating your project:

```sh
cd my-app
npm run dev    # Starts server, worker, and admin panel concurrently
```

- **Admin API:** http://localhost:3000/admin-api
- **Shop API:** http://localhost:3000/shop-api
- **Admin UI:** http://localhost:3001/admin-ui

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
