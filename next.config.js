// next.config.js
const createNextPluginPreval = require('next-plugin-preval/config');
const withNextPluginPreval = createNextPluginPreval();


module.exports = withNextPluginPreval({
  reactStrictMode: true,
  images: {
    domains: ['images.ctfassets.net']
  }
})
