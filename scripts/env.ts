import path from 'path'

import type { RsbuildConfig, RsbuildPlugin } from '@rsbuild/core'

export const pluginEnv = (environments: any): RsbuildPlugin => ({
    name: 'env',
    setup: (api) => {
        console.info('> 现在的环境是', process.env.NODE_ENV)
        const configuration = environments.configurations[process.env.NODE_ENV || 'development']
        console.log(configuration)

        const fileReplacements: any = []
        if (configuration && configuration.fileReplacements) {
            // Iterate through replacements
            for (const replacement of configuration.fileReplacements) {
                console.log(path.resolve(replacement.replace))

                // create Webpack module rule
                const replace = {
                    test: path.resolve(replacement.replace),
                    loader: 'file-replace-loader',
                    options: {
                        replacement: path.resolve(replacement.with)
                        // async: true
                    }
                }
                fileReplacements.push(replace)
            }
        }
        const rules: any = []
        for (let index = 0; index < fileReplacements.length; index++) {
            rules.push(fileReplacements[index])
        }

        api.modifyRsbuildConfig((config) => {
            const rspack: RsbuildConfig = config

            if (!rspack.tools) rspack.tools = {}
            if (!rspack.tools.rspack) rspack.tools.rspack = { module: { rules: rules } }

            return rspack
        })
    }
})
