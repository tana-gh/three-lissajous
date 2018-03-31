const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = env => {
    const mode = env.dev  ? 'development' :
                 env.prod ? 'production'  :
                            ''
    return {
        mode: mode,
        entry: path.resolve(__dirname, './src/main.ts'),
        output: {
            path:       path.resolve(__dirname, `./dist/${mode}/`),
            publicPath: './',
            filename: 'bundle.js'
        },
        resolve: {
            extensions: ['.js', '.ts', '.css', '.sass', '.json']
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader'
                },
                {
                    test: /\.sass$/,
                    loaders: [
                        'style-loader',
                        'css-loader?sourceMap=true',
                        'sass-loader?sourceMap=true&indentedSyntax=sass'
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './html/index.html'
            })
        ]
    }
}
