const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const rootDir = path.join(__dirname, "..");

module.exports = {
  // Path to the entry file, change it according to the path you have
  entry: path.join(rootDir, "src", "index.js"),

  // Path for the output files
  output: {
    path: path.resolve(rootDir, "dist"),
    filename: "app.bundle.js",
  },

  // Enable source map support
  devtool: "source-map",

  // Loaders and resolver config
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /node_modules[/\\](?!react-native-vector-icons)/,
        use: {
          loader: "babel-loader",
          options: {
            // Disable reading babel configuration
            babelrc: false,
            configFile: false,

            // The configuration for compilation
            presets: [
              ["@babel/preset-env", { useBuiltIns: "usage" }],
              "module:metro-react-native-babel-preset",
              "@babel/preset-flow",
              "@babel/preset-typescript",
            ],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-object-rest-spread",
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: { version: 2 }, // 指定 runtime-corejs 的版本，目前有 2 3 两个版本
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
        loader: "file-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      "react-native$": require.resolve("react-native-web"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
    }),
  ],

  // Development server config
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
  },
};
