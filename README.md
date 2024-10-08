# Deenruv

An open-source headless commerce platform built on [Node.js](https://nodejs.org) with [GraphQL](https://graphql.org/), [Nest](https://nestjs.com/) & [TypeScript](http://www.typescriptlang.org/), with a focus on developer productivity and ease of customization.

[![Build Status](https://github.com/aexol-studio/deenruv/workflows/Build%20&%20Test/badge.svg)](https://github.com/aexol-studio/deenruv/actions)
[![Publish & Install](https://github.com/aexol-studio/deenruv/workflows/Publish%20&%20Install/badge.svg)](https://github.com/aexol-studio/deenruv/actions/workflows/publish_and_install.yml)

### [www.deenruv.io](https://www.deenruv.io/)

-   [Getting Started](https://docs.deenruv.io/guides/getting-started/installation/): Get Deenruv up and running locally in a matter of minutes with a single command
-   [Live Demo](https://demo.deenruv.io/)

## Branches

-   `master` - The latest stable release, currently the 2.x series.
-   `minor` - The next patch release, including new features
-   `major` - The next major release (v3.0)
-   `v1` - The 1.x series, which is no longer actively developed but may still receive critical fixes.

## Structure

This project is a monorepo managed with pnpm. Several npm packages are published from this repo, which can be found in the `packages/` directory.

```
deenruv/
├── docs/           # Documentation source
├── e2e-common/     # Shared config for package e2e tests
├── packages/       # Source for the Deenruv server, admin-ui & plugin packages
├── scripts/
    ├── changelog/  # Scripts used to generate the changelog based on the git history
    ├── codegen/    # Scripts used to generate TypeScript code from the GraphQL APIs
    ├── docs/       # Scripts used to generate documentation markdown from the source
```

## Development

The following instructions are for those who want to develop the Deenruv core framework or plugins (e.g. if you intend to make a pull request).

<!-- For instructions on how to build a project _using_ Deenruv, please see the [Getting Started guide](https://docs.deenruv.io/guides/getting-started/installation/). -->

### 1. Install top-level dependencies

`npm install`

The root directory has a `package.json` which contains build-related dependencies for tasks including:

-   Building & deploying the docs
-   Generating TypeScript types from the GraphQL schema
-   Linting, formatting & testing tasks to run on git commit & push

### 2. Build all packages

`npm run build`

Packages must be built (i.e. TypeScript compiled, admin ui app built, certain assets copied etc.) before being used.

Note that this can take a few minutes.

### 3. Set up the server

The server requires an SQL database to be available. The simplest option is to use SQLite, but if you have Docker available you can use the [dev-server docker-compose file](./packages/dev-server/docker-compose.yml) which will start up both MariaDB and Postgres as well as their GUI management tools.

Deenruv uses [TypeORM](http://typeorm.io), and officially supports **MySQL**, **PostgreSQL** and **SQLite**, though other TypeORM-supported databases may work.

1. Configure the [dev config](./packages/dev-server/dev-config.ts), making sure the connection settings in the `getDbConfig()` function are correct for the database type you will be using.
2. Create the database using your DB admin tool of choice (e.g. phpMyAdmin if you are using the docker image suggested above). Name it according to the `getDbConfig()` settings. If you are using SQLite, you can skip this step.
3. Populate mock data:
    ```bash
     cd packages/dev-server
     DB=<mysql|postgres|sqlite> npm run populate
    ```
    If you do not specify the `DB` variable, it will default to "mysql".

### 4. Run the dev server

```
cd packages/dev-server
DB=<mysql|postgres|sqlite> npm run start
```

Or if you are in the root package

```
DB=<mysql|postgres|sqlite> npm run dev-server:start
```

If you do not specify the `DB` argument, it will default to "mysql".

### Testing admin ui changes locally

If you are making changes to the admin ui, you need to start the admin ui independent from the dev-server:

1. `cd packages/admin-ui`
2. `npm run start`
3. Go to http://localhost:4200 and log in with "superadmin", "superadmin"

This will auto restart when you make changes to the admin ui. You don't need this step when you just use the admin ui just
to test backend changes.

### Testing your changes locally

This example shows how to test changes to the `payments-plugin` package locally, but it will also work for other packages.

1. Open 2 terminal windows:

-   Terminal 1 for watching and compiling the changes of the package you are developing
-   Terminal 2 for running the dev-server

```shell
# Terminal 1
cd packages/payments-plugin
npm run watch
```

:warning: If you are developing changes for the `core`package, you also need to watch the `common` package:

```shell
# Terminal 1
# Root of the project
npm run watch:core-common
```

2. After the changes in your package are compiled you have to stop and restart the dev-server:

```shell
# Terminal 2
cd packages/dev-server
DB=sqlite npm run start
```

3. The dev-server will now have your local changes from the changed package.

### Code generation

[graphql-code-generator](https://github.com/dotansimha/graphql-code-generator) is used to automatically create TypeScript interfaces for all GraphQL server operations and admin ui queries. These generated interfaces are used in both the admin ui and the server.

Running `npm run codegen` will generate the following files:

-   [`packages/common/src/generated-types.ts`](./packages/common/src/generated-types.ts): Types, Inputs & resolver args relating to the Admin API
-   [`packages/common/src/generated-shop-types.ts`](./packages/common/src/generated-shop-types.ts): Types, Inputs & resolver args relating to the Shop API
-   [`packages/admin-ui/src/lib/core/src/common/generated-types.ts`](./packages/admin-ui/src/lib/core/src/common/generated-types.ts): Types & operations relating to the admin-ui queries & mutations.
-   [`packages/admin-ui/src/lib/core/src/common/introspection-result.ts`](./packages/admin-ui/src/lib/core/src/common/introspection-result.ts): Used by the Apollo Client [`IntrospectionFragmentMatcher`](https://www.apollographql.com/docs/react/data/fragments/#fragments-on-unions-and-interfaces) to correctly handle fragments in the Admin UI.
-   Also generates types used in e2e tests in those packages which feature e2e tests (core, elasticsearch-plugin, asset-server-plugin etc).

### Testing

#### Server Unit Tests

The core and several other packages have unit tests which are can be run all together by running `npm run test` from the root directory, or individually by running it from the package directory.

Unit tests are co-located with the files which they test, and have the suffix `.spec.ts`.

If you're getting `Error: Bindings not found.`, please run `npm rebuild @swc/core`.

#### End-to-end Tests

Certain packages have e2e tests, which are located at `/packages/<name>/e2e/`. All e2e tests can be run by running `npm run e2e` from the root directory, or individually by running it from the package directory.

e2e tests use the `@deenruv/testing` package.

<!-- For details of how the setup works, see the [Testing docs](https://docs.deenruv.io/guides/developer-guide/testing/). -->

When **debugging e2e tests**, set an environment variable `E2E_DEBUG=true` which will increase the global Jest timeout and allow you to step through the e2e tests without the tests automatically failing due to timeout.

### Release Process

<!-- TODO -->

## License

MIT
