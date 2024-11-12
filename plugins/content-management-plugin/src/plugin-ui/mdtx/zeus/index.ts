/* eslint-disable */

import { AllTypesProps, ReturnTypes, Ops } from './const';
export const HOST = "http://localhost:4200/api/graphql"


export const HEADERS = {}
export const apiSubscription = (options: chainOptions) => (query: string) => {
  try {
    const queryString = options[0] + '?query=' + encodeURIComponent(query);
    const wsString = queryString.replace('http', 'ws');
    const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
    const webSocketOptions = options[1]?.websocket || [host];
    const ws = new WebSocket(...webSocketOptions);
    return {
      ws,
      on: (e: (args: any) => void) => {
        ws.onmessage = (event: any) => {
          if (event.data) {
            const parsed = JSON.parse(event.data);
            const data = parsed.data;
            return e(data);
          }
        };
      },
      off: (e: (args: any) => void) => {
        ws.onclose = e;
      },
      error: (e: (args: any) => void) => {
        ws.onerror = e;
      },
      open: (e: () => void) => {
        ws.onopen = e;
      },
    };
  } catch {
    throw new Error('No websockets implemented');
  }
};
const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response
        .text()
        .then((text) => {
          try {
            reject(JSON.parse(text));
          } catch (err) {
            reject(text);
          }
        })
        .catch(reject);
    });
  }
  return response.json() as Promise<GraphQLResponse>;
};

export const apiFetch =
  (options: fetchOptions) =>
  (query: string, variables: Record<string, unknown> = {}) => {
    const fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
        .then(handleFetchResponse)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          return response.data;
        });
    }
    return fetch(`${options[0]}`, {
      body: JSON.stringify({ query, variables }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    })
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };

export const InternalsBuildQuery = ({
  ops,
  props,
  returns,
  options,
  scalars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  options?: OperationOptions;
  scalars?: ScalarDefinition;
}) => {
  const ibb = (
    k: string,
    o: InputValueType | VType,
    p = '',
    root = true,
    vars: Array<{ name: string; graphQLType: string }> = [],
  ): string => {
    const keyForPath = purifyGraphQLKey(k);
    const newPath = [p, keyForPath].join(SEPARATOR);
    if (!o) {
      return '';
    }
    if (typeof o === 'boolean' || typeof o === 'number') {
      return k;
    }
    if (typeof o === 'string') {
      return `${k} ${o}`;
    }
    if (Array.isArray(o)) {
      const args = InternalArgsBuilt({
        props,
        returns,
        ops,
        scalars,
        vars,
      })(o[0], newPath);
      return `${ibb(args ? `${k}(${args})` : k, o[1], p, false, vars)}`;
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(`${alias}:${operationName}`, operation, p, false, vars);
        })
        .join('\n');
    }
    const hasOperationName = root && options?.operationName ? ' ' + options.operationName : '';
    const keyForDirectives = o.__directives ?? '';
    const query = `{${Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map((e) => ibb(...e, [p, `field<>${keyForPath}`].join(SEPARATOR), false, vars))
      .join('\n')}}`;
    if (!root) {
      return `${k} ${keyForDirectives}${hasOperationName} ${query}`;
    }
    const varsString = vars.map((v) => `${v.name}: ${v.graphQLType}`).join(', ');
    return `${k} ${keyForDirectives}${hasOperationName}${varsString ? `(${varsString})` : ''} ${query}`;
  };
  return ibb;
};

type UnionOverrideKeys<T, U> = Omit<T, keyof U> & U;

export const Thunder =
  <SCLR extends ScalarDefinition>(fn: FetchFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) =>
  <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>,
  ) =>
  <Z extends ValueTypes[R]>(
    o: Z & {
      [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never;
    },
    ops?: OperationOptions & { variables?: Record<string, unknown> },
  ) => {
    const options = {
      ...thunderGraphQLOptions,
      ...graphqlOptions,
    };
    return fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
      }),
      ops?.variables,
    ).then((data) => {
      if (options?.scalars) {
        return decodeScalarsInResponse({
          response: data,
          initialOp: operation,
          initialZeusQuery: o as VType,
          returns: ReturnTypes,
          scalars: options.scalars,
          ops: Ops,
        });
      }
      return data;
    }) as Promise<InputType<GraphQLTypes[R], Z, UnionOverrideKeys<SCLR, OVERRIDESCLR>>>;
  };

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));

export const SubscriptionThunder =
  <SCLR extends ScalarDefinition>(fn: SubscriptionFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) =>
  <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>,
  ) =>
  <Z extends ValueTypes[R]>(
    o: Z & {
      [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never;
    },
    ops?: OperationOptions & { variables?: ExtractVariables<Z> },
  ) => {
    const options = {
      ...thunderGraphQLOptions,
      ...graphqlOptions,
    };
    type CombinedSCLR = UnionOverrideKeys<SCLR, OVERRIDESCLR>;
    const returnedFunction = fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
      }),
    ) as SubscriptionToGraphQL<Z, GraphQLTypes[R], CombinedSCLR>;
    if (returnedFunction?.on && options?.scalars) {
      const wrapped = returnedFunction.on;
      returnedFunction.on = (fnToCall: (args: InputType<GraphQLTypes[R], Z, CombinedSCLR>) => void) =>
        wrapped((data: InputType<GraphQLTypes[R], Z, CombinedSCLR>) => {
          if (options?.scalars) {
            return fnToCall(
              decodeScalarsInResponse({
                response: data,
                initialOp: operation,
                initialZeusQuery: o as VType,
                returns: ReturnTypes,
                scalars: options.scalars,
                ops: Ops,
              }),
            );
          }
          return fnToCall(data);
        });
    }
    return returnedFunction;
  };

export const Subscription = (...options: chainOptions) => SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends keyof typeof Ops,
  R extends keyof ValueTypes = GenericOperation<O>,
>(
  operation: O,
  o: Z,
  ops?: {
    operationOptions?: OperationOptions;
    scalars?: ScalarDefinition;
  },
) =>
  InternalsBuildQuery({
    props: AllTypesProps,
    returns: ReturnTypes,
    ops: Ops,
    options: ops?.operationOptions,
    scalars: ops?.scalars,
  })(operation, o as VType);

export const ZeusSelect = <T>() => ((t: unknown) => t) as SelectionFunction<T>;

export const Selector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();

export const TypeFromSelector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();
export const Gql = Chain(HOST, {
  headers: {
    'Content-Type': 'application/json',
    ...HEADERS,
  },
});

export const ZeusScalars = ZeusSelect<ScalarCoders>();

export const decodeScalarsInResponse = <O extends Operations>({
  response,
  scalars,
  returns,
  ops,
  initialZeusQuery,
  initialOp,
}: {
  ops: O;
  response: any;
  returns: ReturnTypesType;
  scalars?: Record<string, ScalarResolver | undefined>;
  initialOp: keyof O;
  initialZeusQuery: InputValueType | VType;
}) => {
  if (!scalars) {
    return response;
  }
  const builder = PrepareScalarPaths({
    ops,
    returns,
  });

  const scalarPaths = builder(initialOp as string, ops[initialOp], initialZeusQuery);
  if (scalarPaths) {
    const r = traverseResponse({ scalarPaths, resolvers: scalars })(initialOp as string, response, [ops[initialOp]]);
    return r;
  }
  return response;
};

export const traverseResponse = ({
  resolvers,
  scalarPaths,
}: {
  scalarPaths: { [x: string]: `scalar.${string}` };
  resolvers: {
    [x: string]: ScalarResolver | undefined;
  };
}) => {
  const ibb = (k: string, o: InputValueType | VType, p: string[] = []): unknown => {
    if (Array.isArray(o)) {
      return o.map((eachO) => ibb(k, eachO, p));
    }
    if (o == null) {
      return o;
    }
    const scalarPathString = p.join(SEPARATOR);
    const currentScalarString = scalarPaths[scalarPathString];
    if (currentScalarString) {
      const currentDecoder = resolvers[currentScalarString.split('.')[1]]?.decode;
      if (currentDecoder) {
        return currentDecoder(o);
      }
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string' || !o) {
      return o;
    }
    const entries = Object.entries(o).map(([k, v]) => [k, ibb(k, v, [...p, purifyGraphQLKey(k)])] as const);
    const objectFromEntries = entries.reduce<Record<string, unknown>>((a, [k, v]) => {
      a[k] = v;
      return a;
    }, {});
    return objectFromEntries;
  };
  return ibb;
};

export type AllTypesPropsType = {
  [x: string]:
    | undefined
    | `scalar.${string}`
    | 'enum'
    | {
        [x: string]:
          | undefined
          | string
          | {
              [x: string]: string | undefined;
            };
      };
};

export type ReturnTypesType = {
  [x: string]:
    | {
        [x: string]: string | undefined;
      }
    | `scalar.${string}`
    | undefined;
};
export type InputValueType = {
  [x: string]: undefined | boolean | string | number | [any, undefined | boolean | InputValueType] | InputValueType;
};
export type VType =
  | undefined
  | boolean
  | string
  | number
  | [any, undefined | boolean | InputValueType]
  | InputValueType;

export type PlainType = boolean | number | string | null | undefined;
export type ZeusArgsType =
  | PlainType
  | {
      [x: string]: ZeusArgsType;
    }
  | Array<ZeusArgsType>;

export type Operations = Record<string, string>;

export type VariableDefinition = {
  [x: string]: unknown;
};

export const SEPARATOR = '|';

export type fetchOptions = Parameters<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (...args: infer R) => WebSocket ? R : never;
export type chainOptions = [fetchOptions[0], fetchOptions[1] & { websocket?: websocketOptions }] | [fetchOptions[0]];
export type FetchFunction = (query: string, variables?: Record<string, unknown>) => Promise<any>;
export type SubscriptionFunction = (query: string) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;

export type OperationOptions = {
  operationName?: string;
};

export type ScalarCoder = Record<string, (s: unknown) => string>;

export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
export class GraphQLError extends Error {
  constructor(public response: GraphQLResponse) {
    super('');
    console.error(response);
  }
  toString() {
    return 'GraphQL Response Error';
  }
}
export type GenericOperation<O> = O extends keyof typeof Ops ? typeof Ops[O] : never;
export type ThunderGraphQLOptions<SCLR extends ScalarDefinition> = {
  scalars?: SCLR | ScalarCoders;
};

const ExtractScalar = (mappedParts: string[], returns: ReturnTypesType): `scalar.${string}` | undefined => {
  if (mappedParts.length === 0) {
    return;
  }
  const oKey = mappedParts[0];
  const returnP1 = returns[oKey];
  if (typeof returnP1 === 'object') {
    const returnP2 = returnP1[mappedParts[1]];
    if (returnP2) {
      return ExtractScalar([returnP2, ...mappedParts.slice(2)], returns);
    }
    return undefined;
  }
  return returnP1 as `scalar.${string}` | undefined;
};

export const PrepareScalarPaths = ({ ops, returns }: { returns: ReturnTypesType; ops: Operations }) => {
  const ibb = (
    k: string,
    originalKey: string,
    o: InputValueType | VType,
    p: string[] = [],
    pOriginals: string[] = [],
    root = true,
  ): { [x: string]: `scalar.${string}` } | undefined => {
    if (!o) {
      return;
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string') {
      const extractionArray = [...pOriginals, originalKey];
      const isScalar = ExtractScalar(extractionArray, returns);
      if (isScalar?.startsWith('scalar')) {
        const partOfTree = {
          [[...p, k].join(SEPARATOR)]: isScalar,
        };
        return partOfTree;
      }
      return {};
    }
    if (Array.isArray(o)) {
      return ibb(k, k, o[1], p, pOriginals, false);
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(alias, operationName, operation, p, pOriginals, false);
        })
        .reduce((a, b) => ({
          ...a,
          ...b,
        }));
    }
    const keyName = root ? ops[k] : k;
    return Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map(([k, v]) => {
        // Inline fragments shouldn't be added to the path as they aren't a field
        const isInlineFragment = originalKey.match(/^...\s*on/) != null;
        return ibb(
          k,
          k,
          v,
          isInlineFragment ? p : [...p, purifyGraphQLKey(keyName || k)],
          isInlineFragment ? pOriginals : [...pOriginals, purifyGraphQLKey(originalKey)],
          false,
        );
      })
      .reduce((a, b) => ({
        ...a,
        ...b,
      }));
  };
  return ibb;
};

export const purifyGraphQLKey = (k: string) => k.replace(/\([^)]*\)/g, '').replace(/^[^:]*\:/g, '');

const mapPart = (p: string) => {
  const [isArg, isField] = p.split('<>');
  if (isField) {
    return {
      v: isField,
      __type: 'field',
    } as const;
  }
  return {
    v: isArg,
    __type: 'arg',
  } as const;
};

type Part = ReturnType<typeof mapPart>;

export const ResolveFromPath = (props: AllTypesPropsType, returns: ReturnTypesType, ops: Operations) => {
  const ResolvePropsType = (mappedParts: Part[]) => {
    const oKey = ops[mappedParts[0].v];
    const propsP1 = oKey ? props[oKey] : props[mappedParts[0].v];
    if (propsP1 === 'enum' && mappedParts.length === 1) {
      return 'enum';
    }
    if (typeof propsP1 === 'string' && propsP1.startsWith('scalar.') && mappedParts.length === 1) {
      return propsP1;
    }
    if (typeof propsP1 === 'object') {
      if (mappedParts.length < 2) {
        return 'not';
      }
      const propsP2 = propsP1[mappedParts[1].v];
      if (typeof propsP2 === 'string') {
        return rpp(
          `${propsP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
      if (typeof propsP2 === 'object') {
        if (mappedParts.length < 3) {
          return 'not';
        }
        const propsP3 = propsP2[mappedParts[2].v];
        if (propsP3 && mappedParts[2].__type === 'arg') {
          return rpp(
            `${propsP3}${SEPARATOR}${mappedParts
              .slice(3)
              .map((mp) => mp.v)
              .join(SEPARATOR)}`,
          );
        }
      }
    }
  };
  const ResolveReturnType = (mappedParts: Part[]) => {
    if (mappedParts.length === 0) {
      return 'not';
    }
    const oKey = ops[mappedParts[0].v];
    const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
    if (typeof returnP1 === 'object') {
      if (mappedParts.length < 2) return 'not';
      const returnP2 = returnP1[mappedParts[1].v];
      if (returnP2) {
        return rpp(
          `${returnP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
    }
  };
  const rpp = (path: string): 'enum' | 'not' | `scalar.${string}` => {
    const parts = path.split(SEPARATOR).filter((l) => l.length > 0);
    const mappedParts = parts.map(mapPart);
    const propsP1 = ResolvePropsType(mappedParts);
    if (propsP1) {
      return propsP1;
    }
    const returnP1 = ResolveReturnType(mappedParts);
    if (returnP1) {
      return returnP1;
    }
    return 'not';
  };
  return rpp;
};

export const InternalArgsBuilt = ({
  props,
  ops,
  returns,
  scalars,
  vars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  scalars?: ScalarDefinition;
  vars: Array<{ name: string; graphQLType: string }>;
}) => {
  const arb = (a: ZeusArgsType, p = '', root = true): string => {
    if (typeof a === 'string') {
      if (a.startsWith(START_VAR_NAME)) {
        const [varName, graphQLType] = a.replace(START_VAR_NAME, '$').split(GRAPHQL_TYPE_SEPARATOR);
        const v = vars.find((v) => v.name === varName);
        if (!v) {
          vars.push({
            name: varName,
            graphQLType,
          });
        } else {
          if (v.graphQLType !== graphQLType) {
            throw new Error(
              `Invalid variable exists with two different GraphQL Types, "${v.graphQLType}" and ${graphQLType}`,
            );
          }
        }
        return varName;
      }
    }
    const checkType = ResolveFromPath(props, returns, ops)(p);
    if (checkType.startsWith('scalar.')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...splittedScalar] = checkType.split('.');
      const scalarKey = splittedScalar.join('.');
      return (scalars?.[scalarKey]?.encode?.(a) as string) || JSON.stringify(a);
    }
    if (Array.isArray(a)) {
      return `[${a.map((arr) => arb(arr, p, false)).join(', ')}]`;
    }
    if (typeof a === 'string') {
      if (checkType === 'enum') {
        return a;
      }
      return `${JSON.stringify(a)}`;
    }
    if (typeof a === 'object') {
      if (a === null) {
        return `null`;
      }
      const returnedObjectString = Object.entries(a)
        .filter(([, v]) => typeof v !== 'undefined')
        .map(([k, v]) => `${k}: ${arb(v, [p, k].join(SEPARATOR), false)}`)
        .join(',\n');
      if (!root) {
        return `{${returnedObjectString}}`;
      }
      return returnedObjectString;
    }
    return `${a}`;
  };
  return arb;
};

export const resolverFor = <X, T extends keyof ResolverInputTypes, Z extends keyof ResolverInputTypes[T]>(
  type: T,
  field: Z,
  fn: (
    args: Required<ResolverInputTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X : never,
) => fn as (args?: any, source?: any) => ReturnType<typeof fn>;

export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<UnwrapPromise<ReturnType<T>>>;
export type ZeusHook<
  T extends (...args: any[]) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>,
> = ZeusState<ReturnType<T>[N]>;

export type WithTypeNameValue<T> = T & {
  __typename?: boolean;
  __directives?: string;
};
export type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
export type ScalarDefinition = Record<string, ScalarResolver>;

type IsScalar<S, SCLR extends ScalarDefinition> = S extends 'scalar' & { name: infer T }
  ? T extends keyof SCLR
    ? SCLR[T]['decode'] extends (s: unknown) => unknown
      ? ReturnType<SCLR[T]['decode']>
      : unknown
    : unknown
  : S;
type IsArray<T, U, SCLR extends ScalarDefinition> = T extends Array<infer R>
  ? InputType<R, U, SCLR>[]
  : InputType<T, U, SCLR>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;
type BaseZeusResolver = boolean | 1 | string | Variable<any, string>;

type IsInterfaced<SRC extends DeepAnify<DST>, DST, SCLR extends ScalarDefinition> = FlattenArray<SRC> extends
  | ZEUS_INTERFACES
  | ZEUS_UNIONS
  ? {
      [P in keyof SRC]: SRC[P] extends '__union' & infer R
        ? P extends keyof DST
          ? IsArray<R, '__typename' extends keyof DST ? DST[P] & { __typename: true } : DST[P], SCLR>
          : IsArray<R, '__typename' extends keyof DST ? { __typename: true } : Record<string, never>, SCLR>
        : never;
    }[keyof SRC] & {
      [P in keyof Omit<
        Pick<
          SRC,
          {
            [P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
          }[keyof DST]
        >,
        '__typename'
      >]: IsPayLoad<DST[P]> extends BaseZeusResolver ? IsScalar<SRC[P], SCLR> : IsArray<SRC[P], DST[P], SCLR>;
    }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends BaseZeusResolver
        ? IsScalar<SRC[P], SCLR>
        : IsArray<SRC[P], DST[P], SCLR>;
    };

export type MapType<SRC, DST, SCLR extends ScalarDefinition> = SRC extends DeepAnify<DST>
  ? IsInterfaced<SRC, DST, SCLR>
  : never;
// eslint-disable-next-line @typescript-eslint/ban-types
export type InputType<SRC, DST, SCLR extends ScalarDefinition = {}> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P], SCLR>[keyof MapType<SRC, R[P], SCLR>];
    } & MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>, SCLR>
  : MapType<SRC, IsPayLoad<DST>, SCLR>;
export type SubscriptionToGraphQL<Z, T, SCLR extends ScalarDefinition> = {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z, SCLR>) => void) => void;
  off: (fn: (e: { data?: InputType<T, Z, SCLR>; code?: number; reason?: string; message?: string }) => void) => void;
  error: (fn: (e: { data?: InputType<T, Z, SCLR>; errors?: string[] }) => void) => void;
  open: () => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type FromSelector<SELECTOR, NAME extends keyof GraphQLTypes, SCLR extends ScalarDefinition = {}> = InputType<
  GraphQLTypes[NAME],
  SELECTOR,
  SCLR
>;

export type ScalarResolver = {
  encode?: (s: unknown) => string;
  decode?: (s: unknown) => unknown;
};

export type SelectionFunction<V> = <Z extends V>(
  t: Z & {
    [P in keyof Z]: P extends keyof V ? Z[P] : never;
  },
) => Z;

type BuiltInVariableTypes = {
  ['String']: string;
  ['Int']: number;
  ['Float']: number;
  ['ID']: unknown;
  ['Boolean']: boolean;
};
type AllVariableTypes = keyof BuiltInVariableTypes | keyof ZEUS_VARIABLES;
type VariableRequired<T extends string> = `${T}!` | T | `[${T}]` | `[${T}]!` | `[${T}!]` | `[${T}!]!`;
type VR<T extends string> = VariableRequired<VariableRequired<T>>;

export type GraphQLVariableType = VR<AllVariableTypes>;

type ExtractVariableTypeString<T extends string> = T extends VR<infer R1>
  ? R1 extends VR<infer R2>
    ? R2 extends VR<infer R3>
      ? R3 extends VR<infer R4>
        ? R4 extends VR<infer R5>
          ? R5
          : R4
        : R3
      : R2
    : R1
  : T;

type DecomposeType<T, Type> = T extends `[${infer R}]`
  ? Array<DecomposeType<R, Type>> | undefined
  : T extends `${infer R}!`
  ? NonNullable<DecomposeType<R, Type>>
  : Type | undefined;

type ExtractTypeFromGraphQLType<T extends string> = T extends keyof ZEUS_VARIABLES
  ? ZEUS_VARIABLES[T]
  : T extends keyof BuiltInVariableTypes
  ? BuiltInVariableTypes[T]
  : any;

export type GetVariableType<T extends string> = DecomposeType<
  T,
  ExtractTypeFromGraphQLType<ExtractVariableTypeString<T>>
>;

type UndefinedKeys<T> = {
  [K in keyof T]-?: T[K] extends NonNullable<T[K]> ? never : K;
}[keyof T];

type WithNullableKeys<T> = Pick<T, UndefinedKeys<T>>;
type WithNonNullableKeys<T> = Omit<T, UndefinedKeys<T>>;

type OptionalKeys<T> = {
  [P in keyof T]?: T[P];
};

export type WithOptionalNullables<T> = OptionalKeys<WithNullableKeys<T>> & WithNonNullableKeys<T>;

export type Variable<T extends GraphQLVariableType, Name extends string> = {
  ' __zeus_name': Name;
  ' __zeus_type': T;
};

export type ExtractVariablesDeep<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends string | number | boolean | Array<string | number | boolean>
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariablesDeep<Query[K]>> }[keyof Query]>;

export type ExtractVariables<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends [infer Inputs, infer Outputs]
  ? ExtractVariablesDeep<Inputs> & ExtractVariables<Outputs>
  : Query extends string | number | boolean | Array<string | number | boolean>
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariables<Query[K]>> }[keyof Query]>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export const START_VAR_NAME = `$ZEUS_VAR`;
export const GRAPHQL_TYPE_SEPARATOR = `__$GRAPHQL__`;

export const $ = <Type extends GraphQLVariableType, Name extends string>(name: Name, graphqlType: Type) => {
  return (START_VAR_NAME + name + GRAPHQL_TYPE_SEPARATOR + graphqlType) as unknown as Variable<Type, Name>;
};
type ZEUS_INTERFACES = never
export type ScalarCoders = {
	ObjectId?: ScalarResolver;
	S3Scalar?: ScalarResolver;
	Timestamp?: ScalarResolver;
	ModelNavigationCompiled?: ScalarResolver;
	BackupFile?: ScalarResolver;
}
type ZEUS_UNIONS = never

export type ValueTypes = {
    ["ObjectId"]:unknown;
	["S3Scalar"]:unknown;
	["Timestamp"]:unknown;
	["ModelNavigationCompiled"]:unknown;
	["VersionField"]: AliasType<{
	name?:boolean | `@${string}`,
	from?:boolean | `@${string}`,
	to?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ImageField"]: AliasType<{
	url?:boolean | `@${string}`,
	thumbnail?:boolean | `@${string}`,
	alt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["RootCMSParam"]: AliasType<{
	name?:boolean | `@${string}`,
	options?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ModelNavigation"]: AliasType<{
	name?:boolean | `@${string}`,
	display?:boolean | `@${string}`,
	fields?:ValueTypes["CMSField"],
	fieldSet?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["CMSField"]: AliasType<{
	name?:boolean | `@${string}`,
	type?:boolean | `@${string}`,
	list?:boolean | `@${string}`,
	options?:boolean | `@${string}`,
	relation?:boolean | `@${string}`,
	fields?:ValueTypes["CMSField"],
	builtIn?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PageInfo"]: AliasType<{
	total?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PageInput"]: {
	limit: number | Variable<any, string>,
	start?: number | undefined | null | Variable<any, string>
};
	["ModifyVersion"]: {
	name?: string | undefined | null | Variable<any, string>,
	from?: ValueTypes["Timestamp"] | undefined | null | Variable<any, string>,
	to?: ValueTypes["Timestamp"] | undefined | null | Variable<any, string>
};
	["ImageFieldInput"]: {
	thumbnail?: ValueTypes["S3Scalar"] | undefined | null | Variable<any, string>,
	url?: ValueTypes["S3Scalar"] | undefined | null | Variable<any, string>,
	alt?: string | undefined | null | Variable<any, string>
};
	["AnalyticsResponse"]: AliasType<{
	date?:boolean | `@${string}`,
	value?:ValueTypes["AnalyticsModelResponse"],
		__typename?: boolean | `@${string}`
}>;
	["AnalyticsModelResponse"]: AliasType<{
	modelName?:boolean | `@${string}`,
	calls?:boolean | `@${string}`,
	rootParamsKey?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["CreateRootCMSParam"]: {
	name: string | Variable<any, string>,
	options: Array<string> | Variable<any, string>
};
	["FileResponse"]: AliasType<{
	key?:boolean | `@${string}`,
	cdnURL?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["FileConnection"]: AliasType<{
	items?:ValueTypes["FileResponse"],
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["MediaResponse"]: AliasType<{
	key?:boolean | `@${string}`,
	cdnURL?:boolean | `@${string}`,
	thumbnailCdnURL?:boolean | `@${string}`,
	alt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["MediaConnection"]: AliasType<{
	items?:ValueTypes["MediaResponse"],
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["MediaParamsInput"]: {
	model?: string | undefined | null | Variable<any, string>,
	search?: string | undefined | null | Variable<any, string>,
	page?: ValueTypes["PageInput"] | undefined | null | Variable<any, string>
};
	["UploadFileInput"]: {
	key: string | Variable<any, string>,
	prefix?: string | undefined | null | Variable<any, string>,
	alt?: string | undefined | null | Variable<any, string>
};
	["UploadFileResponseBase"]: AliasType<{
	key?:boolean | `@${string}`,
	putURL?:boolean | `@${string}`,
	cdnURL?:boolean | `@${string}`,
	alt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ImageUploadResponse"]: AliasType<{
	file?:ValueTypes["UploadFileResponseBase"],
	thumbnail?:ValueTypes["UploadFileResponseBase"],
		__typename?: boolean | `@${string}`
}>;
	["InputCMSField"]: {
	name: string | Variable<any, string>,
	type: ValueTypes["CMSType"] | Variable<any, string>,
	list?: boolean | undefined | null | Variable<any, string>,
	options?: Array<string> | undefined | null | Variable<any, string>,
	relation?: string | undefined | null | Variable<any, string>,
	builtIn?: boolean | undefined | null | Variable<any, string>,
	fields?: Array<ValueTypes["InputCMSField"]> | undefined | null | Variable<any, string>
};
	["ApiKey"]: AliasType<{
	name?:boolean | `@${string}`,
	createdAt?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
	value?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Languages"]:Languages;
	["BackupFile"]:unknown;
	["AdminQuery"]: AliasType<{
analytics?: [{	fromDate: string | Variable<any, string>,	toDate?: string | undefined | null | Variable<any, string>},ValueTypes["AnalyticsResponse"]],
	backup?:boolean | `@${string}`,
	backups?:ValueTypes["MediaResponse"],
	apiKeys?:ValueTypes["ApiKey"],
		__typename?: boolean | `@${string}`
}>;
	["TranslateDocumentResponse"]: AliasType<{
	result?:boolean | `@${string}`,
	usedTokens?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Mutation"]: AliasType<{
	admin?:ValueTypes["AdminMutation"],
		__typename?: boolean | `@${string}`
}>;
	/** This enum is defined externally and injected via federation */
["CMSType"]:CMSType;
	["Query"]: AliasType<{
	navigation?:ValueTypes["ModelNavigation"],
	rootParams?:ValueTypes["RootCMSParam"],
	admin?:ValueTypes["AdminQuery"],
	isLoggedIn?:boolean | `@${string}`,
	logoURL?:boolean | `@${string}`,
listhomepage?: [{	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["homepage"]],
listPaginatedhomepage?: [{	page: ValueTypes["PageInput"] | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["homepage__Connection"]],
onehomepageBySlug?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["homepage"]],
variantshomepageBySlug?: [{	slug: string | Variable<any, string>},ValueTypes["homepage"]],
	fieldSethomepage?:boolean | `@${string}`,
	modelhomepage?:boolean | `@${string}`,
listmodel_jarka?: [{	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["model_jarka"]],
listPaginatedmodel_jarka?: [{	page: ValueTypes["PageInput"] | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["model_jarka__Connection"]],
onemodel_jarkaBySlug?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["model_jarka"]],
variantsmodel_jarkaBySlug?: [{	slug: string | Variable<any, string>},ValueTypes["model_jarka"]],
	fieldSetmodel_jarka?:boolean | `@${string}`,
	modelmodel_jarka?:boolean | `@${string}`,
listo_nas?: [{	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["o_nas"]],
listPaginatedo_nas?: [{	page: ValueTypes["PageInput"] | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["o_nas__Connection"]],
oneo_nasBySlug?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["o_nas"]],
variantso_nasBySlug?: [{	slug: string | Variable<any, string>},ValueTypes["o_nas"]],
	fieldSeto_nas?:boolean | `@${string}`,
	modelo_nas?:boolean | `@${string}`,
listtestmodel?: [{	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["testmodel"]],
listPaginatedtestmodel?: [{	page: ValueTypes["PageInput"] | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["testmodel__Connection"]],
onetestmodelBySlug?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["testmodel"]],
variantstestmodelBySlug?: [{	slug: string | Variable<any, string>},ValueTypes["testmodel"]],
	fieldSettestmodel?:boolean | `@${string}`,
	modeltestmodel?:boolean | `@${string}`,
listtestqa?: [{	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["testqa"]],
listPaginatedtestqa?: [{	page: ValueTypes["PageInput"] | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["testqa__Connection"]],
onetestqaBySlug?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["testqa"]],
variantstestqaBySlug?: [{	slug: string | Variable<any, string>},ValueTypes["testqa"]],
	fieldSettestqa?:boolean | `@${string}`,
	modeltestqa?:boolean | `@${string}`,
listtext_page?: [{	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["text_page"]],
listPaginatedtext_page?: [{	page: ValueTypes["PageInput"] | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["text_page__Connection"]],
onetext_pageBySlug?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["text_page"]],
variantstext_pageBySlug?: [{	slug: string | Variable<any, string>},ValueTypes["text_page"]],
	fieldSettext_page?:boolean | `@${string}`,
	modeltext_page?:boolean | `@${string}`,
mediaQuery?: [{	mediaParams?: ValueTypes["MediaParamsInput"] | undefined | null | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["MediaConnection"]],
filesQuery?: [{	mediaParams?: ValueTypes["MediaParamsInput"] | undefined | null | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},ValueTypes["FileConnection"]],
		__typename?: boolean | `@${string}`
}>;
	["AdminMutation"]: AliasType<{
upsertModel?: [{	modelName?: string | undefined | null | Variable<any, string>,	fields: Array<ValueTypes["InputCMSField"]> | Variable<any, string>},boolean | `@${string}`],
removeModel?: [{	modelName: string | Variable<any, string>},boolean | `@${string}`],
upsertParam?: [{	param: ValueTypes["CreateRootCMSParam"] | Variable<any, string>},boolean | `@${string}`],
removeParam?: [{	name: string | Variable<any, string>},boolean | `@${string}`],
uploadFile?: [{	file: ValueTypes["UploadFileInput"] | Variable<any, string>},ValueTypes["UploadFileResponseBase"]],
uploadImage?: [{	file: ValueTypes["UploadFileInput"] | Variable<any, string>},ValueTypes["ImageUploadResponse"]],
removeFiles?: [{	keys: Array<string> | Variable<any, string>},boolean | `@${string}`],
restore?: [{	backup?: ValueTypes["BackupFile"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
generateApiKey?: [{	name: string | Variable<any, string>},boolean | `@${string}`],
revokeApiKey?: [{	name: string | Variable<any, string>},boolean | `@${string}`],
translateDocument?: [{	content: string | Variable<any, string>,	resultLanguages: Array<ValueTypes["Languages"]> | Variable<any, string>},ValueTypes["TranslateDocumentResponse"]],
changeLogo?: [{	logoURL: string | Variable<any, string>},boolean | `@${string}`],
	removeLogo?:boolean | `@${string}`,
upserthomepage?: [{	slug: string | Variable<any, string>,	homepage?: ValueTypes["Modifyhomepage"] | undefined | null | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
removehomepage?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
upsertmodel_jarka?: [{	slug: string | Variable<any, string>,	model_jarka?: ValueTypes["Modifymodel_jarka"] | undefined | null | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
removemodel_jarka?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
upserto_nas?: [{	slug: string | Variable<any, string>,	o_nas?: ValueTypes["Modifyo_nas"] | undefined | null | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
removeo_nas?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
upserttestmodel?: [{	slug: string | Variable<any, string>,	testmodel?: ValueTypes["Modifytestmodel"] | undefined | null | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
removetestmodel?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
upserttestqa?: [{	slug: string | Variable<any, string>,	testqa?: ValueTypes["Modifytestqa"] | undefined | null | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
removetestqa?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
upserttext_page?: [{	slug: string | Variable<any, string>,	text_page?: ValueTypes["Modifytext_page"] | undefined | null | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
removetext_page?: [{	slug: string | Variable<any, string>,	rootParams?: ValueTypes["RootParamsInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
		__typename?: boolean | `@${string}`
}>;
	["homepageTestobjTestinsideobj"]: AliasType<{
	_version?:ValueTypes["VersionField"],
	deepfield?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["homepageTestobjTestinsideobj__Connection"]: AliasType<{
	items?:ValueTypes["homepageTestobjTestinsideobj"],
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["homepageTestobj"]: AliasType<{
	_version?:ValueTypes["VersionField"],
	testfield?:boolean | `@${string}`,
	testinsideobj?:ValueTypes["homepageTestobjTestinsideobj"],
		__typename?: boolean | `@${string}`
}>;
	["homepageTestobj__Connection"]: AliasType<{
	items?:ValueTypes["homepageTestobj"],
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["homepage"]: AliasType<{
	_version?:ValueTypes["VersionField"],
	tytul?:boolean | `@${string}`,
	edycja_nazwy?:boolean | `@${string}`,
	testowe?:ValueTypes["ImageField"],
	testobj?:ValueTypes["homepageTestobj"],
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["homepage__Connection"]: AliasType<{
	items?:ValueTypes["homepage"],
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["model_jarkaDetails"]: AliasType<{
	_version?:ValueTypes["VersionField"],
	size?:boolean | `@${string}`,
	tags?:boolean | `@${string}`,
	weight?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["model_jarkaDetails__Connection"]: AliasType<{
	items?:ValueTypes["model_jarkaDetails"],
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["model_jarka"]: AliasType<{
	_version?:ValueTypes["VersionField"],
	title?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	content?:boolean | `@${string}`,
	thumbnail?:ValueTypes["ImageField"],
	details?:ValueTypes["model_jarkaDetails"],
	attachments?:boolean | `@${string}`,
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["model_jarka__Connection"]: AliasType<{
	items?:ValueTypes["model_jarka"],
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["o_nas"]: AliasType<{
	_version?:ValueTypes["VersionField"],
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["o_nas__Connection"]: AliasType<{
	items?:ValueTypes["o_nas"],
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["testmodel"]: AliasType<{
	_version?:ValueTypes["VersionField"],
	title?:boolean | `@${string}`,
	num?:boolean | `@${string}`,
	tete?:boolean | `@${string}`,
	testimage?:ValueTypes["ImageField"],
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["testmodel__Connection"]: AliasType<{
	items?:ValueTypes["testmodel"],
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["testqa"]: AliasType<{
	_version?:ValueTypes["VersionField"],
	test?:boolean | `@${string}`,
	test2?:boolean | `@${string}`,
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["testqa__Connection"]: AliasType<{
	items?:ValueTypes["testqa"],
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["text_page"]: AliasType<{
	_version?:ValueTypes["VersionField"],
	content?:boolean | `@${string}`,
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["text_page__Connection"]: AliasType<{
	items?:ValueTypes["text_page"],
	pageInfo?:ValueTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["ModifyhomepageTestobjTestinsideobj"]: {
	_version?: ValueTypes["ModifyVersion"] | undefined | null | Variable<any, string>,
	deepfield?: string | undefined | null | Variable<any, string>
};
	["ModifyhomepageTestobj"]: {
	_version?: ValueTypes["ModifyVersion"] | undefined | null | Variable<any, string>,
	testfield?: string | undefined | null | Variable<any, string>,
	testinsideobj?: ValueTypes["ModifyhomepageTestobjTestinsideobj"] | undefined | null | Variable<any, string>
};
	["Modifyhomepage"]: {
	_version?: ValueTypes["ModifyVersion"] | undefined | null | Variable<any, string>,
	tytul?: string | undefined | null | Variable<any, string>,
	edycja_nazwy?: string | undefined | null | Variable<any, string>,
	testowe?: ValueTypes["ImageFieldInput"] | undefined | null | Variable<any, string>,
	testobj?: ValueTypes["ModifyhomepageTestobj"] | undefined | null | Variable<any, string>,
	locales?: string | undefined | null | Variable<any, string>,
	slug?: string | undefined | null | Variable<any, string>
};
	["Modifymodel_jarkaDetails"]: {
	_version?: ValueTypes["ModifyVersion"] | undefined | null | Variable<any, string>,
	size?: string | undefined | null | Variable<any, string>,
	tags?: Array<string | undefined | null> | undefined | null | Variable<any, string>,
	weight?: number | undefined | null | Variable<any, string>
};
	["Modifymodel_jarka"]: {
	_version?: ValueTypes["ModifyVersion"] | undefined | null | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>,
	description?: string | undefined | null | Variable<any, string>,
	content?: string | undefined | null | Variable<any, string>,
	thumbnail?: ValueTypes["ImageFieldInput"] | undefined | null | Variable<any, string>,
	details?: ValueTypes["Modifymodel_jarkaDetails"] | undefined | null | Variable<any, string>,
	attachments?: Array<ValueTypes["S3Scalar"] | undefined | null> | undefined | null | Variable<any, string>,
	locales?: string | undefined | null | Variable<any, string>,
	slug?: string | undefined | null | Variable<any, string>
};
	["Modifyo_nas"]: {
	_version?: ValueTypes["ModifyVersion"] | undefined | null | Variable<any, string>,
	locales?: string | undefined | null | Variable<any, string>,
	slug?: string | undefined | null | Variable<any, string>
};
	["Modifytestmodel"]: {
	_version?: ValueTypes["ModifyVersion"] | undefined | null | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>,
	num?: Array<number | undefined | null> | undefined | null | Variable<any, string>,
	tete?: string | undefined | null | Variable<any, string>,
	testimage?: ValueTypes["ImageFieldInput"] | undefined | null | Variable<any, string>,
	locales?: string | undefined | null | Variable<any, string>,
	slug?: string | undefined | null | Variable<any, string>
};
	["Modifytestqa"]: {
	_version?: ValueTypes["ModifyVersion"] | undefined | null | Variable<any, string>,
	test?: string | undefined | null | Variable<any, string>,
	test2?: number | undefined | null | Variable<any, string>,
	locales?: string | undefined | null | Variable<any, string>,
	slug?: string | undefined | null | Variable<any, string>
};
	["Modifytext_page"]: {
	_version?: ValueTypes["ModifyVersion"] | undefined | null | Variable<any, string>,
	content?: string | undefined | null | Variable<any, string>,
	locales?: string | undefined | null | Variable<any, string>,
	slug?: string | undefined | null | Variable<any, string>
};
	["RootParamsInput"]: {
	_version?: string | undefined | null | Variable<any, string>,
	locales?: string | undefined | null | Variable<any, string>
};
	["CMSModelTypes"]:CMSModelTypes
  }

export type ResolverInputTypes = {
    ["ObjectId"]:unknown;
	["S3Scalar"]:unknown;
	["Timestamp"]:unknown;
	["ModelNavigationCompiled"]:unknown;
	["VersionField"]: AliasType<{
	name?:boolean | `@${string}`,
	from?:boolean | `@${string}`,
	to?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ImageField"]: AliasType<{
	url?:boolean | `@${string}`,
	thumbnail?:boolean | `@${string}`,
	alt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["RootCMSParam"]: AliasType<{
	name?:boolean | `@${string}`,
	options?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ModelNavigation"]: AliasType<{
	name?:boolean | `@${string}`,
	display?:boolean | `@${string}`,
	fields?:ResolverInputTypes["CMSField"],
	fieldSet?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["CMSField"]: AliasType<{
	name?:boolean | `@${string}`,
	type?:boolean | `@${string}`,
	list?:boolean | `@${string}`,
	options?:boolean | `@${string}`,
	relation?:boolean | `@${string}`,
	fields?:ResolverInputTypes["CMSField"],
	builtIn?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PageInfo"]: AliasType<{
	total?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PageInput"]: {
	limit: number,
	start?: number | undefined | null
};
	["ModifyVersion"]: {
	name?: string | undefined | null,
	from?: ResolverInputTypes["Timestamp"] | undefined | null,
	to?: ResolverInputTypes["Timestamp"] | undefined | null
};
	["ImageFieldInput"]: {
	thumbnail?: ResolverInputTypes["S3Scalar"] | undefined | null,
	url?: ResolverInputTypes["S3Scalar"] | undefined | null,
	alt?: string | undefined | null
};
	["AnalyticsResponse"]: AliasType<{
	date?:boolean | `@${string}`,
	value?:ResolverInputTypes["AnalyticsModelResponse"],
		__typename?: boolean | `@${string}`
}>;
	["AnalyticsModelResponse"]: AliasType<{
	modelName?:boolean | `@${string}`,
	calls?:boolean | `@${string}`,
	rootParamsKey?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["CreateRootCMSParam"]: {
	name: string,
	options: Array<string>
};
	["FileResponse"]: AliasType<{
	key?:boolean | `@${string}`,
	cdnURL?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["FileConnection"]: AliasType<{
	items?:ResolverInputTypes["FileResponse"],
	pageInfo?:ResolverInputTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["MediaResponse"]: AliasType<{
	key?:boolean | `@${string}`,
	cdnURL?:boolean | `@${string}`,
	thumbnailCdnURL?:boolean | `@${string}`,
	alt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["MediaConnection"]: AliasType<{
	items?:ResolverInputTypes["MediaResponse"],
	pageInfo?:ResolverInputTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["MediaParamsInput"]: {
	model?: string | undefined | null,
	search?: string | undefined | null,
	page?: ResolverInputTypes["PageInput"] | undefined | null
};
	["UploadFileInput"]: {
	key: string,
	prefix?: string | undefined | null,
	alt?: string | undefined | null
};
	["UploadFileResponseBase"]: AliasType<{
	key?:boolean | `@${string}`,
	putURL?:boolean | `@${string}`,
	cdnURL?:boolean | `@${string}`,
	alt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ImageUploadResponse"]: AliasType<{
	file?:ResolverInputTypes["UploadFileResponseBase"],
	thumbnail?:ResolverInputTypes["UploadFileResponseBase"],
		__typename?: boolean | `@${string}`
}>;
	["InputCMSField"]: {
	name: string,
	type: ResolverInputTypes["CMSType"],
	list?: boolean | undefined | null,
	options?: Array<string> | undefined | null,
	relation?: string | undefined | null,
	builtIn?: boolean | undefined | null,
	fields?: Array<ResolverInputTypes["InputCMSField"]> | undefined | null
};
	["ApiKey"]: AliasType<{
	name?:boolean | `@${string}`,
	createdAt?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
	value?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Languages"]:Languages;
	["BackupFile"]:unknown;
	["AdminQuery"]: AliasType<{
analytics?: [{	fromDate: string,	toDate?: string | undefined | null},ResolverInputTypes["AnalyticsResponse"]],
	backup?:boolean | `@${string}`,
	backups?:ResolverInputTypes["MediaResponse"],
	apiKeys?:ResolverInputTypes["ApiKey"],
		__typename?: boolean | `@${string}`
}>;
	["TranslateDocumentResponse"]: AliasType<{
	result?:boolean | `@${string}`,
	usedTokens?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Mutation"]: AliasType<{
	admin?:ResolverInputTypes["AdminMutation"],
		__typename?: boolean | `@${string}`
}>;
	/** This enum is defined externally and injected via federation */
["CMSType"]:CMSType;
	["Query"]: AliasType<{
	navigation?:ResolverInputTypes["ModelNavigation"],
	rootParams?:ResolverInputTypes["RootCMSParam"],
	admin?:ResolverInputTypes["AdminQuery"],
	isLoggedIn?:boolean | `@${string}`,
	logoURL?:boolean | `@${string}`,
listhomepage?: [{	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["homepage"]],
listPaginatedhomepage?: [{	page: ResolverInputTypes["PageInput"],	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["homepage__Connection"]],
onehomepageBySlug?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["homepage"]],
variantshomepageBySlug?: [{	slug: string},ResolverInputTypes["homepage"]],
	fieldSethomepage?:boolean | `@${string}`,
	modelhomepage?:boolean | `@${string}`,
listmodel_jarka?: [{	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["model_jarka"]],
listPaginatedmodel_jarka?: [{	page: ResolverInputTypes["PageInput"],	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["model_jarka__Connection"]],
onemodel_jarkaBySlug?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["model_jarka"]],
variantsmodel_jarkaBySlug?: [{	slug: string},ResolverInputTypes["model_jarka"]],
	fieldSetmodel_jarka?:boolean | `@${string}`,
	modelmodel_jarka?:boolean | `@${string}`,
listo_nas?: [{	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["o_nas"]],
listPaginatedo_nas?: [{	page: ResolverInputTypes["PageInput"],	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["o_nas__Connection"]],
oneo_nasBySlug?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["o_nas"]],
variantso_nasBySlug?: [{	slug: string},ResolverInputTypes["o_nas"]],
	fieldSeto_nas?:boolean | `@${string}`,
	modelo_nas?:boolean | `@${string}`,
listtestmodel?: [{	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["testmodel"]],
listPaginatedtestmodel?: [{	page: ResolverInputTypes["PageInput"],	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["testmodel__Connection"]],
onetestmodelBySlug?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["testmodel"]],
variantstestmodelBySlug?: [{	slug: string},ResolverInputTypes["testmodel"]],
	fieldSettestmodel?:boolean | `@${string}`,
	modeltestmodel?:boolean | `@${string}`,
listtestqa?: [{	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["testqa"]],
listPaginatedtestqa?: [{	page: ResolverInputTypes["PageInput"],	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["testqa__Connection"]],
onetestqaBySlug?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["testqa"]],
variantstestqaBySlug?: [{	slug: string},ResolverInputTypes["testqa"]],
	fieldSettestqa?:boolean | `@${string}`,
	modeltestqa?:boolean | `@${string}`,
listtext_page?: [{	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["text_page"]],
listPaginatedtext_page?: [{	page: ResolverInputTypes["PageInput"],	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["text_page__Connection"]],
onetext_pageBySlug?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["text_page"]],
variantstext_pageBySlug?: [{	slug: string},ResolverInputTypes["text_page"]],
	fieldSettext_page?:boolean | `@${string}`,
	modeltext_page?:boolean | `@${string}`,
mediaQuery?: [{	mediaParams?: ResolverInputTypes["MediaParamsInput"] | undefined | null,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["MediaConnection"]],
filesQuery?: [{	mediaParams?: ResolverInputTypes["MediaParamsInput"] | undefined | null,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},ResolverInputTypes["FileConnection"]],
		__typename?: boolean | `@${string}`
}>;
	["AdminMutation"]: AliasType<{
upsertModel?: [{	modelName?: string | undefined | null,	fields: Array<ResolverInputTypes["InputCMSField"]>},boolean | `@${string}`],
removeModel?: [{	modelName: string},boolean | `@${string}`],
upsertParam?: [{	param: ResolverInputTypes["CreateRootCMSParam"]},boolean | `@${string}`],
removeParam?: [{	name: string},boolean | `@${string}`],
uploadFile?: [{	file: ResolverInputTypes["UploadFileInput"]},ResolverInputTypes["UploadFileResponseBase"]],
uploadImage?: [{	file: ResolverInputTypes["UploadFileInput"]},ResolverInputTypes["ImageUploadResponse"]],
removeFiles?: [{	keys: Array<string>},boolean | `@${string}`],
restore?: [{	backup?: ResolverInputTypes["BackupFile"] | undefined | null},boolean | `@${string}`],
generateApiKey?: [{	name: string},boolean | `@${string}`],
revokeApiKey?: [{	name: string},boolean | `@${string}`],
translateDocument?: [{	content: string,	resultLanguages: Array<ResolverInputTypes["Languages"]>},ResolverInputTypes["TranslateDocumentResponse"]],
changeLogo?: [{	logoURL: string},boolean | `@${string}`],
	removeLogo?:boolean | `@${string}`,
upserthomepage?: [{	slug: string,	homepage?: ResolverInputTypes["Modifyhomepage"] | undefined | null,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
removehomepage?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
upsertmodel_jarka?: [{	slug: string,	model_jarka?: ResolverInputTypes["Modifymodel_jarka"] | undefined | null,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
removemodel_jarka?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
upserto_nas?: [{	slug: string,	o_nas?: ResolverInputTypes["Modifyo_nas"] | undefined | null,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
removeo_nas?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
upserttestmodel?: [{	slug: string,	testmodel?: ResolverInputTypes["Modifytestmodel"] | undefined | null,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
removetestmodel?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
upserttestqa?: [{	slug: string,	testqa?: ResolverInputTypes["Modifytestqa"] | undefined | null,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
removetestqa?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
upserttext_page?: [{	slug: string,	text_page?: ResolverInputTypes["Modifytext_page"] | undefined | null,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
removetext_page?: [{	slug: string,	rootParams?: ResolverInputTypes["RootParamsInput"] | undefined | null},boolean | `@${string}`],
		__typename?: boolean | `@${string}`
}>;
	["homepageTestobjTestinsideobj"]: AliasType<{
	_version?:ResolverInputTypes["VersionField"],
	deepfield?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["homepageTestobjTestinsideobj__Connection"]: AliasType<{
	items?:ResolverInputTypes["homepageTestobjTestinsideobj"],
	pageInfo?:ResolverInputTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["homepageTestobj"]: AliasType<{
	_version?:ResolverInputTypes["VersionField"],
	testfield?:boolean | `@${string}`,
	testinsideobj?:ResolverInputTypes["homepageTestobjTestinsideobj"],
		__typename?: boolean | `@${string}`
}>;
	["homepageTestobj__Connection"]: AliasType<{
	items?:ResolverInputTypes["homepageTestobj"],
	pageInfo?:ResolverInputTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["homepage"]: AliasType<{
	_version?:ResolverInputTypes["VersionField"],
	tytul?:boolean | `@${string}`,
	edycja_nazwy?:boolean | `@${string}`,
	testowe?:ResolverInputTypes["ImageField"],
	testobj?:ResolverInputTypes["homepageTestobj"],
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["homepage__Connection"]: AliasType<{
	items?:ResolverInputTypes["homepage"],
	pageInfo?:ResolverInputTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["model_jarkaDetails"]: AliasType<{
	_version?:ResolverInputTypes["VersionField"],
	size?:boolean | `@${string}`,
	tags?:boolean | `@${string}`,
	weight?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["model_jarkaDetails__Connection"]: AliasType<{
	items?:ResolverInputTypes["model_jarkaDetails"],
	pageInfo?:ResolverInputTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["model_jarka"]: AliasType<{
	_version?:ResolverInputTypes["VersionField"],
	title?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	content?:boolean | `@${string}`,
	thumbnail?:ResolverInputTypes["ImageField"],
	details?:ResolverInputTypes["model_jarkaDetails"],
	attachments?:boolean | `@${string}`,
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["model_jarka__Connection"]: AliasType<{
	items?:ResolverInputTypes["model_jarka"],
	pageInfo?:ResolverInputTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["o_nas"]: AliasType<{
	_version?:ResolverInputTypes["VersionField"],
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["o_nas__Connection"]: AliasType<{
	items?:ResolverInputTypes["o_nas"],
	pageInfo?:ResolverInputTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["testmodel"]: AliasType<{
	_version?:ResolverInputTypes["VersionField"],
	title?:boolean | `@${string}`,
	num?:boolean | `@${string}`,
	tete?:boolean | `@${string}`,
	testimage?:ResolverInputTypes["ImageField"],
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["testmodel__Connection"]: AliasType<{
	items?:ResolverInputTypes["testmodel"],
	pageInfo?:ResolverInputTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["testqa"]: AliasType<{
	_version?:ResolverInputTypes["VersionField"],
	test?:boolean | `@${string}`,
	test2?:boolean | `@${string}`,
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["testqa__Connection"]: AliasType<{
	items?:ResolverInputTypes["testqa"],
	pageInfo?:ResolverInputTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["text_page"]: AliasType<{
	_version?:ResolverInputTypes["VersionField"],
	content?:boolean | `@${string}`,
	locales?:boolean | `@${string}`,
	slug?:boolean | `@${string}`,
	_id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["text_page__Connection"]: AliasType<{
	items?:ResolverInputTypes["text_page"],
	pageInfo?:ResolverInputTypes["PageInfo"],
		__typename?: boolean | `@${string}`
}>;
	["ModifyhomepageTestobjTestinsideobj"]: {
	_version?: ResolverInputTypes["ModifyVersion"] | undefined | null,
	deepfield?: string | undefined | null
};
	["ModifyhomepageTestobj"]: {
	_version?: ResolverInputTypes["ModifyVersion"] | undefined | null,
	testfield?: string | undefined | null,
	testinsideobj?: ResolverInputTypes["ModifyhomepageTestobjTestinsideobj"] | undefined | null
};
	["Modifyhomepage"]: {
	_version?: ResolverInputTypes["ModifyVersion"] | undefined | null,
	tytul?: string | undefined | null,
	edycja_nazwy?: string | undefined | null,
	testowe?: ResolverInputTypes["ImageFieldInput"] | undefined | null,
	testobj?: ResolverInputTypes["ModifyhomepageTestobj"] | undefined | null,
	locales?: string | undefined | null,
	slug?: string | undefined | null
};
	["Modifymodel_jarkaDetails"]: {
	_version?: ResolverInputTypes["ModifyVersion"] | undefined | null,
	size?: string | undefined | null,
	tags?: Array<string | undefined | null> | undefined | null,
	weight?: number | undefined | null
};
	["Modifymodel_jarka"]: {
	_version?: ResolverInputTypes["ModifyVersion"] | undefined | null,
	title?: string | undefined | null,
	description?: string | undefined | null,
	content?: string | undefined | null,
	thumbnail?: ResolverInputTypes["ImageFieldInput"] | undefined | null,
	details?: ResolverInputTypes["Modifymodel_jarkaDetails"] | undefined | null,
	attachments?: Array<ResolverInputTypes["S3Scalar"] | undefined | null> | undefined | null,
	locales?: string | undefined | null,
	slug?: string | undefined | null
};
	["Modifyo_nas"]: {
	_version?: ResolverInputTypes["ModifyVersion"] | undefined | null,
	locales?: string | undefined | null,
	slug?: string | undefined | null
};
	["Modifytestmodel"]: {
	_version?: ResolverInputTypes["ModifyVersion"] | undefined | null,
	title?: string | undefined | null,
	num?: Array<number | undefined | null> | undefined | null,
	tete?: string | undefined | null,
	testimage?: ResolverInputTypes["ImageFieldInput"] | undefined | null,
	locales?: string | undefined | null,
	slug?: string | undefined | null
};
	["Modifytestqa"]: {
	_version?: ResolverInputTypes["ModifyVersion"] | undefined | null,
	test?: string | undefined | null,
	test2?: number | undefined | null,
	locales?: string | undefined | null,
	slug?: string | undefined | null
};
	["Modifytext_page"]: {
	_version?: ResolverInputTypes["ModifyVersion"] | undefined | null,
	content?: string | undefined | null,
	locales?: string | undefined | null,
	slug?: string | undefined | null
};
	["RootParamsInput"]: {
	_version?: string | undefined | null,
	locales?: string | undefined | null
};
	["CMSModelTypes"]:CMSModelTypes;
	["schema"]: AliasType<{
	query?:ResolverInputTypes["Query"],
	mutation?:ResolverInputTypes["Mutation"],
		__typename?: boolean | `@${string}`
}>
  }

export type ModelTypes = {
    ["ObjectId"]:any;
	["S3Scalar"]:any;
	["Timestamp"]:any;
	["ModelNavigationCompiled"]:any;
	["VersionField"]: {
		name: string,
	from?: ModelTypes["Timestamp"] | undefined,
	to?: ModelTypes["Timestamp"] | undefined
};
	["ImageField"]: {
		url?: ModelTypes["S3Scalar"] | undefined,
	thumbnail?: ModelTypes["S3Scalar"] | undefined,
	alt?: string | undefined
};
	["RootCMSParam"]: {
		name: string,
	options: Array<string>
};
	["ModelNavigation"]: {
		name: string,
	display: string,
	fields: Array<ModelTypes["CMSField"]>,
	fieldSet: string
};
	["CMSField"]: {
		name: string,
	type: ModelTypes["CMSType"],
	list?: boolean | undefined,
	options?: Array<string> | undefined,
	relation?: string | undefined,
	fields?: Array<ModelTypes["CMSField"]> | undefined,
	builtIn?: boolean | undefined
};
	["PageInfo"]: {
		total: number,
	hasNext?: boolean | undefined
};
	["PageInput"]: {
	limit: number,
	start?: number | undefined
};
	["ModifyVersion"]: {
	name?: string | undefined,
	from?: ModelTypes["Timestamp"] | undefined,
	to?: ModelTypes["Timestamp"] | undefined
};
	["ImageFieldInput"]: {
	thumbnail?: ModelTypes["S3Scalar"] | undefined,
	url?: ModelTypes["S3Scalar"] | undefined,
	alt?: string | undefined
};
	["AnalyticsResponse"]: {
		date?: string | undefined,
	value?: Array<ModelTypes["AnalyticsModelResponse"]> | undefined
};
	["AnalyticsModelResponse"]: {
		modelName: string,
	calls: number,
	rootParamsKey?: string | undefined
};
	["CreateRootCMSParam"]: {
	name: string,
	options: Array<string>
};
	["FileResponse"]: {
		key: string,
	cdnURL: string
};
	["FileConnection"]: {
		items: Array<ModelTypes["FileResponse"] | undefined>,
	pageInfo?: ModelTypes["PageInfo"] | undefined
};
	["MediaResponse"]: {
		key?: string | undefined,
	cdnURL?: string | undefined,
	thumbnailCdnURL?: string | undefined,
	alt?: string | undefined
};
	["MediaConnection"]: {
		items: Array<ModelTypes["MediaResponse"] | undefined>,
	pageInfo?: ModelTypes["PageInfo"] | undefined
};
	["MediaParamsInput"]: {
	model?: string | undefined,
	search?: string | undefined,
	page?: ModelTypes["PageInput"] | undefined
};
	["UploadFileInput"]: {
	key: string,
	prefix?: string | undefined,
	alt?: string | undefined
};
	["UploadFileResponseBase"]: {
		key: string,
	putURL: string,
	cdnURL: string,
	alt?: string | undefined
};
	["ImageUploadResponse"]: {
		file: ModelTypes["UploadFileResponseBase"],
	thumbnail: ModelTypes["UploadFileResponseBase"]
};
	["InputCMSField"]: {
	name: string,
	type: ModelTypes["CMSType"],
	list?: boolean | undefined,
	options?: Array<string> | undefined,
	relation?: string | undefined,
	builtIn?: boolean | undefined,
	fields?: Array<ModelTypes["InputCMSField"]> | undefined
};
	["ApiKey"]: {
		name: string,
	createdAt: string,
	_id: ModelTypes["ObjectId"],
	value: string
};
	["Languages"]:Languages;
	["BackupFile"]:any;
	["AdminQuery"]: {
		analytics?: Array<ModelTypes["AnalyticsResponse"]> | undefined,
	backup?: boolean | undefined,
	backups?: Array<ModelTypes["MediaResponse"]> | undefined,
	apiKeys?: Array<ModelTypes["ApiKey"]> | undefined
};
	["TranslateDocumentResponse"]: {
		result: string,
	usedTokens: number
};
	["Mutation"]: {
		admin?: ModelTypes["AdminMutation"] | undefined
};
	["CMSType"]:CMSType;
	["Query"]: {
		navigation?: Array<ModelTypes["ModelNavigation"]> | undefined,
	rootParams?: Array<ModelTypes["RootCMSParam"]> | undefined,
	admin?: ModelTypes["AdminQuery"] | undefined,
	isLoggedIn?: boolean | undefined,
	logoURL?: string | undefined,
	listhomepage?: Array<ModelTypes["homepage"]> | undefined,
	listPaginatedhomepage?: ModelTypes["homepage__Connection"] | undefined,
	onehomepageBySlug?: ModelTypes["homepage"] | undefined,
	variantshomepageBySlug?: Array<ModelTypes["homepage"]> | undefined,
	fieldSethomepage: string,
	modelhomepage: ModelTypes["ModelNavigationCompiled"],
	listmodel_jarka?: Array<ModelTypes["model_jarka"]> | undefined,
	listPaginatedmodel_jarka?: ModelTypes["model_jarka__Connection"] | undefined,
	onemodel_jarkaBySlug?: ModelTypes["model_jarka"] | undefined,
	variantsmodel_jarkaBySlug?: Array<ModelTypes["model_jarka"]> | undefined,
	fieldSetmodel_jarka: string,
	modelmodel_jarka: ModelTypes["ModelNavigationCompiled"],
	listo_nas?: Array<ModelTypes["o_nas"]> | undefined,
	listPaginatedo_nas?: ModelTypes["o_nas__Connection"] | undefined,
	oneo_nasBySlug?: ModelTypes["o_nas"] | undefined,
	variantso_nasBySlug?: Array<ModelTypes["o_nas"]> | undefined,
	fieldSeto_nas: string,
	modelo_nas: ModelTypes["ModelNavigationCompiled"],
	listtestmodel?: Array<ModelTypes["testmodel"]> | undefined,
	listPaginatedtestmodel?: ModelTypes["testmodel__Connection"] | undefined,
	onetestmodelBySlug?: ModelTypes["testmodel"] | undefined,
	variantstestmodelBySlug?: Array<ModelTypes["testmodel"]> | undefined,
	fieldSettestmodel: string,
	modeltestmodel: ModelTypes["ModelNavigationCompiled"],
	listtestqa?: Array<ModelTypes["testqa"]> | undefined,
	listPaginatedtestqa?: ModelTypes["testqa__Connection"] | undefined,
	onetestqaBySlug?: ModelTypes["testqa"] | undefined,
	variantstestqaBySlug?: Array<ModelTypes["testqa"]> | undefined,
	fieldSettestqa: string,
	modeltestqa: ModelTypes["ModelNavigationCompiled"],
	listtext_page?: Array<ModelTypes["text_page"]> | undefined,
	listPaginatedtext_page?: ModelTypes["text_page__Connection"] | undefined,
	onetext_pageBySlug?: ModelTypes["text_page"] | undefined,
	variantstext_pageBySlug?: Array<ModelTypes["text_page"]> | undefined,
	fieldSettext_page: string,
	modeltext_page: ModelTypes["ModelNavigationCompiled"],
	mediaQuery: ModelTypes["MediaConnection"],
	filesQuery: ModelTypes["FileConnection"]
};
	["AdminMutation"]: {
		upsertModel?: boolean | undefined,
	removeModel?: boolean | undefined,
	upsertParam?: boolean | undefined,
	removeParam?: boolean | undefined,
	uploadFile?: ModelTypes["UploadFileResponseBase"] | undefined,
	uploadImage?: ModelTypes["ImageUploadResponse"] | undefined,
	removeFiles?: boolean | undefined,
	restore?: boolean | undefined,
	generateApiKey?: boolean | undefined,
	revokeApiKey?: boolean | undefined,
	translateDocument: ModelTypes["TranslateDocumentResponse"],
	changeLogo?: boolean | undefined,
	removeLogo?: boolean | undefined,
	upserthomepage?: boolean | undefined,
	removehomepage?: boolean | undefined,
	upsertmodel_jarka?: boolean | undefined,
	removemodel_jarka?: boolean | undefined,
	upserto_nas?: boolean | undefined,
	removeo_nas?: boolean | undefined,
	upserttestmodel?: boolean | undefined,
	removetestmodel?: boolean | undefined,
	upserttestqa?: boolean | undefined,
	removetestqa?: boolean | undefined,
	upserttext_page?: boolean | undefined,
	removetext_page?: boolean | undefined
};
	["homepageTestobjTestinsideobj"]: {
		_version?: ModelTypes["VersionField"] | undefined,
	deepfield?: string | undefined
};
	["homepageTestobjTestinsideobj__Connection"]: {
		items?: Array<ModelTypes["homepageTestobjTestinsideobj"]> | undefined,
	pageInfo: ModelTypes["PageInfo"]
};
	["homepageTestobj"]: {
		_version?: ModelTypes["VersionField"] | undefined,
	testfield?: string | undefined,
	testinsideobj?: ModelTypes["homepageTestobjTestinsideobj"] | undefined
};
	["homepageTestobj__Connection"]: {
		items?: Array<ModelTypes["homepageTestobj"]> | undefined,
	pageInfo: ModelTypes["PageInfo"]
};
	["homepage"]: {
		_version?: ModelTypes["VersionField"] | undefined,
	tytul?: string | undefined,
	edycja_nazwy?: string | undefined,
	testowe?: ModelTypes["ImageField"] | undefined,
	testobj?: ModelTypes["homepageTestobj"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["homepage__Connection"]: {
		items?: Array<ModelTypes["homepage"]> | undefined,
	pageInfo: ModelTypes["PageInfo"]
};
	["model_jarkaDetails"]: {
		_version?: ModelTypes["VersionField"] | undefined,
	size?: string | undefined,
	tags?: Array<string | undefined> | undefined,
	weight?: number | undefined
};
	["model_jarkaDetails__Connection"]: {
		items?: Array<ModelTypes["model_jarkaDetails"]> | undefined,
	pageInfo: ModelTypes["PageInfo"]
};
	["model_jarka"]: {
		_version?: ModelTypes["VersionField"] | undefined,
	title?: string | undefined,
	description?: string | undefined,
	content?: string | undefined,
	thumbnail?: ModelTypes["ImageField"] | undefined,
	details?: ModelTypes["model_jarkaDetails"] | undefined,
	attachments?: Array<ModelTypes["S3Scalar"] | undefined> | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["model_jarka__Connection"]: {
		items?: Array<ModelTypes["model_jarka"]> | undefined,
	pageInfo: ModelTypes["PageInfo"]
};
	["o_nas"]: {
		_version?: ModelTypes["VersionField"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["o_nas__Connection"]: {
		items?: Array<ModelTypes["o_nas"]> | undefined,
	pageInfo: ModelTypes["PageInfo"]
};
	["testmodel"]: {
		_version?: ModelTypes["VersionField"] | undefined,
	title?: string | undefined,
	num?: Array<number | undefined> | undefined,
	tete?: string | undefined,
	testimage?: ModelTypes["ImageField"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["testmodel__Connection"]: {
		items?: Array<ModelTypes["testmodel"]> | undefined,
	pageInfo: ModelTypes["PageInfo"]
};
	["testqa"]: {
		_version?: ModelTypes["VersionField"] | undefined,
	test?: string | undefined,
	test2?: number | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["testqa__Connection"]: {
		items?: Array<ModelTypes["testqa"]> | undefined,
	pageInfo: ModelTypes["PageInfo"]
};
	["text_page"]: {
		_version?: ModelTypes["VersionField"] | undefined,
	content?: string | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["text_page__Connection"]: {
		items?: Array<ModelTypes["text_page"]> | undefined,
	pageInfo: ModelTypes["PageInfo"]
};
	["ModifyhomepageTestobjTestinsideobj"]: {
	_version?: ModelTypes["ModifyVersion"] | undefined,
	deepfield?: string | undefined
};
	["ModifyhomepageTestobj"]: {
	_version?: ModelTypes["ModifyVersion"] | undefined,
	testfield?: string | undefined,
	testinsideobj?: ModelTypes["ModifyhomepageTestobjTestinsideobj"] | undefined
};
	["Modifyhomepage"]: {
	_version?: ModelTypes["ModifyVersion"] | undefined,
	tytul?: string | undefined,
	edycja_nazwy?: string | undefined,
	testowe?: ModelTypes["ImageFieldInput"] | undefined,
	testobj?: ModelTypes["ModifyhomepageTestobj"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["Modifymodel_jarkaDetails"]: {
	_version?: ModelTypes["ModifyVersion"] | undefined,
	size?: string | undefined,
	tags?: Array<string | undefined> | undefined,
	weight?: number | undefined
};
	["Modifymodel_jarka"]: {
	_version?: ModelTypes["ModifyVersion"] | undefined,
	title?: string | undefined,
	description?: string | undefined,
	content?: string | undefined,
	thumbnail?: ModelTypes["ImageFieldInput"] | undefined,
	details?: ModelTypes["Modifymodel_jarkaDetails"] | undefined,
	attachments?: Array<ModelTypes["S3Scalar"] | undefined> | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["Modifyo_nas"]: {
	_version?: ModelTypes["ModifyVersion"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["Modifytestmodel"]: {
	_version?: ModelTypes["ModifyVersion"] | undefined,
	title?: string | undefined,
	num?: Array<number | undefined> | undefined,
	tete?: string | undefined,
	testimage?: ModelTypes["ImageFieldInput"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["Modifytestqa"]: {
	_version?: ModelTypes["ModifyVersion"] | undefined,
	test?: string | undefined,
	test2?: number | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["Modifytext_page"]: {
	_version?: ModelTypes["ModifyVersion"] | undefined,
	content?: string | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["RootParamsInput"]: {
	_version?: string | undefined,
	locales?: string | undefined
};
	["CMSModelTypes"]:CMSModelTypes;
	["schema"]: {
	query?: ModelTypes["Query"] | undefined,
	mutation?: ModelTypes["Mutation"] | undefined
}
    }

export type GraphQLTypes = {
    ["ObjectId"]: "scalar" & { name: "ObjectId" };
	["S3Scalar"]: "scalar" & { name: "S3Scalar" };
	["Timestamp"]: "scalar" & { name: "Timestamp" };
	["ModelNavigationCompiled"]: "scalar" & { name: "ModelNavigationCompiled" };
	["VersionField"]: {
	__typename: "VersionField",
	name: string,
	from?: GraphQLTypes["Timestamp"] | undefined,
	to?: GraphQLTypes["Timestamp"] | undefined
};
	["ImageField"]: {
	__typename: "ImageField",
	url?: GraphQLTypes["S3Scalar"] | undefined,
	thumbnail?: GraphQLTypes["S3Scalar"] | undefined,
	alt?: string | undefined
};
	["RootCMSParam"]: {
	__typename: "RootCMSParam",
	name: string,
	options: Array<string>
};
	["ModelNavigation"]: {
	__typename: "ModelNavigation",
	name: string,
	display: string,
	fields: Array<GraphQLTypes["CMSField"]>,
	fieldSet: string
};
	["CMSField"]: {
	__typename: "CMSField",
	name: string,
	type: GraphQLTypes["CMSType"],
	list?: boolean | undefined,
	options?: Array<string> | undefined,
	relation?: string | undefined,
	fields?: Array<GraphQLTypes["CMSField"]> | undefined,
	builtIn?: boolean | undefined
};
	["PageInfo"]: {
	__typename: "PageInfo",
	total: number,
	hasNext?: boolean | undefined
};
	["PageInput"]: {
		limit: number,
	start?: number | undefined
};
	["ModifyVersion"]: {
		name?: string | undefined,
	from?: GraphQLTypes["Timestamp"] | undefined,
	to?: GraphQLTypes["Timestamp"] | undefined
};
	["ImageFieldInput"]: {
		thumbnail?: GraphQLTypes["S3Scalar"] | undefined,
	url?: GraphQLTypes["S3Scalar"] | undefined,
	alt?: string | undefined
};
	["AnalyticsResponse"]: {
	__typename: "AnalyticsResponse",
	date?: string | undefined,
	value?: Array<GraphQLTypes["AnalyticsModelResponse"]> | undefined
};
	["AnalyticsModelResponse"]: {
	__typename: "AnalyticsModelResponse",
	modelName: string,
	calls: number,
	rootParamsKey?: string | undefined
};
	["CreateRootCMSParam"]: {
		name: string,
	options: Array<string>
};
	["FileResponse"]: {
	__typename: "FileResponse",
	key: string,
	cdnURL: string
};
	["FileConnection"]: {
	__typename: "FileConnection",
	items: Array<GraphQLTypes["FileResponse"] | undefined>,
	pageInfo?: GraphQLTypes["PageInfo"] | undefined
};
	["MediaResponse"]: {
	__typename: "MediaResponse",
	key?: string | undefined,
	cdnURL?: string | undefined,
	thumbnailCdnURL?: string | undefined,
	alt?: string | undefined
};
	["MediaConnection"]: {
	__typename: "MediaConnection",
	items: Array<GraphQLTypes["MediaResponse"] | undefined>,
	pageInfo?: GraphQLTypes["PageInfo"] | undefined
};
	["MediaParamsInput"]: {
		model?: string | undefined,
	search?: string | undefined,
	page?: GraphQLTypes["PageInput"] | undefined
};
	["UploadFileInput"]: {
		key: string,
	prefix?: string | undefined,
	alt?: string | undefined
};
	["UploadFileResponseBase"]: {
	__typename: "UploadFileResponseBase",
	key: string,
	putURL: string,
	cdnURL: string,
	alt?: string | undefined
};
	["ImageUploadResponse"]: {
	__typename: "ImageUploadResponse",
	file: GraphQLTypes["UploadFileResponseBase"],
	thumbnail: GraphQLTypes["UploadFileResponseBase"]
};
	["InputCMSField"]: {
		name: string,
	type: GraphQLTypes["CMSType"],
	list?: boolean | undefined,
	options?: Array<string> | undefined,
	relation?: string | undefined,
	builtIn?: boolean | undefined,
	fields?: Array<GraphQLTypes["InputCMSField"]> | undefined
};
	["ApiKey"]: {
	__typename: "ApiKey",
	name: string,
	createdAt: string,
	_id: GraphQLTypes["ObjectId"],
	value: string
};
	["Languages"]: Languages;
	["BackupFile"]: "scalar" & { name: "BackupFile" };
	["AdminQuery"]: {
	__typename: "AdminQuery",
	analytics?: Array<GraphQLTypes["AnalyticsResponse"]> | undefined,
	backup?: boolean | undefined,
	backups?: Array<GraphQLTypes["MediaResponse"]> | undefined,
	apiKeys?: Array<GraphQLTypes["ApiKey"]> | undefined
};
	["TranslateDocumentResponse"]: {
	__typename: "TranslateDocumentResponse",
	result: string,
	usedTokens: number
};
	["Mutation"]: {
	__typename: "Mutation",
	admin?: GraphQLTypes["AdminMutation"] | undefined
};
	/** This enum is defined externally and injected via federation */
["CMSType"]: CMSType;
	["Query"]: {
	__typename: "Query",
	navigation?: Array<GraphQLTypes["ModelNavigation"]> | undefined,
	rootParams?: Array<GraphQLTypes["RootCMSParam"]> | undefined,
	admin?: GraphQLTypes["AdminQuery"] | undefined,
	isLoggedIn?: boolean | undefined,
	logoURL?: string | undefined,
	listhomepage?: Array<GraphQLTypes["homepage"]> | undefined,
	listPaginatedhomepage?: GraphQLTypes["homepage__Connection"] | undefined,
	onehomepageBySlug?: GraphQLTypes["homepage"] | undefined,
	variantshomepageBySlug?: Array<GraphQLTypes["homepage"]> | undefined,
	fieldSethomepage: string,
	modelhomepage: GraphQLTypes["ModelNavigationCompiled"],
	listmodel_jarka?: Array<GraphQLTypes["model_jarka"]> | undefined,
	listPaginatedmodel_jarka?: GraphQLTypes["model_jarka__Connection"] | undefined,
	onemodel_jarkaBySlug?: GraphQLTypes["model_jarka"] | undefined,
	variantsmodel_jarkaBySlug?: Array<GraphQLTypes["model_jarka"]> | undefined,
	fieldSetmodel_jarka: string,
	modelmodel_jarka: GraphQLTypes["ModelNavigationCompiled"],
	listo_nas?: Array<GraphQLTypes["o_nas"]> | undefined,
	listPaginatedo_nas?: GraphQLTypes["o_nas__Connection"] | undefined,
	oneo_nasBySlug?: GraphQLTypes["o_nas"] | undefined,
	variantso_nasBySlug?: Array<GraphQLTypes["o_nas"]> | undefined,
	fieldSeto_nas: string,
	modelo_nas: GraphQLTypes["ModelNavigationCompiled"],
	listtestmodel?: Array<GraphQLTypes["testmodel"]> | undefined,
	listPaginatedtestmodel?: GraphQLTypes["testmodel__Connection"] | undefined,
	onetestmodelBySlug?: GraphQLTypes["testmodel"] | undefined,
	variantstestmodelBySlug?: Array<GraphQLTypes["testmodel"]> | undefined,
	fieldSettestmodel: string,
	modeltestmodel: GraphQLTypes["ModelNavigationCompiled"],
	listtestqa?: Array<GraphQLTypes["testqa"]> | undefined,
	listPaginatedtestqa?: GraphQLTypes["testqa__Connection"] | undefined,
	onetestqaBySlug?: GraphQLTypes["testqa"] | undefined,
	variantstestqaBySlug?: Array<GraphQLTypes["testqa"]> | undefined,
	fieldSettestqa: string,
	modeltestqa: GraphQLTypes["ModelNavigationCompiled"],
	listtext_page?: Array<GraphQLTypes["text_page"]> | undefined,
	listPaginatedtext_page?: GraphQLTypes["text_page__Connection"] | undefined,
	onetext_pageBySlug?: GraphQLTypes["text_page"] | undefined,
	variantstext_pageBySlug?: Array<GraphQLTypes["text_page"]> | undefined,
	fieldSettext_page: string,
	modeltext_page: GraphQLTypes["ModelNavigationCompiled"],
	mediaQuery: GraphQLTypes["MediaConnection"],
	filesQuery: GraphQLTypes["FileConnection"]
};
	["AdminMutation"]: {
	__typename: "AdminMutation",
	upsertModel?: boolean | undefined,
	removeModel?: boolean | undefined,
	upsertParam?: boolean | undefined,
	removeParam?: boolean | undefined,
	uploadFile?: GraphQLTypes["UploadFileResponseBase"] | undefined,
	uploadImage?: GraphQLTypes["ImageUploadResponse"] | undefined,
	removeFiles?: boolean | undefined,
	restore?: boolean | undefined,
	generateApiKey?: boolean | undefined,
	revokeApiKey?: boolean | undefined,
	translateDocument: GraphQLTypes["TranslateDocumentResponse"],
	changeLogo?: boolean | undefined,
	removeLogo?: boolean | undefined,
	upserthomepage?: boolean | undefined,
	removehomepage?: boolean | undefined,
	upsertmodel_jarka?: boolean | undefined,
	removemodel_jarka?: boolean | undefined,
	upserto_nas?: boolean | undefined,
	removeo_nas?: boolean | undefined,
	upserttestmodel?: boolean | undefined,
	removetestmodel?: boolean | undefined,
	upserttestqa?: boolean | undefined,
	removetestqa?: boolean | undefined,
	upserttext_page?: boolean | undefined,
	removetext_page?: boolean | undefined
};
	["homepageTestobjTestinsideobj"]: {
	__typename: "homepageTestobjTestinsideobj",
	_version?: GraphQLTypes["VersionField"] | undefined,
	deepfield?: string | undefined
};
	["homepageTestobjTestinsideobj__Connection"]: {
	__typename: "homepageTestobjTestinsideobj__Connection",
	items?: Array<GraphQLTypes["homepageTestobjTestinsideobj"]> | undefined,
	pageInfo: GraphQLTypes["PageInfo"]
};
	["homepageTestobj"]: {
	__typename: "homepageTestobj",
	_version?: GraphQLTypes["VersionField"] | undefined,
	testfield?: string | undefined,
	testinsideobj?: GraphQLTypes["homepageTestobjTestinsideobj"] | undefined
};
	["homepageTestobj__Connection"]: {
	__typename: "homepageTestobj__Connection",
	items?: Array<GraphQLTypes["homepageTestobj"]> | undefined,
	pageInfo: GraphQLTypes["PageInfo"]
};
	["homepage"]: {
	__typename: "homepage",
	_version?: GraphQLTypes["VersionField"] | undefined,
	tytul?: string | undefined,
	edycja_nazwy?: string | undefined,
	testowe?: GraphQLTypes["ImageField"] | undefined,
	testobj?: GraphQLTypes["homepageTestobj"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["homepage__Connection"]: {
	__typename: "homepage__Connection",
	items?: Array<GraphQLTypes["homepage"]> | undefined,
	pageInfo: GraphQLTypes["PageInfo"]
};
	["model_jarkaDetails"]: {
	__typename: "model_jarkaDetails",
	_version?: GraphQLTypes["VersionField"] | undefined,
	size?: string | undefined,
	tags?: Array<string | undefined> | undefined,
	weight?: number | undefined
};
	["model_jarkaDetails__Connection"]: {
	__typename: "model_jarkaDetails__Connection",
	items?: Array<GraphQLTypes["model_jarkaDetails"]> | undefined,
	pageInfo: GraphQLTypes["PageInfo"]
};
	["model_jarka"]: {
	__typename: "model_jarka",
	_version?: GraphQLTypes["VersionField"] | undefined,
	title?: string | undefined,
	description?: string | undefined,
	content?: string | undefined,
	thumbnail?: GraphQLTypes["ImageField"] | undefined,
	details?: GraphQLTypes["model_jarkaDetails"] | undefined,
	attachments?: Array<GraphQLTypes["S3Scalar"] | undefined> | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["model_jarka__Connection"]: {
	__typename: "model_jarka__Connection",
	items?: Array<GraphQLTypes["model_jarka"]> | undefined,
	pageInfo: GraphQLTypes["PageInfo"]
};
	["o_nas"]: {
	__typename: "o_nas",
	_version?: GraphQLTypes["VersionField"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["o_nas__Connection"]: {
	__typename: "o_nas__Connection",
	items?: Array<GraphQLTypes["o_nas"]> | undefined,
	pageInfo: GraphQLTypes["PageInfo"]
};
	["testmodel"]: {
	__typename: "testmodel",
	_version?: GraphQLTypes["VersionField"] | undefined,
	title?: string | undefined,
	num?: Array<number | undefined> | undefined,
	tete?: string | undefined,
	testimage?: GraphQLTypes["ImageField"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["testmodel__Connection"]: {
	__typename: "testmodel__Connection",
	items?: Array<GraphQLTypes["testmodel"]> | undefined,
	pageInfo: GraphQLTypes["PageInfo"]
};
	["testqa"]: {
	__typename: "testqa",
	_version?: GraphQLTypes["VersionField"] | undefined,
	test?: string | undefined,
	test2?: number | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["testqa__Connection"]: {
	__typename: "testqa__Connection",
	items?: Array<GraphQLTypes["testqa"]> | undefined,
	pageInfo: GraphQLTypes["PageInfo"]
};
	["text_page"]: {
	__typename: "text_page",
	_version?: GraphQLTypes["VersionField"] | undefined,
	content?: string | undefined,
	locales?: string | undefined,
	slug?: string | undefined,
	_id: string
};
	["text_page__Connection"]: {
	__typename: "text_page__Connection",
	items?: Array<GraphQLTypes["text_page"]> | undefined,
	pageInfo: GraphQLTypes["PageInfo"]
};
	["ModifyhomepageTestobjTestinsideobj"]: {
		_version?: GraphQLTypes["ModifyVersion"] | undefined,
	deepfield?: string | undefined
};
	["ModifyhomepageTestobj"]: {
		_version?: GraphQLTypes["ModifyVersion"] | undefined,
	testfield?: string | undefined,
	testinsideobj?: GraphQLTypes["ModifyhomepageTestobjTestinsideobj"] | undefined
};
	["Modifyhomepage"]: {
		_version?: GraphQLTypes["ModifyVersion"] | undefined,
	tytul?: string | undefined,
	edycja_nazwy?: string | undefined,
	testowe?: GraphQLTypes["ImageFieldInput"] | undefined,
	testobj?: GraphQLTypes["ModifyhomepageTestobj"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["Modifymodel_jarkaDetails"]: {
		_version?: GraphQLTypes["ModifyVersion"] | undefined,
	size?: string | undefined,
	tags?: Array<string | undefined> | undefined,
	weight?: number | undefined
};
	["Modifymodel_jarka"]: {
		_version?: GraphQLTypes["ModifyVersion"] | undefined,
	title?: string | undefined,
	description?: string | undefined,
	content?: string | undefined,
	thumbnail?: GraphQLTypes["ImageFieldInput"] | undefined,
	details?: GraphQLTypes["Modifymodel_jarkaDetails"] | undefined,
	attachments?: Array<GraphQLTypes["S3Scalar"] | undefined> | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["Modifyo_nas"]: {
		_version?: GraphQLTypes["ModifyVersion"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["Modifytestmodel"]: {
		_version?: GraphQLTypes["ModifyVersion"] | undefined,
	title?: string | undefined,
	num?: Array<number | undefined> | undefined,
	tete?: string | undefined,
	testimage?: GraphQLTypes["ImageFieldInput"] | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["Modifytestqa"]: {
		_version?: GraphQLTypes["ModifyVersion"] | undefined,
	test?: string | undefined,
	test2?: number | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["Modifytext_page"]: {
		_version?: GraphQLTypes["ModifyVersion"] | undefined,
	content?: string | undefined,
	locales?: string | undefined,
	slug?: string | undefined
};
	["RootParamsInput"]: {
		_version?: string | undefined,
	locales?: string | undefined
};
	["CMSModelTypes"]: CMSModelTypes
    }
export const enum Languages {
	CS = "CS",
	RU = "RU",
	ET = "ET",
	ES = "ES",
	ZH = "ZH",
	SK = "SK",
	SL = "SL",
	IT = "IT",
	JA = "JA",
	ID = "ID",
	SV = "SV",
	KO = "KO",
	TR = "TR",
	PT = "PT",
	EL = "EL",
	DA = "DA",
	FR = "FR",
	BG = "BG",
	LT = "LT",
	DE = "DE",
	EN = "EN",
	LV = "LV",
	NB = "NB",
	NL = "NL",
	PL = "PL",
	FI = "FI",
	UK = "UK",
	RO = "RO",
	HU = "HU"
}
/** This enum is defined externally and injected via federation */
export const enum CMSType {
	STRING = "STRING",
	TITLE = "TITLE",
	NUMBER = "NUMBER",
	BOOLEAN = "BOOLEAN",
	DATE = "DATE",
	IMAGE = "IMAGE",
	CONTENT = "CONTENT",
	ERROR = "ERROR",
	IMAGE_URL = "IMAGE_URL",
	FILE = "FILE",
	RELATION = "RELATION",
	SELECT = "SELECT",
	OBJECT = "OBJECT",
	OBJECT_TABS = "OBJECT_TABS"
}
export const enum CMSModelTypes {
	homepage = "homepage",
	model_jarka = "model_jarka",
	o_nas = "o_nas",
	testmodel = "testmodel",
	testqa = "testqa",
	text_page = "text_page"
}

type ZEUS_VARIABLES = {
	["ObjectId"]: ValueTypes["ObjectId"];
	["S3Scalar"]: ValueTypes["S3Scalar"];
	["Timestamp"]: ValueTypes["Timestamp"];
	["ModelNavigationCompiled"]: ValueTypes["ModelNavigationCompiled"];
	["PageInput"]: ValueTypes["PageInput"];
	["ModifyVersion"]: ValueTypes["ModifyVersion"];
	["ImageFieldInput"]: ValueTypes["ImageFieldInput"];
	["CreateRootCMSParam"]: ValueTypes["CreateRootCMSParam"];
	["MediaParamsInput"]: ValueTypes["MediaParamsInput"];
	["UploadFileInput"]: ValueTypes["UploadFileInput"];
	["InputCMSField"]: ValueTypes["InputCMSField"];
	["Languages"]: ValueTypes["Languages"];
	["BackupFile"]: ValueTypes["BackupFile"];
	["CMSType"]: ValueTypes["CMSType"];
	["ModifyhomepageTestobjTestinsideobj"]: ValueTypes["ModifyhomepageTestobjTestinsideobj"];
	["ModifyhomepageTestobj"]: ValueTypes["ModifyhomepageTestobj"];
	["Modifyhomepage"]: ValueTypes["Modifyhomepage"];
	["Modifymodel_jarkaDetails"]: ValueTypes["Modifymodel_jarkaDetails"];
	["Modifymodel_jarka"]: ValueTypes["Modifymodel_jarka"];
	["Modifyo_nas"]: ValueTypes["Modifyo_nas"];
	["Modifytestmodel"]: ValueTypes["Modifytestmodel"];
	["Modifytestqa"]: ValueTypes["Modifytestqa"];
	["Modifytext_page"]: ValueTypes["Modifytext_page"];
	["RootParamsInput"]: ValueTypes["RootParamsInput"];
	["CMSModelTypes"]: ValueTypes["CMSModelTypes"];
}