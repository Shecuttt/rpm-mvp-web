export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
