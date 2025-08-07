module.exports = {
  terserOptions: {
    ecma: 2022,
    warnings: false,
    safari10: true,
    output: {
      comments: false
    },
    compress: {
      comparisons: false,
      inline: 1,
      pure_getters: true,
      passes: 2
    },
    mangle: {
      safari10: true
    }
  },
  parallel: true,
  extractComments: false
};