const path = require('path');

module.exports = {
    entry: './src/bl-layer.js',
    mode: 'development',
    output: {
        library: 'BLLayer',
        libraryTarget: 'var',
        filename: 'bl-layer.js',
        path: path.resolve(__dirname, 'public/src')
    }
};
