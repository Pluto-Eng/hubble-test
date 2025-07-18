import { ApiClient } from "@/lib/api-client";
import { api } from "@/lib/config";

class UserClient extends ApiClient {
    constructor(token: string) {
        super(api.baseUrl, token);
    }

    async update(userId: string, data: any) {
        return this.post(`/users/${userId}`, data);
    }
}

export const userClient = new UserClient(api.baseUrl);