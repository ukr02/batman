export interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export class UserEntity {
  id?: number;
  name: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.created_at = data.created_at ? new Date(data.created_at) : undefined;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : undefined;
  }

  static validate(data: CreateUserRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!data.email || data.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toJSON(): User {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
} 