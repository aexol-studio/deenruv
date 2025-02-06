import {
    ConfigService,
    LanguageCode,
    ProductService,
    ProductVariantService,
    RequestContext,
    RequestContextService,
    TransactionalConnection,
    User,
    DefaultJobQueuePlugin,
    JobQueueService,
    OrderService,
    AssetService,
    DeenruvConfig,
} from '@deenruv/core';
import { INestApplicationContext } from '@nestjs/common';
import {
    createTestEnvironment,
    PostgresInitializer,
    registerInitializer,
    testConfig,
} from '@deenruv/testing';
import test, { after, before, describe } from 'node:test';
import { ReplicatePlugin } from '../index.js';
import { ReplicateService } from '../services/replicate.service.js';
import fs from 'fs';
import { CreateAssetInput } from '@deenruv/common/lib/generated-types.js';
import { ok } from 'assert';

registerInitializer('postgres', new PostgresInitializer());

describe('integration tests with replicate token', async () => {
    const deploymentName = 'test';
    const apiToken = 'test';

    ReplicatePlugin.init({ deploymentName: deploymentName, apiToken: apiToken });

    if (!apiToken || !deploymentName) throw new Error('impossible');
    const config: Required<DeenruvConfig> = {
        ...testConfig,
        dbConnectionOptions: {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'deenruv',
            password: 'deenruv',
            database: 'deenruv',
            schema: 'public',
            logging: ['error', 'warn', 'schema', 'query', 'info', 'log'],
        },
        plugins: [DefaultJobQueuePlugin.init({}), ReplicatePlugin.init({ deploymentName, apiToken })],
    };
    const { server, adminClient } = createTestEnvironment(config);
    let app: INestApplicationContext;
    let ctx: RequestContext;
    before(async () => {
        try {
            await server.init({
                initialData: {
                    defaultLanguage: LanguageCode.en,
                    defaultZone: 'Europe',
                    countries: [{ name: 'Poland', code: 'PL', zone: 'Europe' }],
                    taxRates: [],
                    shippingMethods: [],
                    paymentMethods: [],
                    collections: [],
                },
                customerCount: 1,
            });

            app = server.app;
            await app.get(JobQueueService).start();
            const { superadminCredentials } = app.get(ConfigService).authOptions;
            const superAdminUser = await app
                .get(TransactionalConnection)
                .getRepository(User)
                .findOneOrFail({ where: { identifier: superadminCredentials.identifier } });
            ctx = await app.get(RequestContextService).create({
                apiType: 'admin',
                user: superAdminUser,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    });

    after(async () => {
        await server.destroy();
    });

    test('test order export job - model training', async () => {
        const productVariantService = app.get(ProductVariantService);
        const replicateService = app.get(ReplicateService);
        const orderService = app.get(OrderService);
        const productService = app.get(ProductService);
        const assetService = app.get(AssetService);

        await productService.create(ctx, {
            translations: [
                {
                    languageCode: LanguageCode.en,
                    name: 'Test Product',
                    slug: 'test-product',
                    description: 'A product for testing purposes',
                },
            ],
            enabled: true,
        });

        const assetInput: CreateAssetInput = {
            file: {
                createReadStream: () => fs.createReadStream(__dirname + '/fixtures/test_product_asset.png'),
                filename: __dirname + '/fixtures/test_product_asset.png',
                mimetype: 'image/png',
            },
            tags: ['test', 'product'],
            customFields: {
                field1: 'value1',
                field2: 'value2',
            },
        };

        await assetService.create(ctx, assetInput);

        await productVariantService.create(ctx, [
            {
                productId: 1,
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'Test Product Variant',
                    },
                ],
                facetValueIds: [],
                sku: 'TEST-SKU',
                price: 1000,
                optionIds: [],
                featuredAssetId: 1,
                assetIds: [],
            },
        ]);

        const numLastOrder = 100;

        await replicateService.startModelTraining(ctx, {
            numLastOrder,
        });

        const ordersCount = (await orderService.findAll(ctx, {})).totalItems;

        ok(
            ordersCount >= numLastOrder,
            'Total number of orders should be equal or greater than numLastOrder',
        );
    });
});
