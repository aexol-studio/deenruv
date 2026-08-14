import { describe, expect, it } from 'vitest';

import { buildTokenizedSearchFilter, matchesTokenizedSearch, normalizeSearchTokens } from './tokenized-search-filter';

describe('tokenized search utilities', () => {
    it('normalizes whitespace and omits empty tokens', () => {
        expect(normalizeSearchTokens('  alpha\t beta \n gamma  ')).toEqual(['alpha', 'beta', 'gamma']);
        expect(normalizeSearchTokens('   ')).toEqual([]);
    });

    it('builds a single-token OR across the declared fields inside an AND', () => {
        expect(buildTokenizedSearchFilter('alice', ['firstName', 'emailAddress'])).toEqual({
            _and: [
                {
                    _or: [{ firstName: { contains: 'alice' } }, { emailAddress: { contains: 'alice' } }],
                },
            ],
        });
    });

    it('ANDs normalized tokens while ORing each token across fields', () => {
        expect(buildTokenizedSearchFilter(' alice   example ', ['name', 'email'])).toEqual({
            _and: [
                {
                    _or: [{ name: { contains: 'alice' } }, { email: { contains: 'alice' } }],
                },
                {
                    _or: [{ name: { contains: 'example' } }, { email: { contains: 'example' } }],
                },
            ],
        });
    });

    it('retains a base filter as a separate AND condition without mutating it', () => {
        const baseFilter = { enabled: { eq: true } };
        const snapshot = structuredClone(baseFilter);

        expect(buildTokenizedSearchFilter('alice', ['name'], baseFilter)).toEqual({
            _and: [baseFilter, { _or: [{ name: { contains: 'alice' } }] }],
        });
        expect(baseFilter).toEqual(snapshot);
    });

    it('returns the base filter unchanged for an empty term', () => {
        const baseFilter = { enabled: { eq: true } };
        expect(buildTokenizedSearchFilter('  ', ['name'], baseFilter)).toBe(baseFilter);
        expect(buildTokenizedSearchFilter(null, ['name'])).toEqual({});
    });

    it('matches every token against any declared client field', () => {
        const member = { name: 'North America', code: 'NA-01', ignored: 'secret' };
        expect(matchesTokenizedSearch(member, 'north 01', ['name', 'code'])).toBe(true);
        expect(matchesTokenizedSearch(member, 'north secret', ['name', 'code'])).toBe(false);
        expect(matchesTokenizedSearch(member, '   ', ['name', 'code'])).toBe(true);
    });
});
