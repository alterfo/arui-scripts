import config from './app-configs';
import path from 'path';
/**
 * Функция для создания конфигурационного файла postcss
 * @param {String[]} plugins список плагинов
 * @param {Object} options коллекция конфигураций плагинов, где ключ - название плагина, а значение - аргумент для инициализации
 * @returns {*}
 */
export function createPostcssConfig(plugins: string[], options: Record<string, unknown>) {
    return plugins.map(pluginName => {
        if (pluginName in options) {
            return [pluginName, options[pluginName]];
        }

        return pluginName
    });
}

export const postcssPlugins = [
    'postcss-omit-import-tilde',
    'postcss-import',
    'postcss-url',
    'postcss-mixins',
    'postcss-for',
    'postcss-each',
    ( config.componentsTheme || config.keepCssVars ) && '@csstools/postcss-global-data',
    config.keepCssVars && 'postcss-custom-media',
    config.componentsTheme && 'postcss-custom-properties',
    'postcss-strip-units',
    'postcss-calc',
    'postcss-color-function',
    'postcss-color-mod-function',
    'postcss-nested',
    'autoprefixer',
    'postcss-inherit',
    'postcss-discard-comments',
].filter(Boolean) as string[];

export const postcssPluginsOptions = {
    'postcss-import': {
        path: ['./src'],
    },
    '@csstools/postcss-global-data': {
        files: [
            config.keepCssVars && path.join(__dirname,'mq.css'),
            config.componentsTheme
        ].filter(Boolean) as string[],
    },
    'postcss-url': {
        url: 'rebase',
    },
    'postcss-color-mod-function': {
        unresolved: 'warn',
    },
    'postcss-custom-properties': {
        preserve: false,
    }
};