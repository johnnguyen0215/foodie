/**
 * This "extra" webpack config is required because in angular 6.X.X the
 * ng eject command has been disabled, thus making the webpack generated by the
 * cli unmodifiable. This webpack config will be merged with the one generated
 * by the CLI using the angular-builders custom webpack module, whose
 * configuration options are defined in angular.json.
 */
module.exports = {
  module: {
    rules: [
    ]
  }
};