
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface Business {
  id: string;
  name: string;
  whatsapp: string;
  address: string;
  workingHours: string;
  deliveryFee: number;
  bankDetails: string;
  tone: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  category: string;
  image?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerWhatsapp: string;
  items: { productId: string; quantity: number; price: number; name: string }[];
  totalAmount: number;
  deliveryAddress: string;
  status: OrderStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: 'customer' | 'ai' | 'human';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerWhatsapp: string;
  lastMessage: string;
  lastSeen: string;
  handledBy: 'ai' | 'human';
  messages: Message[];
}

export interface User {
  id: string;
  email: string;
  businessId: string;
}
