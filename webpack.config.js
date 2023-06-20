const path = require('path');

module.exports = {
  target: "node4.0",
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./xstate.ts",
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "xstate.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader"
      }
    ]
  }
};
