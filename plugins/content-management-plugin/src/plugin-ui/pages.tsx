import type { PluginPage } from '@deenruv/react-ui-devkit';
import React from 'react';
import { CMSPage } from './CMSPage';

export const pages: PluginPage[] = [{ path: 'cms', element: <CMSPage /> }];
