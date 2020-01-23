const path = require('path');

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  mode: 'production',

  watchOptions: {
    poll: 1000,
    aggregateTimeout:300,
  },

  performance: { hints: false },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query:{
        presets: ["es2015", "react", "stage-0"]
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
      {
        test: /\.(png|jpg|gif|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name][hash].[ext]',
            },
          },
        ],
      },
    ],
  },
};