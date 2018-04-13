const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const DIST_DIR = path.join(__dirname, '../dist')

const COMMON_HTML_WEBPACK_PLUGIN_CONFIG = (name, chunks) => ({
  /* 
     * [see more](https://github.com/jantimon/html-webpack-plugin#configuration)
     */
  title: 'OSorter',
  filename: `${name}.html`,
  template: './templates/tpl.html',
  /*
     * a icon path
     */
  // favicon: '',
  minify: false,
  hash: true,
  chunks, // []
  excludeChunks: []
})

const plugins = [
  new HtmlWebpackPlugin(
    COMMON_HTML_WEBPACK_PLUGIN_CONFIG('index', ['vendor', 'margaret'])
  ),

  /*
    chunks: 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
    minSize: 表示在压缩前的最小模块大小，默认为0；
    minChunks: 表示被引用次数，默认为1；
    maxAsyncRequests: 最大的按需(异步)加载次数，默认为1；
    maxInitialRequests: 最大的初始化加载次数，默认为1；
    name: 拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；
    cacheGroups: 缓存组。
   */
  new webpack.optimize.SplitChunksPlugin({
    chunks: 'async',
    minSize: 20000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    name: true
  }),
  new ExtractTextPlugin('margaret.css')
]

module.exports = (env = {}) => ({
  entry: {
    vendor: ['hyperapp'],
    margaret: './src/view/scripts/App.js'
  },
  output: {
    path: path.resolve(DIST_DIR),
    filename: '[name].js',
    chunkFilename: '[id].bundle.js'
    // [see more](https://webpack.github.io/docs/configuration.html#output-publicpath)
    // publicPath: '',
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.js[x]?/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        // use sass-loader for *.sass files
        test: /\.sass/i,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: `css-loader?modules&localIdentName=${
                env.prod
                  ? '[hash:base64:5]'
                  : '[path]_[name]_[local]--[hash:base64:5]'
              }`
            },
            'postcss-loader',
            `sass-loader`
          ]
          // publicPath: 'css/'
        })
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '../dist/img/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  externals: [
    (function() {
      var IGNORES = ['electron', 'fs', 'path']
      return function(context, request, callback) {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, "require('" + request + "')")
        }
        return callback()
      }
    })()
  ],
  resolve: {},
  resolveLoader: {},
  devServer: {
    https: false,
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    port: 3000
  }
})
