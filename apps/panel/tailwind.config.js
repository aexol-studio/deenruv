import { TailwindConfig } from '@deenruv/react-ui-devkit';
import tailwindCssAnimate from 'tailwindcss-animate';
import tailwindCssTypography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  ...TailwindConfig,
  plugins: [tailwindCssAnimate, tailwindCssTypography],
};
