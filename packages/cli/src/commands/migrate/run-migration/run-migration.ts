import { log, spinner } from '@clack/prompts';
import { runMigrations } from '@deenruv/core';

import { CliCommand, CliCommandReturnVal } from '../../../shared/cli-command';
import { analyzeProject } from '../../../shared/shared-prompts';
import { DeenruvConfigRef } from '../../../shared/deenruv-config-ref';
import { loadDeenruvConfigFile } from '../load-deenruv-config-file';

const cancelledMessage = 'Run migrations cancelled';

export const runMigrationCommand = new CliCommand({
    id: 'run-migration',
    category: 'Other',
    description: 'Run any pending database migrations',
    run: () => runRunMigration(),
});

async function runRunMigration(): Promise<CliCommandReturnVal> {
    const { project } = await analyzeProject({ cancelledMessage });
    const deenruvConfig = new DeenruvConfigRef(project);
    log.info('Using DeenruvConfig from ' + deenruvConfig.getPathRelativeToProjectRoot());
    const config = await loadDeenruvConfigFile(deenruvConfig);

    const runSpinner = spinner();
    runSpinner.start('Running migrations...');
    const migrationsRan = await runMigrations(config);
    const report = migrationsRan.length
        ? `Successfully ran ${migrationsRan.length} migrations`
        : 'No pending migrations found';
    runSpinner.stop(report);
    return {
        project,
        modifiedSourceFiles: [],
    };
}
