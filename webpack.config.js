const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  entry: {
    index: "./src/index.tsx",
    content: "./src/Content.tsx"
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: { compilerOptions: { noEmit: false } }
          }],
        exclude: [/node_modules/, /\.test\.tsx?$/],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "../manifest.json" },
      ],
    }),
    ...getHtmlPlugins(["index"]),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map((chunk) =>
    new HTMLPlugin({
      title: "Highlightr",
      filename: `${chunk}.html`,
      chunks: [chunk],
    })
  );
}
