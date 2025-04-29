import { pluginBabel } from '@rsbuild/plugin-babel'
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginStyledComponents } from '@rsbuild/plugin-styled-components'
import { pluginEnv } from './scripts/env'
import environmentsConfig from './environments.config.json'

export default defineConfig({
    performance: {
        chunkSplit: {
            strategy: 'split-by-experience'
        }
    },
    html: {
        template: './index.html'
    },
    source: {
        decorators: {
            version: 'legacy'
        },
        alias: {
            '@': './src'
        },
        include: [/[\\/]node_modules[\\/]/]
    },
    output: {
        assetPrefix: './',
        polyfill: 'entry',
        // overrideBrowserslist: ['iOS >= 9', 'Android >= 4.4'],
        distPath: {
            root: 'build/build'
        }
    },
    server: {
        proxy: {
            '/api': {
                changeOrigin: true,
                target: 'https://lqzdxm.longquan.gov.cn:1443/dev'
            },
            '/proxy/': {
                // target: 'http://192.168.50.40:8080/',
                // target: 'http://192.168.50.49:8084/api',
                target: 'https://lqzdxm.longquan.gov.cn:1443/dev',
                changeOrigin: true,
                pathRewrite: (path) => path.replace(/^\/proxy/, '')
            }
        }
    },
    plugins: [
        pluginReact(),
        pluginStyledComponents(),
        pluginEnv(environmentsConfig),
        pluginBabel({
            include: /\.(?:jsx|tsx)$/,
            babelLoaderOptions(opts) {
                opts.plugins?.unshift('module:@preact/signals-react-transform')
            }
        })
    ]
})
