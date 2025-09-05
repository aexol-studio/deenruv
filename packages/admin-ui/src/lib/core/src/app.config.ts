import { AdminUiConfig } from '@deenruv/common/shared-types';

let deenruvUiConfig: AdminUiConfig | undefined;

export async function loadAppConfig(): Promise<void> {
    deenruvUiConfig = await fetch('./deenruv-ui-config.json').then(res => res.json());
}

export function getAppConfig(): AdminUiConfig {
    if (!deenruvUiConfig) {
        throw new Error(`deenruv ui config not loaded`);
    }
    return deenruvUiConfig;
}
