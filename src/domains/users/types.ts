// User domain types
import type { 
  User as GeneratedUser
} from '@/lib/charon-client/generated';

export interface User extends GeneratedUser {}

export interface CreateUserRequest extends Partial<User> {}

export interface UpdateUserRequest extends Partial<User> {}

export interface UserProfile extends User {
  accountId?: string;
} 