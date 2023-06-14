export type AppConfigs = {
    appPackage: any; // todo;
    name: string;
    version: string;
    dockerRegistry: string;
    baseDockerImage: string;

    cwd: string;
    appSrc: string;
    appNodeModules: string;
    appNodeModulesBin: string;
    buildPath: string;
    assetsPath: string;
    additionalBuildPath: string[];
    nginxRootPath: string;
    runFromNonRootUser: boolean;
    archiveName: string;
    babelRuntimeVersion: string;

    serverEntry: string | string[] | Record<string, string | string[]>;
    serverOutput: string;

    clientPolyfillsEntry: null | string | string[];
    clientEntry: string | string[] | Record<string, string | string[]>;
    keepPropTypes: boolean;

    tsconfig: string | null;
    localNginxConf: string | null;
    localDockerfile: string | null;
    localStartScript: string | null;

    devSourceMaps: string;
    useTscLoader: boolean;
    useServerHMR: boolean;
    webpack4Compatibility: boolean;
    useYarn: boolean;

    clientServerPort: number;
    serverPort: number;
    installServerSourceMaps: boolean;

    debug: boolean;
    overridesPath: string[];
    statsOutputFilename: string;

    removeDevDependenciesDuringDockerBuild: boolean;

    componentsTheme: string | undefined;
    keepCssVars: boolean;

    publicPath: string;
    serverOutputPath: string;
    clientOutputPath: string;
    statsOutputPath: string;
    watchIgnorePath: string[];

    changelogPath: string;
    changelogTmpPath: string;
    changelogFeaturesPath: string;
    changelogBugfixesPath: string;
    changelogBreakingChangesPath: string;
};
