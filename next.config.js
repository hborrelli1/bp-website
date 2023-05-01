// next.config.js

module.exports = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 10000,
  images: {
    domains: ['images.ctfassets.net', 'via.placeholder.com', 'downloads.ctfassets.net', 'videos.ctfassets.net']
  },
  // sassOptions: {
  //   includePaths: [path.join(__dirname, 'styles')],
  //   prependData: `@import "main.scss";`
  // },
}
