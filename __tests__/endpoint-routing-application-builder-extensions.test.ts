import { IServiceCollection } from '@telar/core/IServiceCollection';
import { IApplicationBuilder } from '@telar/core/IApplicationBuilder';
import { IConfiguration } from '@telar/core/IConfiguration';
import { Host } from '@telar/core/Host';
import { IBootstrap } from '@telar/core/IBootstrap';
import { IWebHostEnvironment } from '@telar/core/IWebHostEnvironment';
import '../src/HostBuilderExtension';
import '../src/EndpointRoutingApplicationBuilderExtensions';
import '../src/HostEnvironmentEnvExtensions';
import { Context } from '@telar/mvc';

describe('Endpoint routing application builder extensions', () => {
    class MyClass {}

    class Bootstrap extends IBootstrap {
        private _configuration: IConfiguration;
        public constructor(configuration: IConfiguration) {
            super();
            this._configuration = configuration;
        }

        public get configuration(): IConfiguration {
            return this._configuration;
        }
        public set configuration(value: IConfiguration) {
            this._configuration = value;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public async configureServices(services: IServiceCollection): Promise<void> {
            services.bind(MyClass).to(MyClass);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public configure(app: IApplicationBuilder<any, {}>, env: IWebHostEnvironment): void {
            if (env.isDevelopment()) {
                // eslint-disable-next-line no-console
                console.log('[info] isDevelopment');
            }
            app.useRouting();
            app.useEndpoints((endpoint) => {
                endpoint.get('/', (ctx: Context<any>) => {
                    ctx.body = 'Hello World!';
                });
            });
        }
    }
    test('Should not throw error when using useEndpoints and useRouting', async () => {
        await Host.prototype.buildGlobalHost(Bootstrap);
    });
});
