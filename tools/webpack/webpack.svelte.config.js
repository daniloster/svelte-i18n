const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkerPlugin = require('worker-plugin')

const isProd = !['development', 'test'].includes(process.env.NODE_ENV)

module.exports = {
  entry: isProd ? './src/index.js' : './DEV/index.js',
  target: isProd ? 'node' : 'web',
  devtool: 'source-map',
  node: {
    global: false,
    __dirname: false,
    __filename: true,
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
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
          options: {
            // hotReload: !isProd,
          },
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
  ...(!isProd && {
    devServer: {
      contentBase: path.join(__dirname, '../../dist/.app/'),
      historyApiFallback: true,
      compress: true,
      hot: true,
      port: 4001,
      publicPath: '/',
    },
  }),
  output: isProd
    ? {
        path: path.resolve(__dirname, '../../lib/'),
        library: 'MyLibrary',
        libraryTarget: 'umd',
      }
    : {
        path: path.resolve(__dirname, '../../dist/.app/'),
        filename: 'index.js',
        publicPath: './',
      },
  plugins: isProd
    ? []
    : [
        new WorkerPlugin(),
        new HtmlWebpackPlugin({ title: 'Shopping Builder' }),
      ],
}
