// Users API client
import { ApiClient } from '@/lib/api-client';
import { User, CreateUserRequest, UpdateUserRequest, UserProfile } from './types';

export class UsersClient extends ApiClient {
  constructor(authToken?: string) {
    super('users', '/admin/users', authToken);
  }

  async getUsers(params?: any): Promise<User[]> {
    const response = await this.getAll<User>(params);
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    return this.getById<User>(id);
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    return this.create<User>(data);
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    return this.update<User>(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.delete(id);
  }
}

export class UserProfileClient extends BaseApiClient {
  constructor(authToken?: string) {
    super('/user/profile', authToken);
  }

  async getProfile(): Promise<UserProfile> {
    const response = await this.request<UserProfile>('GET');
    return response.data;
  }

  async updateProfile(data: UpdateUserRequest): Promise<UserProfile> {
    const response = await this.request<UserProfile>('PUT', '', data);
    return response.data;
  }
} 