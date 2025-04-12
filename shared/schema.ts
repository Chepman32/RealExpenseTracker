import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User role enum
export const UserRole = {
  CLIENT: "client",
  CARRIER: "carrier",
  LOADER: "loader",
  ADMIN: "admin",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// User status enum
export const UserStatus = {
  ACTIVE: "active",
  PENDING: "pending",
  SUSPENDED: "suspended",
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

// Order status enum
export const OrderStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

// Vehicle type enum
export const VehicleType = {
  PICKUP: "pickup",
  BOX_TRUCK: "box_truck",
} as const;

export type VehicleTypeType = (typeof VehicleType)[keyof typeof VehicleType];

// Category type enum
export const CategoryType = {
  FURNITURE: "furniture",
  ELECTRONICS: "electronics",
  APPLIANCES: "appliances",
  BOXES: "boxes",
  OTHER: "other",
} as const;

export type CategoryTypeType = (typeof CategoryType)[keyof typeof CategoryType];

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default(UserRole.CLIENT),
  status: text("status").notNull().default(UserStatus.ACTIVE),
  profilePicture: text("profile_picture"),
  workAreas: text("work_areas").array(),
  vehicleType: text("vehicle_type"),
  vehicleCapacity: text("vehicle_capacity"),
  vehiclePhoto: text("vehicle_photo"),
  description: text("description"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Carriers & Loaders Profile Schema for zod validation
export const userProfileSchema = z.object({
  workAreas: z.array(z.string()).optional(),
  vehicleType: z.enum([VehicleType.PICKUP, VehicleType.BOX_TRUCK]).optional(),
  vehicleCapacity: z.string().optional(),
  vehiclePhoto: z.string().optional(),
  description: z.string().optional(),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  carrierId: integer("carrier_id"),
  categoryType: text("category_type").notNull(),
  description: text("description").notNull(),
  pickupAddress: text("pickup_address").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  needLoaders: integer("need_loaders").default(0),
  photos: text("photos").array(),
  status: text("status").notNull().default(OrderStatus.PENDING),
  price: integer("price"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Order loaders table
export const orderLoaders = pgTable("order_loaders", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  loaderId: integer("loader_id").notNull(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  fromUserId: integer("from_user_id").notNull(),
  toUserId: integer("to_user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert User Schema
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true })
  .extend({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    role: z.enum([UserRole.CLIENT, UserRole.CARRIER, UserRole.LOADER, UserRole.ADMIN]),
  });

// Insert Order Schema
export const insertOrderSchema = createInsertSchema(orders)
  .omit({ id: true, status: true, createdAt: true, updatedAt: true, carrierId: true })
  .extend({
    categoryType: z.enum([
      CategoryType.FURNITURE, 
      CategoryType.ELECTRONICS, 
      CategoryType.APPLIANCES, 
      CategoryType.BOXES, 
      CategoryType.OTHER
    ]),
    vehicleType: z.enum([VehicleType.PICKUP, VehicleType.BOX_TRUCK]),
    scheduledDate: z.string(),
    needLoaders: z.number().min(0).max(2),
  });

// Insert Review Schema
export const insertReviewSchema = createInsertSchema(reviews)
  .omit({ id: true, createdAt: true })
  .extend({
    rating: z.number().min(1).max(5),
  });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type OrderLoader = typeof orderLoaders.$inferSelect;
