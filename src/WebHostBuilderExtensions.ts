import { Container } from 'inversify';
import { ApplicationBuilder } from '@telar/core/ApplicationBuilder';
import { COMMON } from '@telar/core/constants';
import { IConfiguration } from '@telar/core/IConfiguration';
import { IBootstrap } from '@telar/core/IBootstrap';
import { IWebHostBuilder } from '@telar/core/IWebHostBuilder';
import { ServiceCollection } from '@telar/core/ServiceCollection';
import { ServiceProvider } from '@telar/core/ServiceProvider';
import { WebHostEnvironment } from '@telar/core/WebHostEnvironment';

declare module '@telar/core/IWebHostBuilder' {
    interface IWebHostBuilder {
        /**
         * Specify a factory that creates the startup instance to be used by the web host.
         */
        useBootstrap<TBootstrap extends IBootstrap>(
            type: new (configuration: IConfiguration) => TBootstrap,
        ): Promise<IWebHostBuilder>;
    }
}

IWebHostBuilder.prototype.useBootstrap = async function useBootstrap<TBootstrap extends IBootstrap>(
    type: new (configuration: IConfiguration) => TBootstrap,
) {
    const startup = new type(this.getSettings());
    await startup.configureServices(
        new ServiceCollection(this.properties, this.properties[COMMON.container] as Container),
    );
    startup.configure(
        new ApplicationBuilder(this.properties, new ServiceProvider(this.properties[COMMON.container] as Container)),
        new WebHostEnvironment('telar', process.env.NODE_ENV as string),
    );
    return this;
};
