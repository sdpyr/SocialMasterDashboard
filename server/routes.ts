import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSocialAccountSchema, insertPostSchema, insertAnalyticsSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/current", async (req, res) => {
    // In a real app we would get the user from a session
    // For demo, we'll return the demo user
    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Don't send the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Social Accounts routes
  app.get("/api/accounts", async (req, res) => {
    // For demo, we'll return all accounts for the demo user
    const accounts = await storage.getSocialAccounts(1);
    res.json(accounts);
  });

  app.get("/api/accounts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }

    const account = await storage.getSocialAccount(id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.json(account);
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const accountData = insertSocialAccountSchema.parse(req.body);
      const newAccount = await storage.createSocialAccount(accountData);
      res.status(201).json(newAccount);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.patch("/api/accounts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }

    try {
      const updatedAccount = await storage.updateSocialAccount(id, req.body);
      if (!updatedAccount) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(updatedAccount);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update account" });
    }
  });

  app.delete("/api/accounts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }

    const success = await storage.deleteSocialAccount(id);
    if (!success) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.status(204).send();
  });

  // Posts routes
  app.get("/api/accounts/:accountId/posts", async (req, res) => {
    const accountId = parseInt(req.params.accountId);
    if (isNaN(accountId)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }

    const posts = await storage.getPosts(accountId);
    res.json(posts);
  });

  app.get("/api/posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await storage.getPost(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const newPost = await storage.createPost(postData);
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.patch("/api/posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    try {
      const updatedPost = await storage.updatePost(id, req.body);
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const success = await storage.deletePost(id);
    if (!success) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(204).send();
  });

  // Analytics routes
  app.get("/api/accounts/:accountId/analytics", async (req, res) => {
    const accountId = parseInt(req.params.accountId);
    if (isNaN(accountId)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }

    const analytics = await storage.getAnalytics(accountId);
    res.json(analytics);
  });

  app.get("/api/accounts/:accountId/analytics/date/:date", async (req, res) => {
    const accountId = parseInt(req.params.accountId);
    if (isNaN(accountId)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }

    const date = new Date(req.params.date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const analytics = await storage.getAnalyticsForDate(accountId, date);
    if (!analytics) {
      return res.status(404).json({ message: "Analytics not found for the specified date" });
    }
    res.json(analytics);
  });

  app.post("/api/analytics", async (req, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse(req.body);
      const newAnalytics = await storage.createAnalytics(analyticsData);
      res.status(201).json(newAnalytics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create analytics entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
