import { ModelTypes as DefaultModelTypes } from '@deenruv/admin-types';
import { useCallback, useMemo, useState } from 'react';

export type GFFLPFormField<T> = {
    initialValue?: T;
    value: T;
} & ({ errors: never; validatedValue: T } | { errors: string[]; validatedValue: never });

interface GFFLPFieldConfig<T> {
    validate?: (value: T) => string[] | void;
    initialValue?: T;
}

export const useGFFLP = <T extends keyof MT, Z extends keyof MT[T], MT = DefaultModelTypes>(
    _key: T,
    ..._pick: Z[]
) => useFFLP<Pick<MT[T], Z>>;

export const useFFLP = <X>(config: {
    [K in keyof X]?: GFFLPFieldConfig<X[K]>;
}) => {
    const [state, _setState] = useState<Partial<{ [K in keyof X]: GFFLPFormField<X[K]> }>>({
        ...(Object.fromEntries(
            Object.keys(config).map(v => [
                v,
                { value: config[v as keyof X]?.initialValue as X[keyof X], ...config[v as keyof X] },
            ]),
        ) as Partial<{ [K in keyof X]: GFFLPFormField<X[K]> }>),
    });

    const setField = useCallback(
        <F extends keyof X>(field: F, value: X[F]) => {
            _setState(prevState => {
                const isToBeValidated = !!config[field]?.validate;
                const errors = config[field]?.validate?.(value);
                const initialValue = prevState[field]?.initialValue;
                const updatedField =
                    isToBeValidated && errors && errors.length > 0
                        ? ({ value, initialValue, errors } as GFFLPFormField<X[F]>)
                        : ({ value, initialValue, validatedValue: value } as GFFLPFormField<X[F]>);
                return { ...prevState, [field]: updatedField };
            });
        },
        [config],
    );

    const checkIfAllFieldsAreValid: () => boolean = useCallback(() => {
        let newState = { ...state };
        Object.keys(config).forEach(field => {
            const fieldKey = field as keyof X;
            const fieldValue = newState[fieldKey];
            if (fieldValue && fieldKey) {
                const isToBeValidated = !!config[fieldKey]?.validate;
                const isInvalid = config[fieldKey]?.validate?.(fieldValue.value);
                const initialValue = fieldValue.initialValue;
                const value = fieldValue.value;
                newState = {
                    ...newState,
                    [fieldKey]:
                        isToBeValidated && isInvalid && isInvalid.length > 0
                            ? { initialValue, value, errors: isInvalid }
                            : { initialValue, value, validatedValue: value },
                };
            }
        });
        _setState(newState);
        return !Object.keys(config).some(
            field => config[field as keyof X]?.validate && !newState[field as keyof X]?.validatedValue,
        );
    }, [config, state]);

    const haveValidFields = useMemo(
        () =>
            !Object.keys(config).some(
                field =>
                    config[field as keyof X]?.validate && state[field as keyof X]?.validatedValue == null,
            ),
        [config, state],
    );

    const setState = (value: X) => {
        _setState(prevState => {
            let newState = { ...prevState };
            Object.keys(config).forEach(field => {
                const fieldKey = field as keyof X;
                const fieldValue = newState[fieldKey];

                if (fieldValue && fieldKey) {
                    const isToBeValidated = !!config[fieldKey]?.validate;
                    const isInvalid = config[fieldKey]?.validate?.(value[fieldKey]);
                    const initialValue = fieldValue.initialValue;
                    newState = {
                        ...newState,
                        [fieldKey]:
                            isToBeValidated && isInvalid && isInvalid.length > 0
                                ? { initialValue, value: value[fieldKey], errors: isInvalid }
                                : { initialValue, value: value[fieldKey], validatedValue: value[fieldKey] },
                    };
                }
            });
            return newState;
        });
    };

    const clearErrors = () =>
        _setState(prevState => {
            let newState = { ...prevState };
            Object.keys(config).forEach(field => {
                const fieldKey = field as keyof X;
                const fieldValue = prevState[fieldKey];

                newState = {
                    ...newState,
                    [fieldKey]: {
                        initialValue: fieldValue?.initialValue,
                        value: fieldValue?.value,
                        errors: [],
                    },
                };
            });
            return newState;
        });

    const clearAllForm = () => {
        const clearForm = Object.fromEntries(
            Object.keys(config).map(v => [
                v,
                { value: config[v as keyof X]?.initialValue as X[keyof X], ...config[v as keyof X] },
            ]),
        ) as Partial<{ [K in keyof X]: GFFLPFormField<X[K]> }>;
        _setState(clearForm);
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

export const setInArrayBy = <T>(list: T[], fn: (x: T) => boolean, element: T) => {
    const ll = list.find(e => !fn(e));
    return list.filter(e => fn(e)).concat({ ...ll, ...element });
};
