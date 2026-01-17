
import { Business, Product, FAQ, Order, Conversation, User, OrderStatus } from '../types';

const STORAGE_KEY = 'replyrush_db';

interface DB {
  user: User | null;
  business: Business;
  products: Product[];
  faqs: FAQ[];
  orders: Order[];
  conversations: Conversation[];
}

const DEFAULT_DB: DB = {
  user: null,
  business: {
    id: 'b1',
    name: 'Obinna Electronics',
    whatsapp: '+2348012345678',
    address: 'Computer Village, Ikeja, Lagos',
    workingHours: '9 AM - 6 PM, Mon-Sat',
    deliveryFee: 2500,
    bankDetails: 'Zenith Bank, 1234567890, Obinna Tech LTD',
    tone: 'Professional and polite Nigerian tone'
  },
  products: [
    { id: 'p1', name: 'iPhone 15 Pro Max', description: '256GB, Titanium Blue', price: 1850000, inStock: true, category: 'Phones' },
    { id: 'p2', name: 'Samsung S24 Ultra', description: '512GB, Gray', price: 1650000, inStock: true, category: 'Phones' },
    { id: 'p3', name: 'MacBook Air M3', description: '8GB RAM, 256GB SSD', price: 1400000, inStock: true, category: 'Laptops' },
    { id: 'p4', name: 'AirPods Pro 2', description: 'MagSafe Charging Case', price: 320000, inStock: true, category: 'Audio' },
    { id: 'p5', name: 'Dell XPS 13', description: 'i7 12th Gen, 16GB RAM', price: 950000, inStock: false, category: 'Laptops' }
  ],
  faqs: [
    { id: 'f1', question: 'Do you deliver outside Lagos?', answer: 'Yes, we deliver nationwide via GIGM and Red Star Express. Delivery to other states takes 3-5 working days.' },
    { id: 'f2', question: 'Do you offer pay on delivery?', answer: 'Currently, we only accept payment before dispatch for all items.' },
    { id: 'f3', question: 'Where is your shop located?', answer: 'We are located at Suite 45, Trinity Plaza, Computer Village, Ikeja, Lagos.' }
  ],
  orders: [
    { id: 'o1', customerName: 'Tunde Afolabi', customerWhatsapp: '+2347031122334', items: [{ productId: 'p1', quantity: 1, price: 1850000, name: 'iPhone 15 Pro Max' }], totalAmount: 1852500, deliveryAddress: 'Lekki Phase 1, Lagos', status: OrderStatus.CONFIRMED, createdAt: new Date().toISOString() }
  ],
  conversations: [
    { 
      id: 'c1', 
      customerName: 'Tunde Afolabi', 
      customerWhatsapp: '+2347031122334', 
      lastMessage: 'I want to buy the iPhone 15 Pro Max', 
      lastSeen: new Date().toISOString(), 
      handledBy: 'ai',
      messages: [
        { id: 'm1', sender: 'customer', content: 'Hello, how much is the iPhone 15 Pro Max?', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'm2', sender: 'ai', content: 'Good day boss! The iPhone 15 Pro Max (256GB) is currently 1,850,000 Naira. We have it in stock. Would you like to place an order?', timestamp: new Date(Date.now() - 3500000).toISOString() }
      ]
    }
  ]
};

export const getDb = (): DB => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_DB;
};

export const saveDb = (db: DB) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const updateBusiness = (business: Business) => {
  const db = getDb();
  db.business = business;
  saveDb(db);
};

export const upsertProduct = (product: Product) => {
  const db = getDb();
  const index = db.products.findIndex(p => p.id === product.id);
  if (index > -1) db.products[index] = product;
  else db.products.push(product);
  saveDb(db);
};

export const deleteProduct = (id: string) => {
  const db = getDb();
  db.products = db.products.filter(p => p.id !== id);
  saveDb(db);
};

export const upsertFaq = (faq: FAQ) => {
  const db = getDb();
  const index = db.faqs.findIndex(f => f.id === faq.id);
  if (index > -1) db.faqs[index] = faq;
  else db.faqs.push(faq);
  saveDb(db);
};

export const deleteFaq = (id: string) => {
  const db = getDb();
  db.faqs = db.faqs.filter(f => f.id !== id);
  saveDb(db);
};

export const addOrder = (order: Order) => {
  const db = getDb();
  db.orders.unshift(order);
  saveDb(db);
};

export const updateOrderStatus = (id: string, status: OrderStatus) => {
  const db = getDb();
  const order = db.orders.find(o => o.id === id);
  if (order) order.status = status;
  saveDb(db);
};

export const updateConversation = (conv: Conversation) => {
  const db = getDb();
  const index = db.conversations.findIndex(c => c.customerWhatsapp === conv.customerWhatsapp);
  if (index > -1) db.conversations[index] = conv;
  else db.conversations.push(conv);
  saveDb(db);
};
