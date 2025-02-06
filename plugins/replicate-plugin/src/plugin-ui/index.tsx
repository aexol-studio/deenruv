import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import pl from './locales/pl';
import en from './locales/en';
import { translationNS } from './translation-ns';
import { ReplicateInput } from './components/Replicate';
import React from 'react';
import { NotebookPenIcon } from 'lucide-react';

export const ReplicateUiPlugin = createDeenruvUIPlugin({
    version: '1.0.0',
    name: 'Replicate Plugin',
    pages: [{ element: <ReplicateInput />, path: 'replicate' }],
    navMenuLinks: [
        {
            groupId: 'promotions-group',
            href: 'replicate',
            id: 'replicate',
            labelId: 'Replicate',
            icon: NotebookPenIcon,
        },
    ],
    translations: {
        ns: translationNS,
        data: { en, pl },
    },
});
