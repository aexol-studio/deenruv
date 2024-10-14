import type { PluginPage } from '@deenruv/react-ui-devkit';
import React from 'react';
import { Test } from './metrics';
import { LocaleTest } from './LocaleTest';

export const pages: PluginPage[] = [
    { path: 'test', element: <Test /> },
    { path: 'locale-test', element: <LocaleTest /> },
];
