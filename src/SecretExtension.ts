import { IServiceCollection } from '@telar/core/IServiceCollection';
import { Secret, SecretType } from './Secret';
import { decrypt } from './utils/crypt';

declare module '@telar/core/IServiceCollection' {
    /**
     * Constains extensions for configuring routing
     */
    export interface IServiceCollection {
        /**
         * Add secret into service collection
         */
        addSecret(secretKey: string): IServiceCollection;
    }
}

IServiceCollection.prototype.addSecret = function (secretKey: string) {
    const { secret } = this.properties.config;
    if (secretKey && secret && Object.keys(secret).length) {
        const newSecret: Secret = new Secret();
        const secretNames = Object.keys(secret);
        secretNames.forEach((name) => {
            const secretValue = secret[name];
            newSecret[name] = decrypt(secretValue, Buffer.from(secretKey, 'base64').toString('ascii'));
        });

        this.bind(SecretType).toConstantValue(newSecret);
    }
    return this;
};
