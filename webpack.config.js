
module.exports = {
    entry: "./js/app.js",
    output: {
        filename: "./dist/js/out.js"
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: { presets: ['es2015'] }
            }
        ]
    }
}
