import { PluginCommonModule, DeenruvPlugin } from '@deenruv/core';
import { GraphQLScalarType, Kind } from 'graphql';
import gql from 'graphql-tag';

const FooScalar = new GraphQLScalarType({
    name: 'FooScalar',
    description: 'A test scalar',
    serialize(value) {
        return value.toString() + '-foo';
    },
    parseValue(value) {
        return value.toString().split('-foo')[0];
    },
});

@DeenruvPlugin({
    imports: [PluginCommonModule],
    shopApiExtensions: {
        schema: gql`
            scalar FooScalar
        `,
        scalars: { FooScalar },
    },
})
export class CustomScalarsPlugin {}
