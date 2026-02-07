import { ModelTypes as DefaultModelTypes } from "@deenruv/admin-types";
import { useCallback, useMemo, useState } from "react";

export type GFFLPFormField<T> = {
  initialValue?: T;
  value: T;
} & (
  | { errors: never; validatedValue: T }
  | { errors: string[]; validatedValue: never }
);

interface GFFLPFieldConfig<T> {
  validate?: (value: T) => string[] | void;
  initialValue?: T;
}

/**
 * Create a clean field-state object. Single source of truth — avoids leaking
 * config metadata (`validate`) into runtime state.
 */
function createFieldState<T>(
  value: T,
  initialValue: T | undefined,
  errors: string[] | void,
): GFFLPFormField<T> {
  if (errors && errors.length > 0) {
    return { value, initialValue, errors } as GFFLPFormField<T>;
  }
  return { value, initialValue, validatedValue: value } as GFFLPFormField<T>;
}

/**
 * Validate a value against a field config and return a clean field-state.
 */
function validateAndCreateField<T>(
  value: T,
  initialValue: T | undefined,
  fieldConfig: GFFLPFieldConfig<T> | undefined,
): GFFLPFormField<T> {
  const errors = fieldConfig?.validate?.(value);
  return createFieldState(value, initialValue, errors);
}

/**
 * Build the initial state object from config, using only `value` and
 * `initialValue` (no config-spread leakage).
 */
function buildInitialState<X>(config: {
  [K in keyof X]?: GFFLPFieldConfig<X[K]>;
}): Partial<{ [K in keyof X]: GFFLPFormField<X[K]> }> {
  return Object.fromEntries(
    Object.keys(config).map((k) => {
      const key = k as keyof X;
      const initial = config[key]?.initialValue as X[keyof X];
      return [k, createFieldState(initial, initial, undefined)];
    }),
  ) as Partial<{ [K in keyof X]: GFFLPFormField<X[K]> }>;
}

export const useGFFLP = <
  T extends keyof MT,
  Z extends keyof MT[T],
  MT = DefaultModelTypes,
>(
  _key: T,
  ..._pick: Z[]
) => useFFLP<Pick<MT[T], Z>>;

/**
 * @deprecated Use `useGFFLP` instead. This alias exists only for typo
 * compatibility and will be removed in a future major version.
 */
export const useGLFFP = useGFFLP;

export const useFFLP = <X>(config: {
  [K in keyof X]?: GFFLPFieldConfig<X[K]>;
}) => {
  const [state, _setState] = useState<
    Partial<{ [K in keyof X]: GFFLPFormField<X[K]> }>
  >(buildInitialState(config));

  const setField = useCallback(
    <F extends keyof X>(field: F, value: X[F]) => {
      _setState((prevState) => {
        const fullPath = (field as string).split(".");
        if (fullPath.length > 1) {
          const [parentField, childField] = fullPath;
          const parentKey = parentField as keyof X;
          const existing = prevState[parentKey];
          const parentValue = existing?.value;
          const parentInitialValue = existing?.initialValue;
          const parentValidatedValue = existing?.validatedValue;
          const parentErrors = existing?.errors;

          // Plain nested value update — the child value is set directly,
          // not wrapped in `{ value }`.
          const updatedParentField = {
            value: { ...parentValue, [childField]: value },
            initialValue: { ...parentInitialValue, [childField]: value },
            errors: parentErrors,
            validatedValue: parentValidatedValue
              ? { ...parentValidatedValue, [childField]: value }
              : undefined,
          };
          return { ...prevState, [parentField]: updatedParentField };
        } else {
          const initialValue = prevState[field]?.initialValue;

          let updatedValue = value;
          if (field === ("customFields" as F)) {
            const existingValue = prevState[field]?.value || {};
            updatedValue = { ...existingValue, ...value } as X[F];
          }

          return {
            ...prevState,
            [field]: validateAndCreateField(
              updatedValue,
              initialValue,
              config[field],
            ),
          };
        }
      });
    },
    [config],
  );

  const checkIfAllFieldsAreValid: () => boolean = useCallback(() => {
    let isValid = true;
    _setState((prevState) => {
      let newState = { ...prevState };
      Object.keys(config).forEach((field) => {
        const fieldKey = field as keyof X;
        const existing = newState[fieldKey];
        const value = existing?.value as X[keyof X];
        const initialValue = existing?.initialValue;

        newState = {
          ...newState,
          [fieldKey]: validateAndCreateField(
            value,
            initialValue,
            config[fieldKey],
          ),
        };
      });
      isValid = !Object.keys(config).some(
        (field) =>
          config[field as keyof X]?.validate &&
          !newState[field as keyof X]?.validatedValue,
      );
      return newState;
    });
    return isValid;
  }, [config]);

  const haveValidFields = useMemo(
    () =>
      !Object.keys(config).some(
        (field) =>
          config[field as keyof X]?.validate &&
          state[field as keyof X]?.validatedValue == null,
      ),
    [config, state],
  );

  const setState = (value: X) => {
    _setState((prevState) => {
      let newState = { ...prevState };
      Object.keys(config).forEach((field) => {
        const fieldKey = field as keyof X;
        // Deterministic: process all configured fields regardless of
        // whether they already exist in prevState.
        const initialValue = prevState[fieldKey]?.initialValue;

        newState = {
          ...newState,
          [fieldKey]: validateAndCreateField(
            value[fieldKey],
            initialValue,
            config[fieldKey],
          ),
        };
      });
      return newState;
    });
  };

  const clearErrors = () =>
    _setState((prevState) => {
      let newState = { ...prevState };
      Object.keys(config).forEach((field) => {
        const fieldKey = field as keyof X;
        const existing = prevState[fieldKey];
        // Clear errors by marking the field as valid with its current value,
        // preserving a consistent state shape (validatedValue is set).
        newState = {
          ...newState,
          [fieldKey]: createFieldState(
            existing?.value as X[keyof X],
            existing?.initialValue,
            undefined,
          ),
        };
      });
      return newState;
    });

  const clearAllForm = () => {
    _setState(buildInitialState(config));
  };

  return {
    state,
    setState,
    setField,
    checkIfAllFieldsAreValid,
    haveValidFields,
    clearErrors,
    clearAllForm,
  };
};

export const setInArrayBy = <T>(
  list: T[],
  fn: (x: T) => boolean,
  element: T,
) => {
  const ll = list.find((e) => !fn(e));
  return list.filter((e) => fn(e)).concat({ ...ll, ...element });
};
