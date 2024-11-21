import { PluginCommonModule, DeenruvPlugin } from '@deenruv/core';

const FacetCustomFields = [
    {
        name: 'usedForColors',
        type: 'boolean' as const,
        public: true,
    },
    {
        name: 'colorsCollection',
        type: 'boolean' as const,
        public: true,
    },
    {
        name: 'usedForProductCreations',
        type: 'boolean' as const,
        public: true,
    },
];

const FacetValueCustomFields = [
  {
      name: 'hexColor',
      type: 'string' as const,
      public: true,
  },
];

@DeenruvPlugin({
    compatibility: '^0.0.20',
    imports: [PluginCommonModule],
    configuration: config => {
        config.customFields.Facet.push(...FacetCustomFields);
        config.customFields.FacetValue.push(...FacetValueCustomFields);

        return config;
    },
})
export class FacetHarmonicaServerPlugin {}
