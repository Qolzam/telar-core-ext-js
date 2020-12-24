// Copyright (c) 2020 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as path from 'path';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Crypt = require('hybrid-crypto-js').Crypt;

/**
 * Initialize hybrid crypto
 * @returns {*} crypt object
 */
const init = () => {
    // Select AES or RSA standard
    const crypt = new Crypt({
        rsaStandard: 'RSA-OAEP',
    });

    return crypt;
};

const crypt = init();

/**
 * Get private key
 * @param {string} keyPath `private.key` file path
 * @returns {string} private key
 */
export const getPrivateKey = function (keyPath = './private.key') {
    const publicKey = fs.readFileSync(path.resolve(keyPath), 'utf8');
    return publicKey;
};

/**
 * Get public key
 * @param {string} keyPath `public.key` file path
 * @returns {string} public key
 */
export const gePublictKey = function (keyPath = './public.key'): string {
    const publicKey = fs.readFileSync(path.resolve(keyPath), 'utf8');
    return publicKey;
};

/**
 * Encrypt the message
 * @param {string} message the string value to encrypt
 * @param {string} publicKey the public key
 * @returns {string} encrypted base64
 */
export const encrypt = function (message: string, publicKey: string) {
    const encrypted = crypt.encrypt(publicKey, message);

    const encryptedBase64 = Buffer.from(encrypted).toString('base64');
    return encryptedBase64;
};

/**
 * Decrypt the encryptedBase64
 * @param {string} encryptedBase64 the encrypted base64 value to decrypt
 * @param {string} privateKey the private key
 * @returns {string} decrypted value
 */
export const decrypt = function (encryptedBase64: string, privateKey: string) {
    const decrypted = crypt.decrypt(privateKey, Buffer.from(encryptedBase64, 'base64').toString('ascii'));
    return decrypted.message;
};
