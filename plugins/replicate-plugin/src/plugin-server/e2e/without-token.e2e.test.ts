import {
    ChannelService,
    ConfigService,
    CurrencyCode,
    LanguageCode,
    ProductService,
    ProductVariantPrice,
    ProductVariantService,
    RequestContext,
    RequestContextService,
    TransactionalConnection,
    User,
    DefaultJobQueuePlugin,
} from '@deenruv/core';
import { INestApplicationContext } from '@nestjs/common';
import {
    createTestEnvironment,
    PostgresInitializer,
    registerInitializer,
    testConfig,
} from '@deenruv/testing';
import test, { after, before, describe, it, beforeEach } from 'node:test';
import { ReplicatePlugin } from '../index.js';
import { REPLICATE_PLUGIN_OPTIONS } from '../constants.js';
import { equal } from 'assert';

registerInitializer('postgres', new PostgresInitializer());

describe('integration tests without replicate token', async () => {
    const deploymentName = process.env.REPLICATE_DEPLOYMENT_NAME;
    const url = process.env.REPLICATE_URL;
    const login = process.env.REPLICATE_LOGIN;
    const password = process.env.REPLICATE_PASSWORD;
    const apiToken = 'test';
    if (!apiToken || !deploymentName || !url || !login || !password) throw new Error('impossible');

    const config = {
        ...testConfig,
        dbConnectionOptions: {
            type: 'postgres',
        } as { type: 'postgres' },
        plugins: [
            DefaultJobQueuePlugin.init({}),
            ReplicatePlugin.init({
                deploymentName,
                url,
                login,
                password,
                apiToken,
            }),
        ],
    };
    const { server } = createTestEnvironment(config);
    let app: INestApplicationContext;
    before(async () => {
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
        });
        app = server.app;
    });

    after(async () => {
        await server.destroy();
    });
    test('plugin loads api key', () => {
        equal(app.get(REPLICATE_PLUGIN_OPTIONS).apiToken, 'test');
    });
});
