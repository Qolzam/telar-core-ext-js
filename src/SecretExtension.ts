import { IApplicationBuilder } from '@telar/core/IApplicationBuilder';
import { decrypt } from './utils/crypt';
// import bodyParser from 'koa-bodyparser';
declare module '@telar/core/IApplicationBuilder' {
    /**
     * Constains extensions for configuring routing
     */
    export interface IApplicationBuilder<StateT, CustomT> {
        /**
         * Add the routing middleware
         */
        useSecret(): IApplicationBuilder<StateT, CustomT>;
    }
}

IApplicationBuilder.prototype.useSecret = function () {
    const { appsettings, secret } = this.properties.config;
    if (appsettings.sercretKey && secret && Object.keys(secret).length) {
        let newSecret = {};
        const secretNames = Object.keys(secret);
        secretNames.forEach((name) => {
            const secretValue = secret[name];
            newSecret = {
                ...newSecret,
                [name]: decrypt(secretValue, Buffer.from(appsettings.sercretKey, 'base64').toString()),
            };
        });
        this.properties.config.secret = newSecret;
        // eslint-disable-next-line no-console
        console.log(newSecret);
    }
    return this;
};
