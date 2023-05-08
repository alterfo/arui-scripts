import fs from 'fs';
import path from 'path';
import { AppConfigs, AppContext } from './types';
import { getPolyfills } from '../util/get-polyfills';
import { resolveNodeModuleRelativeTo } from '../util/resolve';

/**
 * Обновление ключей конфига, зависящих от других. Это нужно делать в самый последний момент
 */
export function calculateDependentConfig(config: AppConfigs) {
    return {
        ...config,
        clientPolyfillsEntry: getPolyfills(config),
    }
}

/**
 * Обновление контекста в зависимости от ключей конфига
 */
export function calculateDependentContext(config: AppConfigs, context: AppContext) {
    let babelRuntimeVersion: string;
    try {
        // В проекте может стоять babel/runtime отличный от того, что установлен как зависимость arui-scripts.
        // При этом webpack будет резолвить babel/runtime относительно проекта, а не относительно arui-scripts.
        // Поэтому мы читаем версию того babel/runtime, который установлен в проекте.
        // Так же мы не можем использовать require для получения контента из babel/runtime/package.json,
        // потому что webpack.cache будет ругаться на то, что мы пытаемся импортировать файлы НЕ из своего node_modules.
        const pathToProjectBabelRuntime = resolveNodeModuleRelativeTo(context.cwd, '@babel/runtime/package.json');
        babelRuntimeVersion = JSON.parse(fs.readFileSync(pathToProjectBabelRuntime, 'utf8')).version;
    } catch (e) {
        babelRuntimeVersion = require('@babel/runtime/package.json').version;
    }

    return {
        ...context,
        publicPath: `${config.assetsPath}/`,
        serverOutputPath: path.resolve(context.cwd, config.buildPath),
        clientOutputPath: path.resolve(context.cwd, config.buildPath, config.assetsPath),
        statsOutputPath: path.resolve(context.cwd, config.buildPath, config.statsOutputFilename),
        watchIgnorePath: ['node_modules', config.buildPath],
        babelRuntimeVersion,
    };
}
