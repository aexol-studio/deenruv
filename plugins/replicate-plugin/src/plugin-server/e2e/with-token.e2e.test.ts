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
    JobQueueService,
    Ctx,
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

registerInitializer('postgres', new PostgresInitializer());

describe(
    'integration tests with replicate token',
    {
        skip: !process.env.REPLICATE_API_TOKEN || !process.env.REPLICATE_DEPLOYMENT_NAME,
    },
    async () => {
        console.log();
        const deploymentName = process.env.REPLICATE_DEPLOYMENT_NAME;
        const url = process.env.REPLICATE_URL;
        const login = process.env.REPLICATE_LOGIN;
        const password = process.env.REPLICATE_PASSWORD;
        const apiToken = process.env.REPLICATE_API_TOKEN;
        if (!apiToken || !deploymentName || !url || !login || !password) throw new Error('impossible');
        const config = {
            ...testConfig,
            dbConnectionOptions: {
                type: 'postgres',
            } as { type: 'postgres' },
            plugins: [
                DefaultJobQueuePlugin.init({}),
                ReplicatePlugin.init({ deploymentName, url, login, password, apiToken }),
            ],
        };
        const { server, adminClient } = createTestEnvironment(config);
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
            await app.get(JobQueueService).start();
        });

        after(async () => {
            await server.destroy();
        });

        // test('test model training integration', async () => {
        //   // const ctx: RequestContext = new RequestContext();
        //   await doesNotReject(
        //         app.get(ReplicateService).startModelTraining(Ctx, 10000, '2021-01-01', '2021-01-02'),
        //     );
        // });

        test('test model training integration controller api', async () => {
            await adminClient.asSuperAdmin();
            // const resp = await adminClient.fetch(`${await app.getUrl()}/replicate/training/start`);
            // console.log(resp.status);
            // console.log(await resp.text())
            // await doesNotReject(app.get(ReplicateService).startModelTraining());
        });
    },
);
