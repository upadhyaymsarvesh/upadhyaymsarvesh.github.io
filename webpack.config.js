'use strict';
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: './src/App.ts',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.([cm]?ts|tsx)$/,
				loader: 'ts-loader',
			},
		],
	},
	resolve: {
		extensions: [ '.ts', '.tsx', '.js' ],
		extensionAlias: {
			'.ts': ['.js', '.ts'],
			'.cts': ['.cjs', '.cts'],
			'.mts': ['.mjs', '.mts']
		}
	},
	plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'static'), to: path.resolve(__dirname, 'dist') }
      ],
    }),
  ],
	devServer: {
    contentBase: path.resolve(__dirname, 'dist')
	}
};
