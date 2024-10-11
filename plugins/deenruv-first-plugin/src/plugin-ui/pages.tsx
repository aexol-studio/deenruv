import type { PluginPage } from '@deenruv/react-ui-devkit';
import React from 'react';
import { Test } from './metrics';

export const pages: PluginPage[] = [{ path: 'test', element: <Test /> }];
