import { Node, ObjectLiteralExpression, StructureKind, SyntaxKind } from 'ts-morph';

import { AdminUiAppConfigName } from '../../../../../constants';
import { DeenruvConfigRef } from '../../../../../shared/deenruv-config-ref';
import { addImportsToFile } from '../../../../../utilities/ast-utils';

export function updateAdminUiPluginInit(
    deenruvConfig: DeenruvConfigRef,
    options: { pluginClassName: string; pluginPath: string },
): boolean {
    const adminUiPlugin = deenruvConfig
        .getPluginsArray()
        ?.getChildrenOfKind(SyntaxKind.CallExpression)
        .find(c => {
            return c.getExpression().getText() === 'AdminUiPlugin.init';
        });
    if (adminUiPlugin) {
        const initObject = adminUiPlugin
            .getArguments()
            .find((a): a is ObjectLiteralExpression => a.isKind(SyntaxKind.ObjectLiteralExpression));
        const appProperty = initObject?.getProperty('app');
        if (!appProperty) {
            initObject
                ?.addProperty({
                    name: 'app',
                    kind: StructureKind.PropertyAssignment,
                    initializer: `compileUiExtensions({
                        outputPath: path.join(__dirname, '../admin-ui'),
                        extensions: [
                            ${options.pluginClassName}.ui,
                        ],
                        devMode: true,
                    }),`,
                })
                .formatText();
        } else {
            const computeFnCall = appProperty.getFirstChildByKind(SyntaxKind.CallExpression);
            if (computeFnCall?.getType().getText().includes(AdminUiAppConfigName)) {
                const arg = computeFnCall.getArguments()[0];
                if (arg && Node.isObjectLiteralExpression(arg)) {
                    const extensionsProp = arg.getProperty('extensions');
                    if (extensionsProp) {
                        extensionsProp
                            .getFirstChildByKind(SyntaxKind.ArrayLiteralExpression)
                            ?.addElement(`${options.pluginClassName}.ui`)
                            .formatText();
                    }
                }
            }
        }

        addImportsToFile(deenruvConfig.sourceFile, {
            moduleSpecifier: '@deenruv/ui-devkit/compiler',
            namedImports: ['compileUiExtensions'],
            order: 0,
        });

        addImportsToFile(deenruvConfig.sourceFile, {
            moduleSpecifier: 'path',
            namespaceImport: 'path',
            order: 0,
        });

        addImportsToFile(deenruvConfig.sourceFile, {
            moduleSpecifier: options.pluginPath,
            namedImports: [options.pluginClassName],
        });
        return true;
    }
    return false;
}
