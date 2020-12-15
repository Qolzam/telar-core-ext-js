import { IApplicationBuilder } from '@telar/core/IApplicationBuilder';
import { IEndpointRouteBuilder } from '@telar/core/IEndpointRouteBuilder';
import Router from '@koa/router';
import { COMMON } from '@telar/core';
import urlJoin from 'url-join';

declare module '@telar/core/IApplicationBuilder' {
    /**
     * Constains extensions for configuring routing
     */
    export interface IApplicationBuilder<StateT, CustomT> {
        /**
         * Apply endpoints
         */
        useEndpoints(configure: (endpoints: IEndpointRouteBuilder) => void): IApplicationBuilder<StateT, CustomT>;

        /**
         * Add the routing middleware
         */
        useRouting(opt?: Router.RouterOptions): IApplicationBuilder<StateT, CustomT>;
    }
}

IApplicationBuilder.prototype.useRouting = function (opt?: Router.RouterOptions) {
    const coresettings = this.properties['config'].coresettings;
    let routerOpt: Router.RouterOptions = { prefix: '' };
    if (opt) {
        routerOpt = { ...opt };
    }
    if (coresettings.router && coresettings.router.prefix && routerOpt.prefix !== undefined) {
        routerOpt.prefix = urlJoin(coresettings.router.prefix, routerOpt.prefix);
    }

    const router = new Router(routerOpt);
    this.use(router.routes()).use(router.allowedMethods());
    this.properties[COMMON.routerRegisterd] = true;
    this.properties[COMMON.router] = router;
    return this;
};

IApplicationBuilder.prototype.useEndpoints = function (configure: (endpoints: IEndpointRouteBuilder) => void) {
    if (this.properties[COMMON.routerRegisterd]) {
        configure(this.properties[COMMON.router]);
    } else {
        throw new Error('Please call IApplicationBuilder.useRouting before calling IApplicationBuilder.useEndpoints.');
    }
    return this;
};
