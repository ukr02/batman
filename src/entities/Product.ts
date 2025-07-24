export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
}

export class ProductEntity {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: Product) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category;
    this.created_at = data.created_at ? new Date(data.created_at) : undefined;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : undefined;
  }

  static validate(data: CreateProductRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (data.price === undefined || data.price === null) {
      errors.push('Price is required');
    } else if (data.price < 0) {
      errors.push('Price must be non-negative');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON(): Product {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
} 