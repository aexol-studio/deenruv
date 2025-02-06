import { LanguageCode, DefaultJobQueuePlugin, JobQueueService, Ctx } from '@deenruv/core';
import { INestApplicationContext } from '@nestjs/common';
import {
    createTestEnvironment,
    PostgresInitializer,
    registerInitializer,
    testConfig,
} from '@deenruv/testing';
import test, { after, before, describe } from 'node:test';
import { ReplicatePlugin } from '../index.js';

registerInitializer('postgres', new PostgresInitializer());

describe('integration tests with replicate token', async () => {
    const deploymentName = 'test';
    const apiToken = 'test';

    ReplicatePlugin.init({ deploymentName: deploymentName, apiToken: apiToken });
    if (!apiToken || !deploymentName) throw new Error('impossible');
    const config = {
        ...testConfig,
        dbConnectionOptions: {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'deenruv',
            password: 'deenruv',
            database: 'deenruv',
            schema: 'public',
        } as { type: 'postgres' },
        plugins: [DefaultJobQueuePlugin.init({}), ReplicatePlugin.init({ deploymentName, apiToken })],
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

    test('test model training integration controller api', async () => {
        await adminClient.asSuperAdmin();
    });
});
