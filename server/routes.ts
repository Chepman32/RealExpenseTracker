import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertOrderSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Order routes
  app.post("/api/orders", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        clientId: req.user!.id
      });
      
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });
  
  app.get("/api/orders/client", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const orders = await storage.getOrdersByClientId(req.user!.id);
    res.json(orders);
  });
  
  app.get("/api/orders/carrier", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    if (req.user!.role !== 'carrier') {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const orders = await storage.getOrdersByCarrierId(req.user!.id);
    res.json(orders);
  });
  
  app.get("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const orderId = parseInt(req.params.id);
    const order = await storage.getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Only client, assigned carrier, or admin can see order details
    if (order.clientId !== req.user!.id && 
        order.carrierId !== req.user!.id && 
        req.user!.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.json(order);
  });
  
  app.patch("/api/orders/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrderById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check permissions for order update
      if (req.user!.role !== 'admin' && 
          (order.clientId !== req.user!.id && order.carrierId !== req.user!.id)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedOrder = await storage.updateOrder(orderId, req.body);
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  });
  
  // Carrier routes
  app.get("/api/carriers", async (req, res) => {
    const carriers = await storage.getAllCarriers();
    res.json(carriers);
  });
  
  app.get("/api/carriers/location/:location", async (req, res) => {
    const location = req.params.location;
    const carriers = await storage.getCarriersByLocation(location);
    res.json(carriers);
  });
  
  // Loader routes
  app.get("/api/loaders", async (req, res) => {
    const loaders = await storage.getAllLoaders();
    res.json(loaders);
  });
  
  app.get("/api/loaders/location/:location", async (req, res) => {
    const location = req.params.location;
    const loaders = await storage.getLoadersByLocation(location);
    res.json(loaders);
  });
  
  // Order loaders assignment
  app.post("/api/orders/:orderId/loaders/:loaderId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const orderId = parseInt(req.params.orderId);
      const loaderId = parseInt(req.params.loaderId);
      
      const order = await storage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Only client or admin can assign loaders
      if (order.clientId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const loader = await storage.getUser(loaderId);
      if (!loader || loader.role !== 'loader') {
        return res.status(404).json({ message: "Loader not found" });
      }
      
      const result = await storage.assignLoaderToOrder(orderId, loaderId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });
  
  // Reviews
  app.post("/api/reviews", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        fromUserId: req.user!.id
      });
      
      // Check if order exists and user is part of the order
      const order = await storage.getOrderById(validatedData.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      if (order.clientId !== req.user!.id && order.carrierId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const review = await storage.createReview(validatedData);
      
      // Update user rating
      const userReviews = await storage.getReviewsByUserId(validatedData.toUserId);
      if (userReviews.length > 0) {
        const avgRating = Math.round(
          userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
        );
        await storage.updateUser(validatedData.toUserId, { rating: avgRating });
      }
      
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      next(error);
    }
  });
  
  app.get("/api/reviews/user/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const reviews = await storage.getReviewsByUserId(userId);
    res.json(reviews);
  });
  
  // Admin routes
  app.get("/api/admin/orders", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const orders = await storage.getAllOrders();
    res.json(orders);
  });

  const httpServer = createServer(app);
  return httpServer;
}
