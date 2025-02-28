import { TailwindConfig } from '@deenruv/react-ui-devkit';
import tailwindCssAnimate from 'tailwindcss-animate';
import tailwindCssTypography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  ...TailwindConfig,
  content: [
    ...TailwindConfig.content,
    '../../node_modules/@deenruv/replicate-plugin/dist/**/*.js',
    '../node_modules/@deenruv/replicate-plugin/dist/**/*.js',
    './node_modules/@deenruv/replicate-plugin/dist/**/*.js',
    '../../node_modules/@deenruv/order-attributes-plugin/dist/**/*.js',
    '../node_modules/@deenruv/order-attributes-plugin/dist/**/*.js',
    './node_modules/@deenruv/order-attributes-plugin/dist/**/*.js',
  ],
  plugins: [tailwindCssAnimate, tailwindCssTypography],
};
