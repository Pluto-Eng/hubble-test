// User domain types
import { BaseEntity } from '../../shared/types';

export interface User extends BaseEntity {
  type: 'individual' | 'manager' | 'admin';
  nameGiven: string;
  nameMiddle?: string;
  nameFamily: string;
  email: string;
  phone?: string;
  secId?: string;
  cognitoUsername?: string;
}

export interface CreateUserRequest {
  type?: User['type'];
  nameGiven: string;
  nameMiddle?: string;
  nameFamily: string;
  email: string;
  phone?: string;
  secId?: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {}

export interface UserProfile extends User {
  accountId?: string;
} 