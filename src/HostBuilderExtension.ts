import { HostHandler } from '@telar/core/application';
import EventBus from '@telar/core/EventBus';
import { Host } from '@telar/core/Host';
import { IBootstrap } from '@telar/core/IBootstrap';
import { IConfiguration } from '@telar/core/IConfiguration';
import './GenericHostBuilderExtensions';
import './WebHostBuilderExtensions';

declare module '@telar/core/Host' {
    interface Host {
        /**
         * Configures a IHostBuilder with defaults for hosting a web app.
         */
        buildGlobalHost<TBootstrap extends IBootstrap>(
            bootstrapType: new (configuration: IConfiguration) => TBootstrap,
            config?: any,
            evnentBus?: EventBus,
        ): Promise<HostHandler>;
    }
}

Host.prototype.buildGlobalHost = async function <TBootstrap extends IBootstrap>(
    bootstrapType: new (configuration: IConfiguration) => TBootstrap,
    config?: any,
    evnentBus?: EventBus,
): Promise<HostHandler> {
    /**
     * Get from cache
     */
    if ((global as any).webHostTelarCore) return (global as any).webHostTelarCore.run();

    const webHostPromise = Host.createDefaultConfig(config, evnentBus).configureDefaultMicroService(
        async (webBuild) => {
            await webBuild.useBootstrap(bootstrapType);
        },
    );

    const webHost = await webHostPromise;

    (global as any).webHostTelarCore = webHost;
    return webHost.run();
};
