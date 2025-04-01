import React from 'react';
import { CardDescription, Label } from '@/components';
import { useCustomFields } from '@/custom_fields/context';
import { RichTextEditor } from '@/universal_components/index.js';
import { capitalizeFirstLetter, camelCaseToSpaces } from '@/utils';

export function DefaultRichText() {
    const { field, value, setValue, label, description, disabled } = useCustomFields<string>();

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={field?.name}>
                {label || capitalizeFirstLetter(camelCaseToSpaces(field?.name))}
            </Label>
            <CardDescription>{description}</CardDescription>
            <RichTextEditor
                content={value as string}
                onContentChanged={e => setValue(e)}
                disabled={disabled ?? field?.readonly ?? undefined}
            />
        </div>
    );
}
