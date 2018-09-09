var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');


module.exports = {
  devtool: 'source-map',
  entry: {
    index: [
      "webpack-hot-middleware/client?reload=true",
      './src/index'
    ]
  },
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: '[name].js',
    publicPath: '/public/js',
    chunkFilename: '[name].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "commons.js",
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new OpenBrowserPlugin({url: 'http://127.0.0.1:5001'}),      // Webpack编译完成时自动打开新的浏览器窗口
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [
          autoprefixer({browsers: ['last 2 versions']})                   // 自动补全css3前缀  浏览器版本
        ]
      }
    })
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          "presets": [["es2015", {modules: false}], "stage-0", "react"],
          "plugins": ['transform-async-to-generator', 'transform-decorators-legacy', ['import', {
            libraryName: 'antd-mobile',
            style: true
          }]]
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },
      {
        test: /\.(png|jpg|bmp)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(svg)$/i,
        loader: 'svg-sprite-loader',
        include: [
          require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // antd-mobile使用的svg目录
          path.resolve(__dirname, 'public/images'),  // 个人的svg文件目录，如果自己有svg需要在这里配置
        ]
      },
    ]
  },
  devServer: {
    contentBase: "./src",//本地服务器加载页面所在目录
    colors: true, //终端中输出结果为彩色
    historyApiFallback: true, //不跳转
    inline: false,//实时刷新
  }
};
