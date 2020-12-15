import 'reflect-metadata';
import { IHostConfig } from '@telar/core/Host';
import { IHostBuilder } from '@telar/core/IHostBuilder';
import { IWebHostBuilder } from '@telar/core/IWebHostBuilder';
import { WebHostBuilder } from '@telar/core/WebHostBuilder';
import Koa from 'koa';
import { Container } from 'inversify';
import { METADATA_KEY } from '@telar/core/constants';
import { ServiceProvider } from '@telar/core/ServiceProvider';
import bodyParser from 'koa-bodyparser';

declare module '@telar/core/IHostBuilder' {
    interface IHostBuilder {
        /**
         * Configures a IHostBuilder with defaults for hosting a web app.
         */
        configureDefaultMicroService(configure: (webBuilder: IWebHostBuilder) => Promise<void>): Promise<IHostBuilder>;
    }
}

IHostBuilder.prototype.configureDefaultMicroService = async function (
    configure: (webBuilder: IWebHostBuilder) => Promise<void>,
) {
    this.properties.container = new Container({
        defaultScope: 'Singleton',
    });

    const app = new Koa();
    app.use(async (ctx, next) => {
        const container = (this.properties.container as Container).createChild();
        Reflect.defineMetadata(METADATA_KEY.httpContext, container, ctx);
        ctx.requestServices = new ServiceProvider(container);
        await next();
    });

    // Set body parser
    function hybridBodyParser(opts?: any) {
        const bp = bodyParser(opts);
        return async (ctx: any, next: any) => {
            ctx.request.body = ctx.request.body || ctx.req.body;
            return bp(ctx, next);
        };
    }
    app.use(hybridBodyParser());
    this.properties.context = app;
    await configure(new WebHostBuilder(this.properties['config'] as IHostConfig, this.properties));
    return this;
};
