// next.config.js
const createNextPluginPreval = require('next-plugin-preval/config');
const withNextPluginPreval = createNextPluginPreval();
// const path = require('path');

module.exports = withNextPluginPreval({
  reactStrictMode: true,
  images: {
    domains: ['images.ctfassets.net']
  },
  // sassOptions: {
  //   includePaths: [path.join(__dirname, 'styles')],
  //   prependData: `@import "main.scss";`
  // },
})
