# Deenruv

Headless commerce platform built on [Node.js](https://nodejs.org) with [GraphQL](https://graphql.org/), [Nest](https://nestjs.com/) & [TypeScript](http://www.typescriptlang.org/), with a focus on developer productivity, ease of customization and highly customizable Admin panel built on [React](https://react.dev/) with [Vite](https://vite.dev/).

### [deenruv.com](https://deenruv.com/)

-   [Getting Started](https://deenruv.com/docs): Get Deenruv up and running locally in a matter of minutes with a single command
-   [Demo Storefront](https://deenruv.com/storefront)
-   [Demo Admin-ui](https://deenruv.com/admin-ui)
-   [Demo Legacy Admin](https://deenruv.com/admin)

## Branches

-   `main` - The latest stable release
-   `develop` - testing place for finished features/bugfixes before merging to main

## Structure

This project is a monorepo managed with pnpm. Several npm packages and plugins are published from this repo, which can be found in the `packages/` and `plugins/` directories.

```
deenruv/
├── apps/           # Source for local environment applications
├── packages/       # Source for packages
├── plugins/        # Source for plugins
├── docs/           # Documentation source
├── e2e-common/     # Shared config for package e2e tests
├── scripts/
    ├── changelog/  # Scripts used to generate the changelog based on the git history
    ├── codegen/    # Scripts used to generate TypeScript code from the GraphQL APIs
    ├── docs/       # Scripts used to generate documentation markdown from the source
```

## Local Environment

Running localhost environment is quite simple and straightforward. Make sure You have node (preferably 18+) and docker on Your machine.

1. `pnmp i` will install all dependencies
2. `pnpm build` will build all necessary packages
3. `pnpm server-docker-up` will start necessary docker containers

    - redis (jobQueue)
    - minio (local s3)
    - postgres (db)

4. `pnpm server-populate` will create all tables and populate them with some test data
5. `pnpm start` will spin up deenruv server along with admin panel

admin credentials: **superadmin/superadmin**

New admin panel: `localhost:3001/admin-ui/`

Legacy Admin panel: `localhost:3000/admin/`

`pnpm watch` might also be useful when developing **react-devkit** or **admin-dashboard** because it will cause new admin panel to reload on change.

## New Admin Panel

New admin panel has been created as a package, that can be installed and extended by the use of UI plugins. In `apps/panel` there is an example how to launch it, inject plugins and customize it with settings.

To use it `vite` application with `react` has to be initialized and `@deenruv/admin-dashboard` installed as a dependency. Next step would be importing `DeenruvAdminPanel` component from the package and placing it at the entry point of newly set up vite application.

### Ui Plugins

Admin panel has its own plugin system which extends it in many ways. All of the examples can be found here: `plugins/deenruv-examples-plugin/src/plugin-ui`

#### Injection

To add a plugin just pass a created instance of it to **plugins** prop in `<DeenruvAdminPanel plugins={[myUiPlugin]} settings={settings} />`

To import tailwind css into project, path to plugin will have to be provided into `tailwind.config.js`

```javascript
  content: [
    './node_modules/@deenruv/deenruv-examples-plugin/dist/**/*.js',
  ],
```

#### Creation

To create a plugin `@deenruv/react-ui-devkit` package has to be installed which exposes **createDeenruvUIPlugin** function.

This function creates a Ui plugin instance which then can be passed to `<DeenruvAdminPanel>` component.

Structure of plugin creation object is strictly defined by `DeenruvUIPlugin` type also exposed by `@deenruv/react-ui-devkit` package.

##### Pages prop

Provides an option to add whole page to admin panel system.

```javascript
type PluginPage = {
    path: string;
    element: React.ReactNode;
};
```

-   `path` property specifies the route name for a new page. For example if **couriers** is written this will be created `/admin-ui/extensions/couriers`
-   `element` property allows providing any react component

##### Components prop

//TODO needs more clarification about placement.

Provides an option to attach custom react component to a specific place inside admin panel.

-   `id` id of place, that component will be attached to
-   `component` react component

##### Widgets prop

//TODO

#### Translations prop

This prop allows the usage of `react-i18next` package inside plugin components/pages so the text will be correctly translated in admin panel.

-   `ns` key is i18n namespace for this plugin. We recommend using plugin name for it.
-   `data` key accepts json translations for different languages. It's a record with keys that are language names (e.g. `en`, `pl`) and their values should be an array of json files.

Usage is simple: install `react-i18next` package, and use `useTranslation` hook within the component with specified **namespace** with the use of provided json translation files.

#### Navigation Props

**Navigation groups** can be added with `navMenuGroups`. This prop accepts array of objects which consists of:

-   `id` group identifier
-   `labelId` see Translations section
-   `placement -> groupId` (optional)

Placement defines where new group will be shown according to specified groupId.
`react-ui-devkit` exposes `BASE_GROUP_ID` enum which consists of base group ids that can be used in `placement.groupId`.
New group will be rendered below specified group or at the bottom of the navigation if not specified.

**Navigation Links** can be added with `navMenuLinks`. This prop accepts array of objects which consists of:

-   `id` link identifier
-   `href` this accepts a path which is after **/admin-ui/** so defining `couriers` here will result in _/admin-ui/extensions/couriers_
-   `labelId` see Translations section
-   `groupId` id of a group that link will appear in
-   `icon` icon that will be shown next to text. Any icon can be used but `lucide-react` would be best fit to blend in with existing ones.
-   `placement` (optional) this accepts an object with **linkId** which should point to an existing link id and **where** prop, which can define where new link will be shown. It has 2 options: **above** and **under**.

#### Inputs prop

Provides an option to register a react component that then can be used as a custom input for custom field system

this component has to use `useCustomFields` hook available in `@deenruv/react-ui-devkit` package. This hook returns `value` and `setValue` which is crucial for setting up a working input. There's also a label and description which was provided during custom field creation.

Admin panel will automatically provide context for this input if it's properly set during custom field creation on the server.

**ID** provided in UI plugin `inputs` prop and server `config.customFields` must match.

```javascript
config.customFields.Product.push({
    name: 'custom-field-test-name',
    type: 'int',
    ui: {component: 'custom-input-id'}
    label: [{ languageCode: LanguageCode.en, value: 'custom input label' }],
});
```

### Custom fields

Custom fields that has been set up on the Deenruv server will be automatically placed on the correct view inside admin panel (e.g. `config.customFields.Product` will show on product detail page) with all CRUD operations. Input generated will be based on the **type** provided on the object passed to **config.customFields** inside server.

```javascript
config.customFields.Product.push({
    name: 'string-test',
    type: 'string',
    list: false,
    label: [{ languageCode: LanguageCode.en, value: 'string test label' }],
});
```

Admin panel custom fields system works with all primitive custom field types, locale types and relation inputs.

examples:

-   `localeString` will generate text input that can contain text for different languages.
-   `number` will generate number input.
-   `type:relation Asset` will render an input that lets user pick an Asset

This system also supports `list:true` which provides possibility to add multiple values for a custom field. This essentially makes a field an Array of specified type.

For working custom field examples refer to `plugins/deenruv-examples-plugin/src/plugin-server/plugin.ts` [link](https://gitlab.aexol.com/deenruv/deenruv/-/blob/main/plugins/deenruv-examples-plugin/src/plugin-server/plugin.ts).

## Release Process

If we want to merge our develop to main and publish packages we have to do the following:

_(For the sake of this example lets say our version is 1.1.15)_

1. `Start on develop`
2. `pnpm -r exec pnpm version patch command`
3. `pnpm run lint:fix command`
4. `Push it into develop`
5. `Go into gitlab and create merge request into main branch`
6. `Merge it after build succeed`
7. `Go into main branch and pull it`
8. `git tag v1.1.15`
9. `git push origin v1.1.15`

## Code generation for legacy admin panel

[graphql-code-generator](https://github.com/dotansimha/graphql-code-generator) is used to automatically create TypeScript interfaces for all GraphQL server operations and admin ui queries. These generated interfaces are used in both the admin ui and the server.

Running `npm run codegen` will generate the following files:

-   [`packages/common/src/generated-types.ts`](./packages/common/src/generated-types.ts): Types, Inputs & resolver args relating to the Admin API
-   [`packages/common/src/generated-shop-types.ts`](./packages/common/src/generated-shop-types.ts): Types, Inputs & resolver args relating to the Shop API
-   [`packages/admin-ui/src/lib/core/src/common/generated-types.ts`](./packages/admin-ui/src/lib/core/src/common/generated-types.ts): Types & operations relating to the admin-ui queries & mutations.
-   [`packages/admin-ui/src/lib/core/src/common/introspection-result.ts`](./packages/admin-ui/src/lib/core/src/common/introspection-result.ts): Used by the Apollo Client [`IntrospectionFragmentMatcher`](https://www.apollographql.com/docs/react/data/fragments/#fragments-on-unions-and-interfaces) to correctly handle fragments in the Admin UI.
-   Also generates types used in e2e tests in those packages which feature e2e tests (core, elasticsearch-plugin, asset-server-plugin etc).

## Testing

#### Server Unit Tests

The core and several other packages have unit tests which are can be run all together by running `npm run test` from the root directory, or individually by running it from the package directory.

Unit tests are co-located with the files which they test, and have the suffix `.spec.ts`.

If you're getting `Error: Bindings not found.`, please run `npm rebuild @swc/core`.

#### End-to-end Tests

Certain packages have e2e tests, which are located at `/packages/<name>/e2e/`. All e2e tests can be run by running `npm run e2e` from the root directory, or individually by running it from the package directory.

e2e tests use the `@deenruv/testing` package.

<!-- For details of how the setup works, see the [Testing docs](https://docs.deenruv.io/guides/developer-guide/testing/). -->

When **debugging e2e tests**, set an environment variable `E2E_DEBUG=true` which will increase the global Jest timeout and allow you to step through the e2e tests without the tests automatically failing due to timeout.

## License

MIT
