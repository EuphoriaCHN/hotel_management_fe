// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const CracoAlias = require("craco-alias");

const webpack = require('webpack');

module.exports = {
  webpack: {
    plugins: [
      // new BundleAnalyzerPlugin(),
      // 打压缩包
      // new CompressionWebpackPlugin({
      //     algorithm: 'gzip',
      //     test: new RegExp(
      //         '\\.(' +
      //         ['js', 'css'].join('|') +
      //         ')$'
      //     ),
      //     threshold: 1024,
      //     minRatio: 0.8
      // }),
      // todo:: production
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     compress: {
      //       warnings: false,
      //       drop_debugger: true,
      //       drop_console: true,
      //     },
      //   },
      //   sourceMap: false,
      //   parallel: true,
      // }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new SimpleProgressWebpackPlugin()
    ],
    //抽离公用模块
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2, maxInitialRequests: 5,
            minSize: 0
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true

          }
        }
      }
    }
  },
  babel: {
    plugins: [
      ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ["react-hot-loader/babel"]
    ]
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: "./",
        tsConfigPath: "./tsconfig.extend.json",
      }
    }
  ]
};