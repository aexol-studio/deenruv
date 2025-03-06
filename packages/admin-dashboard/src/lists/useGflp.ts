import { ModelTypes as DefaultModelTypes } from '@deenruv/admin-types';
import { useCallback, useMemo, useState } from 'react';

export type FormField<T> = {
  initialValue?: T;
  value: T;
} & ({ errors: never; validatedValue: T } | { errors: string[]; validatedValue: never });

export const useGFFLP = <T extends keyof MT, Z extends keyof MT[T], MT = DefaultModelTypes>(key: T, ...pick: Z[]) =>
  useFFLP<Pick<MT[T], Z>>;

export const useFFLP = <T extends Record<string, any>>(config: {
  [P in keyof T]?: {
    validate?: (o: T[P]) => string[] | void;
    initialValue?: T[P];
  };
}) => {
  type StateType = Partial<{ [P in keyof T]: FormField<T[P]> }>;
  const initializeState = useCallback(
    (): StateType =>
      Object.fromEntries(
        Object.entries(config).map(([key, value]) => [
          key,
          {
            value: value?.initialValue as T[keyof T],
            initialValue: value?.initialValue as T[keyof T],
          },
        ]),
      ) as StateType,
    [config],
  );

  const [state, setStateInternal] = useState<StateType>(initializeState);

  const setField = useCallback(
    <F extends keyof T>(field: F, value: T[F]) => {
      setStateInternal((prevState) => {
        const validate = config[field]?.validate;
        const errors = validate ? (validate(value) ?? []) : [];
        return {
          ...prevState,
          [field]: {
            value,
            initialValue: prevState[field]?.initialValue,
            ...(errors.length ? { errors } : { validatedValue: value }),
          } as FormField<T[F]>,
        };
      });
    },
    [config],
  );

  const checkIfAllFieldsAreValid = useCallback(() => {
    let allValid = true;
    setStateInternal((prevState) => {
      const newState = Object.keys(config).reduce(
        (acc, key) => {
          const field = key as keyof T;
          const value = prevState[field]?.value;
          const validate = config[field]?.validate;
          const errors = validate ? (validate(value as T[keyof T]) ?? []) : [];

          acc[field] = {
            value,
            initialValue: prevState[field]?.initialValue,
            ...(errors.length ? { errors } : { validatedValue: value }),
          } as FormField<T[keyof T]>;

          if (errors.length) allValid = false;
          return acc;
        },
        { ...prevState },
      );
      return newState;
    });
    return allValid;
  }, [config]);

  const haveValidFields = useMemo(
    () => Object.values(state).every((field) => field && 'validatedValue' in field),
    [state],
  );

  const setState = useCallback(
    (values: T) => {
      setStateInternal((prevState) =>
        Object.keys(config).reduce(
          (newState, key) => {
            const field = key as keyof T;
            const value = values[field];
            const validate = config[field]?.validate;
            const errors = validate ? (validate(value) ?? []) : [];

            newState[field] = {
              value,
              initialValue: prevState[field]?.initialValue,
              ...(errors.length ? { errors } : { validatedValue: value }),
            } as FormField<T[keyof T]>;
            return newState;
          },
          { ...prevState },
        ),
      );
    },
    [config],
  );

  const clearErrors = useCallback(() => {
    setStateInternal((prevState) =>
      Object.keys(prevState).reduce(
        (newState, key) => {
          const field = key as keyof T;
          newState[field] = { ...prevState[field], errors: [] } as FormField<T[keyof T]>;
          return newState;
        },
        { ...prevState },
      ),
    );
  }, []);

  return { state, setState, setField, checkIfAllFieldsAreValid, haveValidFields, clearErrors };
};

export const setInArrayBy = <T>(list: T[], fn: (x: T) => boolean, element: T) => {
  const ll = list.find((e) => !fn(e));
  return list
    .filter((e) => fn(e))
    .concat({
      ...ll,
      ...element,
    });
};
