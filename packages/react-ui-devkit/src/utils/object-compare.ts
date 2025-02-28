/* eslint-disable @typescript-eslint/no-explicit-any */
const tryParseJSON = (value: unknown) => {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }
    return null;
};

export const giveObjectsDiffrence = (
    orginalObject: any,
    mabeyModifiedObject: any,
    excludedProperties?: string[],
    path: string = '',
): any => {
    const changes = {
        linesChanges: [] as any[],
        resChanges: [] as any[],
    };

    const handleDifference = (key: string, orginalValue: any, mabeyModifiedValue: any, path: string) => {
        const fullPath = path ? `${path}.${key}` : key;

        const parsedOrginalValue = tryParseJSON(orginalValue);
        const parsedMabeyModifiedValue = tryParseJSON(mabeyModifiedValue);

        if (parsedOrginalValue && parsedMabeyModifiedValue) {
            const jsonDiff = giveObjectsDiffrence(
                parsedOrginalValue,
                parsedMabeyModifiedValue,
                excludedProperties,
                fullPath,
            );
            if (fullPath.startsWith('lines')) {
                changes.linesChanges.push(...jsonDiff.linesChanges);
            } else {
                changes.resChanges.push(...jsonDiff.resChanges);
            }
        } else if (parsedOrginalValue || parsedMabeyModifiedValue) {
            if (fullPath.startsWith('lines')) {
                changes.linesChanges.push({
                    path: fullPath,
                    changed: 'primitive-json-change',
                    removed: orginalValue,
                    added: mabeyModifiedValue,
                });
            } else {
                changes.resChanges.push({
                    path: fullPath,
                    changed: 'primitive-json-change',
                    removed: orginalValue,
                    added: mabeyModifiedValue,
                });
            }
        } else if (typeof orginalValue === 'object' && typeof mabeyModifiedValue === 'object') {
            const objectDiff = giveObjectsDiffrence(
                orginalValue,
                mabeyModifiedValue,
                excludedProperties,
                fullPath,
            );
            if (fullPath.startsWith('lines')) {
                changes.linesChanges.push(...objectDiff.linesChanges);
            } else {
                changes.resChanges.push(...objectDiff.resChanges);
            }
        } else if (orginalValue !== mabeyModifiedValue) {
            if (fullPath.startsWith('lines')) {
                changes.linesChanges.push({
                    path: fullPath,
                    changed: 'primitive-change',
                    removed: orginalValue,
                    added: mabeyModifiedValue,
                });
            } else {
                changes.resChanges.push({
                    path: fullPath,
                    changed: 'primitive-change',
                    removed: orginalValue,
                    added: mabeyModifiedValue,
                });
            }
        }
    };

    for (const key in orginalObject) {
        if (key in mabeyModifiedObject) {
            if (excludedProperties?.includes(key)) {
                continue;
            } else {
                handleDifference(key, orginalObject[key], mabeyModifiedObject[key], path);
            }
        } else if (!excludedProperties?.includes(key)) {
            if (path.startsWith('lines')) {
                changes.linesChanges.push({
                    path: path ? `${path}.${key}` : key,
                    changed: 'removed',
                    value: orginalObject[key],
                });
            } else {
                changes.resChanges.push({
                    path: path ? `${path}.${key}` : key,
                    changed: 'removed',
                    value: orginalObject[key],
                });
            }
        }
    }

    for (const key in mabeyModifiedObject) {
        if (!(key in orginalObject) && !excludedProperties?.includes(key)) {
            if (path.startsWith('lines')) {
                changes.linesChanges.push({
                    path: path ? `${path}.${key}` : key,
                    changed: 'added',
                    value: mabeyModifiedObject[key],
                });
            } else {
                changes.resChanges.push({
                    path: path ? `${path}.${key}` : key,
                    changed: 'added',
                    value: mabeyModifiedObject[key],
                });
            }
        }
    }

    return changes;
};

export const giveModificationInfo = (
    orginalObject: any,
    mabeyModifiedObject: any,
    excludedProperties?: string[],
    path: string = '',
) => {
    const changes = giveObjectsDiffrence(orginalObject, mabeyModifiedObject, excludedProperties, path);
    const lineChanges = (changes.linesChanges as any[]).reduce((acc, change) => {
        const [line, index, ...rest] = change.path.split('.');
        let isNew: Record<string, boolean> = {};
        if (!orginalObject[line][index]) {
            isNew = { isNew: true };
        }
        const lineId = (orginalObject[line][index] ?? mabeyModifiedObject[line][index]).id;

        if (!acc[lineId]) {
            acc[lineId] = {
                variantName: (orginalObject[line][index] ?? mabeyModifiedObject[line][index]).productVariant
                    .name,
                changes: [{ ...change, path: rest.join('.') }],
                ...isNew,
            };
            return acc;
        } else {
            acc[lineId].changes.push({ ...change, path: rest.join('.') });
        }
        return acc;
    }, {} as any);

    changes.linesChanges = Object.entries(lineChanges).map(([key, value]) => ({
        lineID: key,
        ...(value as Record<string, unknown>),
    }));
    return changes;
};
