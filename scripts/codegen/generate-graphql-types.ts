import { generate } from '@graphql-codegen/cli';
import type { Types } from '@graphql-codegen/plugin-helpers';
import fs from 'fs';
import { buildClientSchema } from 'graphql';
import path from 'path';

import pkg from '../../packages/common/src/shared-constants.js';
const { ADMIN_API_PATH, SHOP_API_PATH } = pkg;

import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

import { downloadIntrospectionSchema } from './download-introspection-schema.js';

const CLIENT_QUERY_FILES = [
    'packages/admin-ui/src/lib/core/src/data/definitions/**/*.ts',
    'packages/admin-ui/src/lib/**/*.ts',
];

const specFileToIgnore = [
    'import.e2e-spec',
    'plugin.e2e-spec',
    'shop-definitions',
    'custom-fields.e2e-spec',
    'custom-field-relations.e2e-spec',
    'custom-field-permissions.e2e-spec',
    'order-item-price-calculation-strategy.e2e-spec',
    'list-query-builder.e2e-spec',
    'shop-order.e2e-spec',
    'database-transactions.e2e-spec',
    'custom-permissions.e2e-spec',
    'parallel-transactions.e2e-spec',
    'order-merge.e2e-spec',
    'entity-hydrator.e2e-spec',
    'relations-decorator.e2e-spec',
    'active-order-strategy.e2e-spec',
    'error-handler-strategy.e2e-spec',
    'order-multi-vendor.e2e-spec',
];
const E2E_ADMIN_QUERY_FILES = `packages/core/e2e/**/!(${specFileToIgnore.join('|')}).ts`;
const E2E_SHOP_QUERY_FILES = ['packages/core/e2e/graphql/shop-definitions.ts'];
const E2E_ELASTICSEARCH_PLUGIN_QUERY_FILES = 'plugins/elasticsearch-plugin/e2e/**/*.ts';
const E2E_ASSET_SERVER_PLUGIN_QUERY_FILES = 'plugins/asset-server-plugin/e2e/**/*.ts';
const ADMIN_SCHEMA_OUTPUT_FILE = 'schema-admin.json';
const SHOP_SCHEMA_OUTPUT_FILE = 'schema-shop.json';

/* eslint-disable no-console */

Promise.all([
    downloadIntrospectionSchema(ADMIN_API_PATH, ADMIN_SCHEMA_OUTPUT_FILE),
    downloadIntrospectionSchema(SHOP_API_PATH, SHOP_SCHEMA_OUTPUT_FILE),
])
    .then(([adminSchemaSuccess, shopSchemaSuccess]) => {
        if (!adminSchemaSuccess || !shopSchemaSuccess) {
            console.log('Attempting to generate types from existing schema json files...');
        }

        const adminSchemaJson = JSON.parse(fs.readFileSync(ADMIN_SCHEMA_OUTPUT_FILE, 'utf-8'));
        const shopSchemaJson = JSON.parse(fs.readFileSync(SHOP_SCHEMA_OUTPUT_FILE, 'utf-8'));
        buildClientSchema(adminSchemaJson.data);
        buildClientSchema(shopSchemaJson.data);

        const config = {
            namingConvention: {
                enumValues: 'keep',
            },
            strict: true,
            scalars: {
                Money: 'number',
            },
        };
        const e2eConfig = {
            ...config,
            skipTypename: true,
        };
        const disableEsLintPlugin = { add: { content: '/* eslint-disable */' } };
        const graphQlErrorsPlugin = path.join(__dirname, './plugins/graphql-errors-plugin.ts');
        const commonPlugins = [disableEsLintPlugin, 'typescript'];
        const clientPlugins = [...commonPlugins, 'typescript-operations', 'typed-document-node'];

        const codegenConfig: Types.Config = {
            overwrite: true,
            pluginLoader: async (mod: string) => {
                try {
                    return await import(mod);
                } catch (e) {
                    // This is neccessary due to how codegen identifies "not found" errors
                    // for modules. In ESM environments this might be undefined.
                    (e as unknown as Record<string, unknown>).code = 'MODULE_NOT_FOUND';
                    throw e
                };
            },
            generates: {
                ['packages/core/src/common/error/generated-graphql-admin-errors.ts']: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    plugins: [disableEsLintPlugin, graphQlErrorsPlugin],
                },
                ['packages/core/src/common/error/generated-graphql-shop-errors.ts']: {
                    schema: [SHOP_SCHEMA_OUTPUT_FILE],
                    plugins: [disableEsLintPlugin, graphQlErrorsPlugin],
                },
                ['packages/core/e2e/graphql/generated-e2e-admin-types.ts']: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    documents: E2E_ADMIN_QUERY_FILES,
                    plugins: clientPlugins,
                    config: e2eConfig,
                },
                ['packages/core/e2e/graphql/generated-e2e-shop-types.ts']: {
                    schema: [SHOP_SCHEMA_OUTPUT_FILE],
                    documents: E2E_SHOP_QUERY_FILES,
                    plugins: clientPlugins,
                    config: e2eConfig,
                },
                ['plugins/elasticsearch-plugin/e2e/graphql/generated-e2e-elasticsearch-plugin-types.ts']: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    documents: E2E_ELASTICSEARCH_PLUGIN_QUERY_FILES,
                    plugins: clientPlugins,
                    config: e2eConfig,
                }, 
                ['plugins/asset-server-plugin/e2e/graphql/generated-e2e-asset-server-plugin-types.ts']: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    documents: E2E_ASSET_SERVER_PLUGIN_QUERY_FILES,
                    plugins: clientPlugins,
                    config: e2eConfig,
                },
                ['packages/admin-ui/src/lib/core/src/common/generated-types.ts']:
                    {
                        schema: [ADMIN_SCHEMA_OUTPUT_FILE, path.join(__dirname, 'client-schema.ts')],
                        documents: CLIENT_QUERY_FILES,
                        plugins: clientPlugins,
                        config: {
                            ...config,
                            skipTypeNameForRoot: true,
                        },
                    },
                ['packages/admin-ui/src/lib/core/src/common/introspection-result.ts']: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE, path.join(__dirname, 'client-schema.ts')],
                    documents: CLIENT_QUERY_FILES,
                    plugins: [disableEsLintPlugin, 'fragment-matcher'],
                    config: { ...config, apolloClientVersion: 3 },
                },
                ['packages/common/src/generated-types.ts']: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    plugins: commonPlugins,
                    config: {
                        ...config,
                        scalars: {
                            ...(config.scalars ?? {}),
                            ID: 'string | number',
                        },
                        maybeValue: 'T',
                    },
                },
                ['packages/common/src/generated-shop-types.ts']: {
                    schema: [SHOP_SCHEMA_OUTPUT_FILE],
                    plugins: commonPlugins,
                    config: {
                        ...config,
                        scalars: {
                            ...(config.scalars ?? {}),
                            ID: 'string | number',
                        },
                        maybeValue: 'T',
                    },
                },
                ['plugins/payments-plugin/e2e/graphql/generated-admin-types.ts']:
                    {
                        schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                        documents: 'plugins/payments-plugin/e2e/graphql/admin-queries.ts',
                        plugins: clientPlugins,
                        config: e2eConfig,
                    },
                ['plugins/payments-plugin/e2e/graphql/generated-shop-types.ts']:
                    {
                        schema: [SHOP_SCHEMA_OUTPUT_FILE],
                        documents: 'plugins/payments-plugin/e2e/graphql/shop-queries.ts',
                        plugins: clientPlugins,
                        config: e2eConfig,
                    },
                ['plugins/payments-plugin/src/mollie/graphql/generated-shop-types.ts']: {
                    schema: [
                        SHOP_SCHEMA_OUTPUT_FILE,
                        'plugins/payments-plugin/src/mollie/api-extensions.ts',
                    ],
                    plugins: clientPlugins,
                    config,
                },
            },
        };
        process.chdir(path.resolve(__dirname, '../..'))
        return generate(codegenConfig);
    })
    .then(
        () => {
            process.exit(0);
        },
        err => {
            console.error(err);
            process.exit(1);
        },
    );
