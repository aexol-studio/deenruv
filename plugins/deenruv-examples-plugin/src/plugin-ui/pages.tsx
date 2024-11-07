import type { PluginPage } from '@deenruv/react-ui-devkit';
import React from 'react';
import { LocaleTest } from './LocaleTest';

export const pages: PluginPage[] = [{ path: 'locale-test', element: <LocaleTest /> }];
