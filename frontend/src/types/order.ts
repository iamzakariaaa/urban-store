export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItemDTO {
  id: number;
  productId: number;
  productName:string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface OrderResponse {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItemDTO[];
  createdAt: string;
}
