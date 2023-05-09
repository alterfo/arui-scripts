/**
 * Конфигурация arui-scripts, которая может быть переопределена приложением
 */
export type AppConfigs = {
    // general settings
    clientServerPort: number;
    serverPort: number;
    debug: boolean;
    devSourceMaps: string;
    useServerHMR: boolean;
    presets: string | null;

    // paths
    buildPath: string;
    assetsPath: string;
    additionalBuildPath: string[];
    statsOutputFilename: string;
    serverEntry: string | string[] | Record<string, string | string[]>;
    serverOutput: string;
    clientPolyfillsEntry: null | string | string[];
    clientEntry: string;

    // docker compilation configs
    dockerRegistry: string;
    baseDockerImage: string;
    nginxRootPath: string;
    runFromNonRootUser: boolean;
    removeDevDependenciesDuringDockerBuild: boolean;
    // archive compilation configs
    archiveName: string;

    // build tuning
    keepPropTypes: boolean;
    useTscLoader: boolean;
    webpack4Compatibility: boolean;
    installServerSourceMaps: boolean;

    // CSS
    componentsTheme: string | undefined;
    keepCssVars: boolean;

    // Modules
    applicationModules: EmbeddedModuleConfig[];
    mfModules: {
        shared: any; // webpack don't expose this type
        exposes: Record<string, string>;
    } | null;
};

export type EmbeddedModuleConfig = {
    name: string;
    entry: string;
    embeddedConfig?: Record<string, string>;
    cssPrefix?: false | string;
};


/**
 * Внутренний контекст arui-scripts
 */
export type AppContext = {
    appPackage: any;
    name: string;
    normalizedName: string;
    version: string;

    cwd: string;
    appSrc: string;
    appNodeModules: string;
    appNodeModulesBin: string;
    babelRuntimeVersion: string;
    useYarn: boolean;

    tsconfig: string | null;
    localNginxConf: string | null;
    localDockerfile: string | null;
    localStartScript: string | null;

    overridesPath: string[];

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

export type AppContextWithConfigs = AppContext & AppConfigs;

export type PackageSettings = Partial<AppConfigs>;
