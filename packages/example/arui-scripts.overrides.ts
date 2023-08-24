import { OverrideFile } from "arui-scripts";

const overrides: OverrideFile = {
    webpackClient: (config, appConfig, { createSingleClientWebpackConfig }) => {
        const workerConfig = createSingleClientWebpackConfig(
            { worker: './src/worker.ts' },
            'worker',
        );
        workerConfig.output.filename = 'worker.js';

        return [
            config,
            workerConfig,
        ];
    },
    webpackClientProd: (config) => {
        const allConfigs = Array.isArray(config) ? config : [config];

        return allConfigs.map((config) => {
            config.optimization.minimize = false;

            return config;
        });
    }
};

export default overrides;
