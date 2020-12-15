import { IHostEnvironment } from '@telar/core/IHostEnvironment';

/**
 * Extension methods for IHostEnvironment.
 */
declare module '@telar/core/IHostEnvironment' {
    interface IHostEnvironment {
        /**
         * Checks if the current host environment name is development.
         */
        isDevelopment(): boolean;

        /**
         * Compares the current host environment name against the specified value.
         */
        isEnvironment(environmentName: string): boolean;

        /**
         * Checks if the current host environment name production.
         */
        isProduction(): boolean;

        /**
         * Checks if the current host environment name is staging.
         */
        isStaging(): boolean;

        /**
         * Checks if the current host environment name is test.
         */
        isTest(): boolean;
    }
}

IHostEnvironment.prototype.isDevelopment = function () {
    return process.env.NODE_ENV === 'development';
};

IHostEnvironment.prototype.isProduction = function () {
    return process.env.NODE_ENV === 'production';
};

IHostEnvironment.prototype.isTest = function () {
    return process.env.NODE_ENV === 'test';
};

IHostEnvironment.prototype.isTest = function () {
    return (process.env.NODE_ENV as 'staging') === 'staging';
};

IHostEnvironment.prototype.isEnvironment = function (environmentName: string) {
    return process.env.NODE_ENV === environmentName;
};
