const path = require('path');

module.exports = {
    entry: {
        app: ['./public/marking_app/index.js']
    },
    output: {
        path: path.resolve(__dirname, 'public/build/js/marking_app'),
        filename: 'index.bundle.js'
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['@babel/preset-env']
            }
        }]
    }
}