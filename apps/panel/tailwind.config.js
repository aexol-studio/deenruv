import { TailwindConfig } from '@deenruv/react-ui-devkit';
import tailwindCssAnimate from 'tailwindcss-animate';
import tailwindCssTypography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  ...TailwindConfig,
  content: [
    './src/**/*.{ts,tsx}',
    '../../node_modules/@deenruv/admin-dashboard/dist/**/*.js',
    '../../node_modules/@deenruv/react-ui-devkit/dist/**/*.js',
  ],
  plugins: [tailwindCssAnimate, tailwindCssTypography],
};
