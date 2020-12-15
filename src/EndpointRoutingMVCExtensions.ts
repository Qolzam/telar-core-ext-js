import { bindWithRouter } from '@telar/mvc';
import { COMMON } from '@telar/core';
import { IApplicationBuilder } from '@telar/core/IApplicationBuilder';
// import bodyParser from 'koa-bodyparser';
declare module '@telar/core/IApplicationBuilder' {
    /**
     * Constains extensions for configuring routing
     */
    export interface IApplicationBuilder<StateT, CustomT> {
        /**
         * Add the routing middleware
         */
        useMVC(controllers: symbol[]): IApplicationBuilder<StateT, CustomT>;
    }
}

IApplicationBuilder.prototype.useMVC = function (controllers: symbol[]) {
    if (this.properties[COMMON.routerRegisterd]) {
        bindWithRouter(this.properties[COMMON.router], this.properties[COMMON.container], controllers);
    } else {
        throw new Error('Please call IApplicationBuilder.useRouting before calling IApplicationBuilder.useEndpoints.');
    }

    return this;
};
