import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@deenruv/react-ui-devkit';
import { LanguageCode } from '../zeus';
import { Globe } from 'lucide-react';
import { createClient } from '../client';

function getActiveLocale(localeOverride?: unknown): string {
    const locale = typeof localeOverride === 'string' ? localeOverride.replace('_', '-') : 'en';
    const hyphenated = locale?.replace(/_/g, '-');
    const matches = hyphenated?.match(/^([a-zA-Z_-]+)(-[A-Z][A-Z])(-[A-Z][A-z])$/);
    if (matches?.length) {
        const overriddenLocale = matches[1] + matches[3];
        return overriddenLocale;
    } else {
        return hyphenated;
    }
}

type Props = {
    value: LanguageCode;
    onChange: (lang: LanguageCode) => void;
};

export const LanguageSelector = ({ onChange, value }: Props) => {
    const [languages, setLanguages] = useState<LanguageCode[]>([]);

    const client = createClient(value);

    useEffect(() => {
        (async () => {
            const { globalSettings } = await client('query')({
                globalSettings: {
                    availableLanguages: true,
                },
            });

            setLanguages(globalSettings?.availableLanguages);
        })();
    }, []);

    return (
        <Select
            value={value}
            onValueChange={(e: LanguageCode) => {
                onChange(e);
            }}
        >
            <SelectTrigger>
                <div className="flex gap-2 items-center pr-1">
                    <Globe size={14} /> <SelectValue />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {languages.map((lng, idx) => {
                        const name = new Intl.DisplayNames([getActiveLocale(lng.replace('_', '-'))], {
                            type: 'language',
                        });

                        return (
                            <SelectItem key={idx} value={lng}>
                                {name.of(getActiveLocale(lng.replace('_', '-')))}
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
