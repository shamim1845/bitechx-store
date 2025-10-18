// Shared types
export type Category = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  category: Category;
};

export type CreateProductInput = {
  name: string;
  description: string;
  images: string[];
  price: number;
  categoryId: string;
};

export type UpdateProductInput = Partial<
  Pick<
    CreateProductInput,
    "name" | "description" | "images" | "price" | "categoryId"
  >
>;
