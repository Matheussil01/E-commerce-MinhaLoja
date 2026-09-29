export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELED";
