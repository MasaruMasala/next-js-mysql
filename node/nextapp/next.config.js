const basepath = "/app";
module.exports = {
  assetPrefix: basepath,
  publicRuntimeConfig: {
    basePath: basepath,
    URL_ROOT: process.env.URL_ROOT,
  },
};
