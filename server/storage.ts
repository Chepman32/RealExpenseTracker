import { users, orders, reviews, orderLoaders, User, InsertUser, Order, InsertOrder, Review, InsertReview, OrderLoader } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  getCarriersByLocation(location: string): Promise<User[]>;
  getLoadersByLocation(location: string): Promise<User[]>;
  getAllCarriers(): Promise<User[]>;
  getAllLoaders(): Promise<User[]>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersByClientId(clientId: number): Promise<Order[]>;
  getOrdersByCarrierId(carrierId: number): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  updateOrder(id: number, data: Partial<Order>): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  
  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByUserId(userId: number): Promise<Review[]>;
  
  // Order Loaders
  assignLoaderToOrder(orderId: number, loaderId: number): Promise<OrderLoader>;
  getLoadersByOrderId(orderId: number): Promise<number[]>;
  
  // Session Store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private orders: Map<number, Order>;
  private reviews: Map<number, Review>;
  private orderLoaders: Map<number, OrderLoader>;
  
  currentUserId: number;
  currentOrderId: number;
  currentReviewId: number;
  currentOrderLoaderId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    this.orderLoaders = new Map();
    
    this.currentUserId = 1;
    this.currentOrderId = 1;
    this.currentReviewId = 1;
    this.currentOrderLoaderId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getCarriersByLocation(location: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === 'carrier' && user.workAreas?.includes(location)
    );
  }
  
  async getLoadersByLocation(location: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === 'loader' && user.workAreas?.includes(location)
    );
  }
  
  async getAllCarriers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === 'carrier'
    );
  }
  
  async getAllLoaders(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === 'loader'
    );
  }
  
  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date(),
      status: 'pending',
      updatedAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }
  
  async getOrdersByClientId(clientId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.clientId === clientId
    );
  }
  
  async getOrdersByCarrierId(carrierId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.carrierId === carrierId
    );
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async updateOrder(id: number, data: Partial<Order>): Promise<Order | undefined> {
    const order = await this.getOrderById(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...data, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  // Reviews
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: new Date() 
    };
    this.reviews.set(id, review);
    return review;
  }
  
  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.toUserId === userId
    );
  }
  
  // Order Loaders
  async assignLoaderToOrder(orderId: number, loaderId: number): Promise<OrderLoader> {
    const id = this.currentOrderLoaderId++;
    const orderLoader: OrderLoader = { id, orderId, loaderId };
    this.orderLoaders.set(id, orderLoader);
    return orderLoader;
  }
  
  async getLoadersByOrderId(orderId: number): Promise<number[]> {
    return Array.from(this.orderLoaders.values())
      .filter((ol) => ol.orderId === orderId)
      .map((ol) => ol.loaderId);
  }
}

export const storage = new MemStorage();
