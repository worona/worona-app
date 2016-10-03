/*eslint-disable */
var env = 'dev';
var path = require('path');
var webpack = require('webpack');
var argv = require('yargs').argv;
var vendors = require('./packages/core-dashboard-worona/package.json').worona[env].vendors.main;
var vendorsFile = /^.+\/(.+\.js)$/.exec(vendors)[1];
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

var publicPath = argv.remote ? 'https://cdn.worona.io/' : 'https://localhost:4000/';

module.exports = {
  entry: {
    development: [
      path.join(__dirname, 'development', 'entry.js'),
    ],
    core: [
      // 'webpack/hot/dev-server',
      'script!systemjs/dist/system.js',
      path.join(__dirname, 'packages', 'core-dashboard-worona', 'src', 'index.js'),
    ],
  },
  output: {
    path: path.join(__dirname, 'dist', env),
    filename: 'packages/core-dashboard-worona/dist/' + env + '/js/[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    hashDigestLength: 32,
  },
  module: {
    loaders: [
      {
        test: /packages\/.+-worona\/src\/dashboard\/index\.js$/,
        loader: 'bundle-loader',
        query: {
          lazy: true,
          name: 'packages/[1][2]/dist/' + env + '/js/[1]',
          regExp: 'packages\\/([\\w]+)([\\w\\-]+)'
        },
        exclude: /(core-dashboard-worona)/,
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader',
        ],
        exclude: /(node_modules)/,
      },
      {
        test: /\.s[ac]ss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        query: {
          name: 'packages/[1]/dist/' + env + '/images/[name].[hash].[ext]',
          regExp: 'packages\\/([^\\/]+)\\/',
        },
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          minetype: 'application/font-woff',
          name: 'packages/[1]/dist/' + env + '/fonts/[name].[hash].[ext]',
          regExp: 'packages\\/([^\\/]+)\\/',
        },
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        query: {
          name: 'packages/[1]/dist/' + env + '/fonts/[name].[hash].[ext]',
          regExp: 'packages\\/([^\\/]+)\\/',
        },
      },
      {
        test: /locales\/.+\.json$/,
        loader: 'bundle-loader',
        query: {
          name: 'packages/[1]/dist/' + env + '/locales/[name]',
          regExp: 'packages\\/([^\\/]+)\\/',
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  devtool: '#eval-source-map',
  devServer: {
		contentBase: path.join(__dirname, 'dist', env),
		noInfo: false,
		// hot: true,
		inline: true,
    port: 4000,
    https: true,
    compress: false,
    historyApiFallback: true,
	},
  postcss: function () {
    return [require('postcss-cssnext')()];
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('development') } }),
    new LodashModuleReplacementPlugin(
      { currying: true, flattening: true, placeholders: true, collections: true }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb\.js|es\.js/),
    new HtmlWebpackPlugin({
      inject: false,
      title: 'Worona Dashboard (DEV)',
      template: path.join(__dirname, 'html', 'index.html'),
      favicon: path.join(__dirname, 'html', 'favicon.png'),
      vendorsFile: 'packages/core-dashboard-worona/dist/' + env + '/vendors/' + vendorsFile,
      devServer: 'https://localhost:4000',
      window: {
        publicPath: publicPath,
        __worona__: { [env]: true, remote: argv.remote },
      },
      appMountId: 'root',
      minify: { preserveLineBreaks: true, collapseWhitespace: true },
    }),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require('./packages/core-dashboard-worona/dist/' + env + '/vendors/vendors-manifest.json'),
    }),
    new CopyWebpackPlugin([{
      from: './packages/core-dashboard-worona/dist/' + env + '/vendors/',
      to: 'packages/core-dashboard-worona/dist/' + env + '/vendors',
    }], { copyUnmodified: true }),
  ]
};
