import { createDeenruvUIPlugin } from '@deenruv/react-ui-devkit';
import { widgets } from './widgets';
import pl from './locales/pl';
import en from './locales/en';

export type UIPluginOptions = {
    horizontalChartColors: { colorFrom: string; colorTo: string; stroke: string };
    barChartColors?: string[];
};

export const UIPlugin = createDeenruvUIPlugin<UIPluginOptions>({
    config: {
        horizontalChartColors: { colorFrom: `#4338ca`, colorTo: `#6366f1`, stroke: `#6366f1` },
        barChartColors: ['#2563eb', '#60a5fa', '#3b82f6', '#93c5fd', '#bfdbfe'],
    },
    version: '1.0.0',
    name: 'Dashboard Widgets Plugin',
    widgets,
    translations: {
        ns: 'dashboard-widgets-plugin',
        data: { en, pl },
    },
});
