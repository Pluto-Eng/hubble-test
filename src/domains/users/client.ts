// Users API client
import { ApiClient } from '@/lib/api-client';
import { User, CreateUserRequest, UpdateUserRequest } from '@/domains/users/types';

export class UsersClient extends ApiClient {
  constructor(baseUrl: any = 'api/proxy/') {
    super('users', baseUrl);
  }

  async getUsers() {
    return this.get<User>('/admin/users');
  }

  async getUser(id: string) {
    return this.get<User>(`/admin/users/${id}`);
  }

  async createUser(data: CreateUserRequest) {
    return this.post<User>(`/admin/users`, data);
  }

  async updateUser(id: string, data: UpdateUserRequest) {
    return this.put<User>(`/admin/users/${id}`, data);
  }

  async deleteUser(id: string) {
    return this.delete(`/admin/users/${id}`);
  }
}
