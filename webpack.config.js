const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/assets/js/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs'),
    clean: true, // supprime les fichiers anciens à chaque build
    publicPath: '/', // permet de servir le contenu depuis la racine
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // au lieu de style-loader
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html', // ton template HTML source
      filename: 'index.html',
      inject: 'body', // insère le JS en bas du <body>
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'src/assets/img'),
    //       to: 'images', // => copie tout dans dist/images
    //     }
    //   ],
    // }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      `...`, // ← garde les minimizers par défaut (comme Terser)
      new CssMinimizerPlugin(),
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), // dossier à servir
    },
    open: true,         // ouvre le navigateur automatiquement
    hot: true,          // active le hot reload
    port: 3000,         // port (change si besoin)
  },
};
