import { decorate, injectable } from 'inversify';
import { Controller } from '@telar/mvc';
import { IServiceCollection } from '@telar/core/IServiceCollection';
declare module '@telar/core/IServiceCollection' {
    /**
     * Constains extensions for configuring routing
     */
    export interface IServiceCollection {
        /**
         * Add the routing middleware
         */
        addMVC(): IServiceCollection;
    }
}

IServiceCollection.prototype.addMVC = function () {
    try {
        decorate(injectable(), Controller);
    } catch (error) {
        // FIXME: should fix this error
        // eslint-disable-next-line no-console
        console.log('[WARN] Cannot apply @injectable decorator multiple times.');
    }
    return this;
};
