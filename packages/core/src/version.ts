/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @description
 * A constant which holds the current version of the Deenruv core. You can use
 * this when your code needs to know the version of Deenruv which is running.
 *
 * @example
 * ```ts
 * import { DEENRUV_VERSION } from '\@deenruv/core';
 *
 * console.log('Deenruv version:', DEENRUV_VERSION);
 * ```
 *
 * @docsCategory common
 * @since 2.0.0
 */
export const DEENRUV_VERSION: string = require('../package.json').version;
