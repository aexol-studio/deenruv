import { DeenruvUIPlugin } from '../types';

export const createDeenruvUIPlugin = <PATHS extends string>(
    plugin: DeenruvUIPlugin<PATHS>,
): DeenruvUIPlugin<PATHS> => plugin;
