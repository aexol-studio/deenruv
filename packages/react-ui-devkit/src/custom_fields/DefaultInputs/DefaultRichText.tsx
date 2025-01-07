import React from 'react';
import { CardDescription, Label } from '@/components';
import { useCustomFields } from '@/custom_fields/context';
import { RichTextEditor } from '@/components/molecules';

export function DefaultRichText() {
    const { field, value, setValue, label, description } = useCustomFields<'StringCustomFieldConfig'>();

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={field?.name}>{label || field?.name}</Label>
            <CardDescription>{description}</CardDescription>
            <RichTextEditor
                content={value as string}
                onContentChanged={e => setValue(e)}
                disabled={field?.readonly}
            />
        </div>
    );
}
