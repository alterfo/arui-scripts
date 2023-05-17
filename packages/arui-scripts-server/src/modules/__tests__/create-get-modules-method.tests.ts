import { createGetModulesMethod } from '../create-get-modules-method';
import { getAppManifest, readAssetsManifest } from '../../read-assets-manifest';

jest.mock('../../read-assets-manifest', () => ({
    readAssetsManifest: jest.fn(),
    getAppManifest: jest.fn(),
}));

describe('createGetModulesMethod', () => {
    it('should return method description with correct http method and path', () => {
        const { method, path } = createGetModulesMethod({});
        expect(method).toBe('POST');
        expect(path).toBe('/api/getModuleResources');
    });

    it('should throw error if requested module not found in modules config', async () => {
        const { handler } = createGetModulesMethod({});

        await expect(
            handler({ moduleId: 'test', hostAppId: 'test', params: undefined }),
        ).rejects.toThrowError('Module test not found');
    });

    it('should return correct response for embedded module', async () => {
        (readAssetsManifest as any).mockImplementationOnce(() => Promise.resolve({
            js: ['vendor.js', 'main.js'],
            css: ['vendor.css', 'main.css'],
        }));
        (getAppManifest as any).mockImplementationOnce(() => Promise.resolve({
            __metadata__: {
                name: 'module-app-name',
            },
        }));
        const getModuleState = jest.fn(() => Promise.resolve({ baseUrl: '' }));
        const { handler } = createGetModulesMethod({
            test: {
                mountMode: 'embedded',
                getModuleState,
                version: '1.0.0',
            },
        });

        const result = await handler({ moduleId: 'test', hostAppId: 'test', params: undefined });

        expect(result).toEqual({
            mountMode: 'embedded',
            moduleVersion: '1.0.0',
            scripts: ['vendor.js', 'main.js'],
            styles: ['vendor.css', 'main.css'],
            moduleRunParams: { contextRoot: '' },
            appName: 'module-app-name',
        });

        expect(getModuleState).toBeCalledWith({ moduleId: 'test', hostAppId: 'test' });
    });

    it('should return correct response for mf module', async () => {
        (getAppManifest as any).mockImplementationOnce(() => Promise.resolve({
            __metadata__: {
                name: 'module-app-name',
            },
        }));

        const getModuleState = jest.fn(() => Promise.resolve({ baseUrl: '' }));
        const { handler } = createGetModulesMethod({
            test: {
                mountMode: 'mf',
                getModuleState,
                version: '1.0.0',
            },
        });

        const result = await handler({ moduleId: 'test', hostAppId: 'test', params: undefined });

        expect(result).toEqual({
            mountMode: 'mf',
            moduleVersion: '1.0.0',
            scripts: ['assets/remoteEntry.js'],
            styles: [],
            moduleRunParams: { contextRoot: '' },
            appName: 'module-app-name',
        });

        expect(getModuleState).toBeCalledWith({ moduleId: 'test', hostAppId: 'test' });
    });
});
