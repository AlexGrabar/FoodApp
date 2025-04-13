const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isDevelopment = !isProduction;

    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isDevelopment ? 'eval-source-map' : 'source-map',
        entry: './src/main.tsx',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
            chunkFilename: isProduction ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
            assetModuleFilename: 'static/assets/[name].[hash][ext]',
            clean: true,
            publicPath: '/',
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@components': path.resolve(__dirname, './src/components'),
                '@pages': path.resolve(__dirname, './src/pages'),
                '@api': path.resolve(__dirname, './src/api'),
                '@styles': path.resolve(__dirname, './src/styles'),
                '@configs': path.resolve(__dirname, './src/configs'),
                '@utils': path.resolve(__dirname, './src/utils'),
                '@typings': path.resolve(__dirname, './src/types'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx|js|jsx)$/,
                    exclude: /node_modules/,
                    use: { loader: 'babel-loader' },
                },
                {
                    test: /\.module\.s[ac]ss$/i,
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: isDevelopment ? '[path][name]__[local]--[hash:base64:5]' : '[hash:base64:8]',
                                    exportLocalsConvention: 'camelCase',
                                },
                                sourceMap: isDevelopment,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment,
                                additionalData: `@use "@/styles/variables.scss" as *;`,
                                webpackImporter: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    exclude: /\.module\.s[ac]ss$/i,
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        { loader: 'css-loader', options: { modules: false, sourceMap: isDevelopment } },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment,
                                additionalData: `@use "@/styles/variables.scss" as *;`,
                                webpackImporter: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        { loader: 'css-loader', options: { modules: false, sourceMap: isDevelopment } },
                    ],
                },
                { test: /\.(png|jpe?g|gif|webp|ico)$/i, type: 'asset/resource' },
                { test: /\.svg$/i, type: 'asset/resource' },
                { test: /\.(woff|woff2|eot|ttf|otf)$/i, type: 'asset/resource' },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './index.html',
                favicon: './public/favicon.ico'
            }),
            isProduction && new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            }),
            isDevelopment && new ReactRefreshWebpackPlugin(),
            new ForkTsCheckerWebpackPlugin({
                async: isDevelopment,
                typescript: {
                    diagnosticOptions: { semantic: true, syntactic: true },
                    mode: 'write-references',
                },
            }),
        ].filter(Boolean),
        devServer: {
            port: 3000,
            open: true,
            hot: true,
            historyApiFallback: true,
            static: { directory: path.join(__dirname, 'public') },
            client: { overlay: { errors: true, warnings: false } },
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
        performance: false,
    };
};