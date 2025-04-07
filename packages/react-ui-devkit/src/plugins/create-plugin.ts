import { DeenruvUIPlugin } from "./types.js";

export const createDeenruvUIPlugin = <T extends Record<string, any>>(
  plugin: DeenruvUIPlugin<T>,
): DeenruvUIPlugin<T> => plugin;
