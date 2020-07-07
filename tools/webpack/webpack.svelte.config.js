const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkerPlugin = require('worker-plugin')

module.exports = {
  entry: './DEV/index.js',
  target: 'web',
  devtool: 'source-map',
  node: {
    global: false,
    __dirname: false,
    __filename: true,
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
      '@daniloster/svelte-i18n': path.resolve('src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {},
        },
      },
      {
        /**
         * Any other file than the (tsx|ts|jsx|js) will be taken care by url-loader
         * falling back to file-loader
         */
        // test: /\.(png|jpg|jpeg|gif)$/i,
        test: /^(.(?!(svelte|html|js|jsx|ts|tsx)))+$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: true,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, '../../dist/.app/'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 4001,
    publicPath: '/',
  },
  output: {
    path: path.resolve(__dirname, '../../dist/.app/'),
    filename: 'index.js',
    publicPath: './',
  },
  plugins: [
    new CopyWebpackPlugin({ patterns: [{ from: 'DEV/assets', to: 'assets' }] }),
    new WorkerPlugin(),
    new HtmlWebpackPlugin({ title: 'Shopping Builder' }),
  ],
}
