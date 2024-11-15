const { TailwindConfig } = require('@deenruv/react-ui-devkit');
/** @type {import('tailwindcss').Config} */
module.exports = {
  ...TailwindConfig,
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
