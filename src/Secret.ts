import { injectable } from 'inversify';

@injectable()
export class Secret {
    [key: string]: string;
}

export const SecretType = Symbol.for('Secret');
