import shell from 'shelljs';
import tar from 'tar';
import path from 'path';
import fs from 'fs-extra';
import configs from '../../configs/app-configs';
import exec from '../util/exec';
import nginxConfTemplate from '../../templates/nginx.conf.template';
import startScript from '../../templates/start.template';

const tempDirName = '.archive-build';
const nginxConfFileName = 'nginx.conf';
const startScriptFileName = 'start.sh';
const nodeModulesDirName = 'node_modules';
const packageJsonFileName = 'package.json';
const pathToTempDir = path.join(configs.cwd, tempDirName);
const nginxConfPath = path.join(pathToTempDir, nginxConfFileName);
const startScriptPath = path.join(pathToTempDir, startScriptFileName);
const nodeModulesPath = path.join(configs.cwd, nodeModulesDirName);
const packageJsonPath = path.join(configs.cwd, packageJsonFileName);

(async () => {
    try {
        console.time('Total time');
        console.time('Setting up time');

        await fs.emptyDir(pathToTempDir);

        const nginxConf = configs.localNginxConf
            ? await fs.readFile(configs.localNginxConf, 'utf8')
            : nginxConfTemplate;

        await Promise.all([
            fs.writeFile(nginxConfPath, nginxConf, 'utf8'),
            fs.writeFile(startScriptPath, startScript, { encoding: 'utf8', mode: 0o555 }),
            fs.remove(configs.buildPath),
        ]);

        console.timeEnd('Setting up time');
        console.time('Build application time');
        // run build script
        await exec('npm run build');

        console.timeEnd('Build application time');
        console.time('Remove build dependencies time');
        // if yarn is available prune dev dependencies with yarn, otherwise use npm
        if (configs.useYarn && shell.which('yarn')) {
            try {
                // if yarn 1 is used
                await exec('yarn install --production --ignore-optional --frozen-lockfile --ignore-scripts --prefer-offline');
            } catch {
                // if yarn 2 is used
                await exec('yarn workspaces focus --production --all');
            }
        } else {
            await exec('npm prune --production');
        }

        console.timeEnd('Remove build dependencies time');
        console.time('Archive build time');
        await Promise.all([
            fs.copy(configs.buildPath, path.join(pathToTempDir, configs.buildPath)),
            fs.copy(nodeModulesPath, path.join(pathToTempDir, nodeModulesDirName)),
            fs.copy(packageJsonPath, path.join(pathToTempDir, packageJsonFileName)),
            ...configs.additionalBuildPath.map(additionalPath => (
                fs.copy(path.join(configs.cwd, additionalPath), path.join(pathToTempDir, additionalPath))
            ))
        ]);
        await tar.c(
            {
                file: configs.archiveName,
                cwd: pathToTempDir
            },
            fs.readdirSync(pathToTempDir)
        );

        console.timeEnd('Archive build time');
        console.time('Cleanup time');

        // remove temp directory
        await fs.remove(pathToTempDir);

        console.timeEnd('Cleanup time');
        console.timeEnd('Total time');
    } catch (err) {
        console.error('Error during archive-build.');
        if (configs.debug) {
            console.error(err);
        }

        process.exit(1);
    }
})();
