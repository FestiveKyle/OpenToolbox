const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { ProvidePlugin, DefinePlugin } = require('webpack')
const dotenv = require('dotenv')

module.exports = () => {
  const env = dotenv.config().parsed
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next])
    return prev
  }, {})

  return {
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
    },
    resolve: {
      modules: [path.join(__dirname, 'src'), 'node_modules'],
      alias: {
        react: path.join(__dirname, 'node_modules', 'react'),
      },
    },
    devServer: {
      port: 3000,
      host: '0.0.0.0',
      hot: true,
      historyApiFallback: { disableDotRule: true },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
      new ProvidePlugin({ process: 'process/browser' }),
      new DefinePlugin(envKeys),
    ],
  }
}
