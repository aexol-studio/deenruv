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

export const giveObjectsDifference = (
  originalObject: any,
  maybeModifiedObject: any,
  excludedProperties?: string[],
  path: string = '',
): any => {
  const changes = {
    linesChanges: [] as any[],
    resChanges: [] as any[],
  };

  const handleDifference = (key: string, originalValue: any, maybeModifiedValue: any, path: string) => {
    const fullPath = path ? `${path}.${key}` : key;

    const parsedOriginalValue = tryParseJSON(originalValue);
    const parsedMaybeModifiedValue = tryParseJSON(maybeModifiedValue);

    if (parsedOriginalValue && parsedMaybeModifiedValue) {
      const jsonDiff = giveObjectsDifference(
        parsedOriginalValue,
        parsedMaybeModifiedValue,
        excludedProperties,
        fullPath,
      );
      if (fullPath.startsWith('lines')) {
        changes.linesChanges.push(...jsonDiff.linesChanges);
      } else {
        changes.resChanges.push(...jsonDiff.resChanges);
      }
    } else if (parsedOriginalValue || parsedMaybeModifiedValue) {
      if (fullPath.startsWith('lines')) {
        changes.linesChanges.push({
          path: fullPath,
          changed: 'primitive-json-change',
          removed: originalValue,
          added: maybeModifiedValue,
        });
      } else {
        changes.resChanges.push({
          path: fullPath,
          changed: 'primitive-json-change',
          removed: originalValue,
          added: maybeModifiedValue,
        });
      }
    } else if (typeof originalValue === 'object' && typeof maybeModifiedValue === 'object') {
      const objectDiff = giveObjectsDifference(originalValue, maybeModifiedValue, excludedProperties, fullPath);
      if (fullPath.startsWith('lines')) {
        changes.linesChanges.push(...objectDiff.linesChanges);
      } else {
        changes.resChanges.push(...objectDiff.resChanges);
      }
    } else if (originalValue !== maybeModifiedValue) {
      if (fullPath.startsWith('lines')) {
        changes.linesChanges.push({
          path: fullPath,
          changed: 'primitive-change',
          removed: originalValue,
          added: maybeModifiedValue,
        });
      } else {
        changes.resChanges.push({
          path: fullPath,
          changed: 'primitive-change',
          removed: originalValue,
          added: maybeModifiedValue,
        });
      }
    }
  };

  for (const key in originalObject) {
    if (key in maybeModifiedObject) {
      if (excludedProperties?.includes(key)) {
        continue;
      } else {
        handleDifference(key, originalObject[key], maybeModifiedObject[key], path);
      }
    } else if (!excludedProperties?.includes(key)) {
      if (path.startsWith('lines')) {
        changes.linesChanges.push({
          path: path ? `${path}.${key}` : key,
          changed: 'removed',
          value: originalObject[key],
        });
      } else {
        changes.resChanges.push({
          path: path ? `${path}.${key}` : key,
          changed: 'removed',
          value: originalObject[key],
        });
      }
    }
  }

  for (const key in maybeModifiedObject) {
    if (!(key in originalObject) && !excludedProperties?.includes(key)) {
      if (path.startsWith('lines')) {
        changes.linesChanges.push({
          path: path ? `${path}.${key}` : key,
          changed: 'added',
          value: maybeModifiedObject[key],
        });
      } else {
        changes.resChanges.push({
          path: path ? `${path}.${key}` : key,
          changed: 'added',
          value: maybeModifiedObject[key],
        });
      }
    }
  }

  return changes;
};

export const giveModificationInfo = (
  original: any,
  modified: any,
  excludedProperties?: string[],
  path: string = '',
) => {
  const changes = giveObjectsDifference(original, modified, excludedProperties, path);
  const lineChanges = (changes.linesChanges as any[]).reduce((acc, change) => {
    const [line, index, ...rest] = change.path.split('.');
    let isNew: Record<string, boolean> = {};
    if (!original[line][index]) {
      isNew = { isNew: true };
    }
    const lineId = (original[line][index] ?? modified[line][index]).id;

    if (!acc[lineId]) {
      acc[lineId] = {
        variantName: (original[line][index] ?? modified[line][index]).productVariant.name,
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
