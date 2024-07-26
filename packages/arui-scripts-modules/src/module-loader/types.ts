/**
 * То, как подключать модуль на страницу.
 * compat - режим подключения без использования module-federation. В этом случае мы сами подключаем все скрипты и стили.
 * default - module-federation режим, загрузкой скриптов и стилей занимается wepack.
 */
export type MountMode = 'compat' | 'default';

/**
 * Запрос, который будет отправлен на сервер для получения ресурсов модуля
 */
export type GetResourcesRequest<GetResourcesParams = void> = {
    /** id загружаемого модуля */
    moduleId: string;
    /** id приложения-хоста */
    hostAppId: string;
    /** параметры, которые передаются в функцию получения ресурсов модуля */
    params: GetResourcesParams;
};

/**
 * Клиентский манифест приложения. Генерируется во время сборки.
 */
export type AruiAppManifest = {
    [moduleId: string]: {
        js?: string;
        css?: string;
        mode?: MountMode;
    };
} & {
    // мы делаем так, поскольку typescript не позволяет определить доп поля другого типа
    __metadata__: {
        version: string;
        name: string;
        vite?: boolean;
    };
};

/**
 * "состояние" модуля полученное от сервера
 */
export type GetModuleStateResult = {
    baseUrl: string;
};

/**
 * ожидаемое "состояние" модуля
 */
export type BaseModuleState<T = unknown> = {
    baseUrl: string;
    hostAppId: string;
    preloadedState?: T;
};
/**
 * Ресурсы, которые нужны модулю для запуска
 */
export type ModuleResources<ModuleState extends BaseModuleState = BaseModuleState> = {
    /** пути до js скриптов модуля */
    scripts: string[];
    /** пути до css стилей модуля */
    styles: string[];
    /** версия модуля */
    moduleVersion: string;
    /** название приложения, которое предоставляет модуль */
    appName: string;
    /** то, как подключать модуль на страницу. */
    mountMode: MountMode;
    /** Подключать ли скрипты модуля как esm-модули */
    esmMode?: boolean;
    /** предподготовленное "состояние" модуля, которое он получит при монтировании на страницу */
    moduleState: ModuleState;
};

export type LoaderResult<ModuleExportType> = {
    unmount: () => void;
    module: ModuleExportType;
    moduleResources: ModuleResources;
};

// Для того чтобы пользователям не приходилось передавать undefined если их загрузчик не принимает параметры
// мы делаем такой мини-хак
export type LoaderParams<GetResourcesParams> = {
    /**
     * Параметры, которые будут переданы в функцию получения ресурсов модуля
     */
    getResourcesParams?: GetResourcesParams;
    /**
     * Опциональный параметр, который используется для поиска элемента, в который нужно вставить css ресурсы модуля.
     */
    cssTargetSelector?: string;
    /**
     * Опциональный параметр, который используется для отмены запроса на получение ресурсов модуля.
     */
    abortSignal?: AbortSignal;
};

/**
 * Функция, которая загружает модуль и подключает его на страницу.
 * Может принимать дополнительные параметры, которые будут переданы в функцию получения ресурсов модуля.
 * Возвращает промис, содержащий сам модуль и функцию, которая удаляет ресурсы модуля со страницы.
 */
export type Loader<GetResourcesParams, ModuleExportType = unknown> = (
    params?: LoaderParams<GetResourcesParams>,
) => Promise<LoaderResult<ModuleExportType>>;

// Описание типов модулей

export type ModuleFederationContainer = {
    init: (...args: unknown[]) => Promise<void>;
    get<T>(id: string): Promise<() => T>;
};
