import { ApiClient } from "@/lib/api-client";
import { Profile } from "@/domains/user/types";

export class UserClient extends ApiClient {
  constructor(baseUrl: any = "api/proxy/") {
    super("user", baseUrl);
  }

  async getProfile() {
    return this.get<Profile>("/user/profile");
  }

  async updateProfile(pFields: Partial<Profile>) {
    return this.put<Profile>("/user/profile", pFields);
  }
}

export const userClient = new UserClient();
