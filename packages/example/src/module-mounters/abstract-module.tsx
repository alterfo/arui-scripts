import React from 'react';
import {
    BaseModuleState,
    createClientResourcesFetcher,
    createModuleLoader,
    MountableModule, useModuleLoader,
    useModuleMounter,
} from '@alfalab/scripts-modules';
import { Underlay } from '@alfalab/core-components/underlay';
import { Spinner } from '@alfalab/core-components/spinner';

const loader = createModuleLoader<any>({
    hostAppId: 'example',
    moduleId: 'ClientModuleAbstract',
    getModuleResources: createClientResourcesFetcher({
        baseUrl: 'http://localhost:8082',
    })
});

export const AbstractModule = () => {
    const { loadingState, module } = useModuleLoader({ loader });

    return (
        <Underlay padding='m' backgroundColor='info' shadow='shadow-s' borderSize={1} borderRadius='m'>
            { loadingState === 'pending' && <Spinner size='m' /> }
            { loadingState === 'rejected' && <div>Failed to load module</div> }

            {module && (<pre>{JSON.stringify(module, (key, value) => typeof value === 'function' ? `[Function ${value.name}]` : value, 2)}</pre>)}
        </Underlay>
    );
}
