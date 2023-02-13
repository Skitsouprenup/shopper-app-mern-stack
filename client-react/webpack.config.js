const prod = process.env.NODE_ENV === 'production';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import dotenv from "dotenv";
import path from 'path';
import webpack from 'webpack';

import { fileURLToPath } from "node:url";

const rootPath = fileURLToPath(import.meta.url);
const rootDirectory = path.dirname(rootPath);

const env = dotenv.config().parsed;

export const webpackConfig = {
  mode: prod ? 'production' : 'development',
  entry: './src/App.tsx',
  output: {
    filename: 'index.js',
    path: rootDirectory + '/dist/',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    fallback: {
      path: false,
      fs: false,
      os: false,
    }
  },
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [
      
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx'],
        },
        use: 'ts-loader',
      },
      
      {
        test: /\.s(a|c)ss$/,
        exclude: /node_modules/,
        use: [

          {loader: prod ? MiniCssExtractPlugin.loader : 'style-loader'},

          {
            loader: 'css-modules-typescript-loader',
            options: {
              mode: process.env.CI ? 'verify' : 'emit'
            }
          },

          {
            loader: 'css-loader',
            options: {
              modules: true,
            }
          },

          {loader: 'sass-loader'},

        ],
      },

      {
        test: /\.css$/,
        include: path.resolve(rootDirectory, 'node_modules/normalize.css'),
        use: [
          {loader: prod ? MiniCssExtractPlugin.loader : 'style-loader'},
          {loader: 'css-loader'},
        ]
      },

      {
        test: /\.(png|svg|jpe?g|gif)$/,
        include: path.resolve(rootDirectory, 'src'),
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
    ]
  },
  devtool: prod ? undefined : 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      favicon: './src/assets/images/icon.ico',
      inject: 'body'}),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      ...Object.entries(dotenv.config().parsed).
        reduce((acc, curr) => (
          {
            ...acc, 
            [`process.env.${curr[0]}`]: JSON.stringify(curr[1]) 
          }
        ), {}),
    }),
  ],
}

export default webpackConfig;