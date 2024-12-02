import { DeenruvUIPlugin } from '../types/types';

export const createDeenruvUIPlugin = <T extends Record<string, any>>(
    plugin: DeenruvUIPlugin<T>,
): DeenruvUIPlugin<T> => plugin;
