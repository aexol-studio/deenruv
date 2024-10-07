import { log, spinner } from '@clack/prompts';
import { revertLastMigration } from '@deenruv/core';

import { CliCommand, CliCommandReturnVal } from '../../../shared/cli-command';
import { analyzeProject } from '../../../shared/shared-prompts';
import { DeenruvConfigRef } from '../../../shared/deenruv-config-ref';
import { loadDeenruvConfigFile } from '../load-deenruv-config-file';

const cancelledMessage = 'Revert migrations cancelled';

export const revertMigrationCommand = new CliCommand({
    id: 'run-migration',
    category: 'Other',
    description: 'Run any pending database migrations',
    run: () => runRevertMigration(),
});

async function runRevertMigration(): Promise<CliCommandReturnVal> {
    const { project } = await analyzeProject({ cancelledMessage });
    const deenruvConfig = new DeenruvConfigRef(project);
    log.info('Using DeenruvConfig from ' + deenruvConfig.getPathRelativeToProjectRoot());
    const config = await loadDeenruvConfigFile(deenruvConfig);

    const runSpinner = spinner();
    runSpinner.start('Reverting last migration...');
    await revertLastMigration(config);
    runSpinner.stop(`Successfully reverted last migration`);
    return {
        project,
        modifiedSourceFiles: [],
    };
}
