export interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
  };
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}
