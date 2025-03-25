import { DefaultCurrencyInput } from '@/custom_fields/DefaultInputs/DefaultCurrencyInput.js';
import React from 'react';

export const defaultInputComponents = {
    'currency-form-input': DefaultCurrencyInput,
    'facet-value-form-input': () => <></>,
    //   <FacetsSelector
    //     value={JSON.parse(action?.arguments[i].value)}
    //     onChange={(e) => {
    //       action.arguments[i] = { name: argument?.name || '', value: JSON.stringify(e) };
    //       handleActionsValueChange(index, action?.code, action.arguments);
    //     }}
    //   />
    'product-selector-form-input': () => <></>,
    //   <VariantsSelector
    //     type={argument?.ui?.selectionMode as 'variant' | 'product'}
    //     label={argument?.label || t(`actions.labels.${argument.name}`)}
    //     value={JSON.parse(action?.arguments[i].value)}
    //     onChange={(e) => {
    //       action.arguments[i] = { name: argument?.name || '', value: JSON.stringify(e) };
    //       handleActionsValueChange(index, action?.code, action.arguments);
    //     }}
    //     singleSelection
    //   />
    'customer-group-form-input': () => <></>,
    //   <CustomerGroupsSelector
    //     key={i}
    //     label={argument?.label || t(`conditions.labels.${argument.name}`)}
    //     value={condition?.arguments[i].value}
    //     onChange={(e) => {
    //       condition.arguments[i] = { name: argument?.name || '', value: e };
    //       handleConditionsValueChange(index, condition?.code, condition.arguments);
    //     }}
    //   />
};
