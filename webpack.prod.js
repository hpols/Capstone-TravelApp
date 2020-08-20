const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
    entry: './src/client/index.js',
	output: {
        libraryTarget: 'var',
        library: 'Client'
    },
    mode: 'production',
	module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
			{
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
            },
			{
         test: /\.(png|svg|jpg|gif)$/,
         use: [
           'file-loader',
         ],
       },
        ]
    },
	optimization: {
  		minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
	},
    plugins: [
		new CopyWebpackPlugin({
			patterns: [{ from: './src/client/media', 
						to: 'media'}]
		}),
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html"
        }),
        //new WorkboxPlugin.GenerateSW(), -> ServiceWorker
        new MiniCssExtractPlugin({filename: '[name].css'})
    ]
}