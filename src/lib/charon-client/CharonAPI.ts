/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './generated/core/BaseHttpRequest';
import type { OpenAPIConfig } from './generated/core/OpenAPI';
import { FetchHttpRequest } from './generated/core/FetchHttpRequest';
import { AccountsService } from './generated/services/AccountsService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class CharonAPI {
    public readonly accounts: AccountsService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'http://localhost:3000',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.accounts = new AccountsService();
    }
}
