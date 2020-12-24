import { IServiceCollection } from '@telar/core/IServiceCollection';
import { Secret, SecretType } from './Secret';
import { decrypt } from './utils/crypt';
// import bodyParser from 'koa-bodyparser';
declare module '@telar/core/IServiceCollection' {
    /**
     * Constains extensions for configuring routing
     */
    export interface IServiceCollection {
        /**
         * Add secret into service collection
         */
        addSecret(): IServiceCollection;
    }
}

IServiceCollection.prototype.addSecret = function () {
    const { appsettings, secret } = this.properties.config;
    if (appsettings.secret_key && secret && Object.keys(secret).length) {
        const newSecret: Secret = new Secret();
        const secretNames = Object.keys(secret);
        secretNames.forEach((name) => {
            const secretValue = secret[name];
            newSecret[name] = decrypt(secretValue, Buffer.from(appsettings.secret_key, 'base64').toString('ascii'));
        });

        this.bind(SecretType).toConstantValue(newSecret);
    }
    return this;
};
