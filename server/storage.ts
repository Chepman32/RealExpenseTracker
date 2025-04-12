import { users, orders, reviews, orderLoaders, User, InsertUser, Order, InsertOrder, Review, InsertReview, OrderLoader } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, inArray } from "drizzle-orm";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Interface for all storage operations
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
  sessionStore: session.Store;
}

// Implementation using PostgreSQL database
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Make sure to handle nullable fields that might cause type issues
    const userToInsert = {
      ...insertUser,
      description: insertUser.description || null,
      vehicleType: insertUser.vehicleType || null,
      workAreas: insertUser.workAreas || [],
      vehicleCapacity: insertUser.vehicleCapacity || null,
      vehiclePhoto: insertUser.vehiclePhoto || null,
      profilePicture: insertUser.profilePicture || null,
      phone: insertUser.phone || null,
      rating: insertUser.rating || null
    };
    
    const [user] = await db.insert(users).values(userToInsert).returning();
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    // Ensure nullable fields are properly handled
    const updateData = {
      ...data,
      description: data.description || null,
      vehicleType: data.vehicleType || null,
      vehicleCapacity: data.vehicleCapacity || null,
      vehiclePhoto: data.vehiclePhoto || null,
      profilePicture: data.profilePicture || null,
      phone: data.phone || null,
      rating: data.rating || null,
      workAreas: data.workAreas || []
    };
    
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  async getCarriersByLocation(location: string): Promise<User[]> {
    // For simplicity, get all carriers and filter in memory
    // This is a workaround for the array search functionality
    const allCarriers = await db
      .select()
      .from(users)
      .where(eq(users.role, 'carrier'));
      
    return allCarriers.filter(carrier => 
      carrier.workAreas && carrier.workAreas.includes(location)
    );
  }
  
  async getLoadersByLocation(location: string): Promise<User[]> {
    // For simplicity, get all loaders and filter in memory
    // This is a workaround for the array search functionality
    const allLoaders = await db
      .select()
      .from(users)
      .where(eq(users.role, 'loader'));
      
    return allLoaders.filter(loader => 
      loader.workAreas && loader.workAreas.includes(location)
    );
  }
  
  async getAllCarriers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, 'carrier'));
  }
  
  async getAllLoaders(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, 'loader'));
  }
  
  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    // Convert the scheduledDate string to a Date object if needed
    const scheduledDate = typeof insertOrder.scheduledDate === 'string' 
      ? new Date(insertOrder.scheduledDate) 
      : insertOrder.scheduledDate;
    
    // Create a properly typed order insert object
    const [order] = await db
      .insert(orders)
      .values({
        clientId: insertOrder.clientId,
        categoryType: insertOrder.categoryType,
        description: insertOrder.description,
        pickupAddress: insertOrder.pickupAddress,
        deliveryAddress: insertOrder.deliveryAddress,
        scheduledDate: scheduledDate,
        vehicleType: insertOrder.vehicleType,
        needLoaders: insertOrder.needLoaders,
        photos: insertOrder.photos || [],
        price: insertOrder.price,
        status: 'pending',
        carrierId: null,
        updatedAt: new Date()
      })
      .returning();
    
    return order;
  }
  
  async getOrdersByClientId(clientId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.clientId, clientId));
  }
  
  async getOrdersByCarrierId(carrierId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.carrierId, carrierId));
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    return order;
  }
  
  async updateOrder(id: number, data: Partial<Order>): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }
  
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }
  
  // Reviews
  async createReview(insertReview: InsertReview): Promise<Review> {
    // Handle nullable fields to avoid type issues
    const reviewToInsert = {
      ...insertReview,
      comment: insertReview.comment || null
    };
    
    const [review] = await db
      .insert(reviews)
      .values(reviewToInsert)
      .returning();
    return review;
  }
  
  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.toUserId, userId));
  }
  
  // Order Loaders
  async assignLoaderToOrder(orderId: number, loaderId: number): Promise<OrderLoader> {
    const [orderLoader] = await db
      .insert(orderLoaders)
      .values({ orderId, loaderId })
      .returning();
    return orderLoader;
  }
  
  async getLoadersByOrderId(orderId: number): Promise<number[]> {
    const loaders = await db
      .select()
      .from(orderLoaders)
      .where(eq(orderLoaders.orderId, orderId));
    return loaders.map(ol => ol.loaderId);
  }
}

// Export database storage instead of memory storage
export const storage = new DatabaseStorage();
