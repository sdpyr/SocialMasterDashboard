import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage, DatabaseStorage } from "./storage";
import { 
  insertSocialAccountSchema, 
  insertPostSchema, 
  insertAnalyticsSchema,
  insertPageSchema,
  insertPageSectionSchema,
  insertMenuItemSchema,
  insertFaqItemSchema 
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "./db";
import { pool } from "./db";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Initialize database with sample data if needed
  if (storage instanceof DatabaseStorage) {
    try {
      await storage.seedDemoData();
    } catch (error) {
      console.error("Failed to seed demo data:", error);
    }
  }
  
  // Content Management System (CMS) Routes
  
  // Pages API
  app.get("/api/pages", async (req: Request, res: Response) => {
    try {
      // Normally we would get this from the database
      const pages = [
        {
          id: 1,
          title: "Anasayfa",
          slug: "/",
          content: "<h1>Hoş Geldiniz</h1><p>Bu bir içerik yönetim sistemi örneğidir.</p>",
          isPublished: true,
          metaTitle: "Anasayfa - SocialMaster",
          metaDescription: "SocialMaster sosyal medya yönetim platformu",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          title: "Hakkımızda",
          slug: "/hakkimizda",
          content: "<h1>Hakkımızda</h1><p>Şirketimiz hakkında bilgiler...</p>",
          isPublished: true,
          metaTitle: "Hakkımızda - SocialMaster",
          metaDescription: "SocialMaster hakkında bilgi edinin",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          title: "İletişim",
          slug: "/iletisim",
          content: "<h1>İletişim</h1><p>Bizimle iletişime geçin...</p>",
          isPublished: true,
          metaTitle: "İletişim - SocialMaster",
          metaDescription: "SocialMaster ile iletişim kurun",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/pages/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // Here we would get the page from the database
      const page = {
        id: parseInt(id),
        title: "Sayfa Başlığı",
        slug: "/sayfa-adresi",
        content: "<h1>Sayfa İçeriği</h1>",
        isPublished: true,
        metaTitle: "Meta Başlık",
        metaDescription: "Meta Açıklama",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pages", async (req: Request, res: Response) => {
    try {
      const pageData = insertPageSchema.parse(req.body);
      // Here we would create the page in the database
      const newPage = {
        id: 4,
        ...pageData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.status(201).json(newPage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/pages/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const pageData = insertPageSchema.partial().parse(req.body);
      // Here we would update the page in the database
      const updatedPage = {
        id: parseInt(id),
        ...pageData,
        updatedAt: new Date()
      };
      res.json(updatedPage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/pages/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // Here we would delete the page from the database
      res.json({ success: true, message: `Page with ID ${id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Page Sections API
  app.get("/api/page-sections", async (req: Request, res: Response) => {
    try {
      // Mock data for page sections
      const sections = [
        {
          id: 1,
          pageId: 1,
          title: "Hero Section",
          type: "hero",
          content: "<h1>Sosyal Medya Yönetiminde Yeni Çağ</h1><p>Tüm hesaplarınızı tek yerden yönetin.</p>",
          metadata: { bgColor: "#f9fafb", textAlign: "center" },
          sortOrder: 0,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          pageId: 1,
          title: "Özellikler",
          type: "features",
          content: "<h2>Özelliklerimiz</h2><ul><li>Kolay Kullanım</li><li>Analitik Raporlar</li><li>Zamanlama</li></ul>",
          metadata: { columns: 3 },
          sortOrder: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      res.json(sections);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/page-sections", async (req: Request, res: Response) => {
    try {
      const sectionData = insertPageSectionSchema.parse(req.body);
      // Here we would create the section in the database
      const newSection = {
        id: 3,
        ...sectionData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.status(201).json(newSection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/page-sections/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const sectionData = insertPageSectionSchema.partial().parse(req.body);
      // Here we would update the section in the database
      const updatedSection = {
        id: parseInt(id),
        ...sectionData,
        updatedAt: new Date()
      };
      res.json(updatedSection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/page-sections/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // Here we would delete the section from the database
      res.json({ success: true, message: `Section with ID ${id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Menu Items API
  app.get("/api/menu-items", async (req: Request, res: Response) => {
    try {
      // Mock data for menu items
      const menuItems = [
        {
          id: 1,
          parentId: null,
          title: "Anasayfa",
          url: "/",
          location: "header",
          icon: "home",
          sortOrder: 0,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          parentId: null,
          title: "Hakkımızda",
          url: "/hakkimizda",
          location: "header",
          icon: "info",
          sortOrder: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          parentId: null,
          title: "İletişim",
          url: "/iletisim",
          location: "header",
          icon: "mail",
          sortOrder: 2,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          parentId: null,
          title: "Hakkımızda",
          url: "/hakkimizda",
          location: "footer",
          icon: null,
          sortOrder: 0,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 5,
          parentId: null,
          title: "Blog",
          url: "/blog",
          location: "footer",
          icon: null,
          sortOrder: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/menu-items", async (req: Request, res: Response) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      // Here we would create the menu item in the database
      const newMenuItem = {
        id: 6,
        ...menuItemData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.status(201).json(newMenuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/menu-items/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const menuItemData = insertMenuItemSchema.partial().parse(req.body);
      // Here we would update the menu item in the database
      const updatedMenuItem = {
        id: parseInt(id),
        ...menuItemData,
        updatedAt: new Date()
      };
      res.json(updatedMenuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/menu-items/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // Here we would delete the menu item from the database
      res.json({ success: true, message: `Menu item with ID ${id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // FAQ Items API
  app.get("/api/faq-items", async (req: Request, res: Response) => {
    try {
      // Mock data for FAQ items
      const faqItems = [
        {
          id: 1,
          question: "SocialMaster nedir?",
          answer: "SocialMaster, tüm sosyal medya hesaplarınızı tek bir platformdan yönetmenizi sağlayan bir araçtır.",
          categoryId: null,
          sortOrder: 0,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          question: "SocialMaster hangi sosyal medya platformlarını destekliyor?",
          answer: "SocialMaster; Facebook, Instagram, Twitter, LinkedIn, Pinterest ve daha birçok platformu desteklemektedir.",
          categoryId: null,
          sortOrder: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          question: "Ücretlendirme planları nasıl çalışır?",
          answer: "SocialMaster, farklı ihtiyaçlara yönelik çeşitli ücretlendirme planları sunmaktadır. Ücretsiz deneme sürümünden başlayarak, kullanıcıların ihtiyaçlarına göre ölçeklenen planlarımız mevcuttur.",
          categoryId: null,
          sortOrder: 2,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      res.json(faqItems);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/faq-items", async (req: Request, res: Response) => {
    try {
      const faqItemData = insertFaqItemSchema.parse(req.body);
      // Here we would create the FAQ item in the database
      const newFaqItem = {
        id: 4,
        ...faqItemData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.status(201).json(newFaqItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/faq-items/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const faqItemData = insertFaqItemSchema.partial().parse(req.body);
      // Here we would update the FAQ item in the database
      const updatedFaqItem = {
        id: parseInt(id),
        ...faqItemData,
        updatedAt: new Date()
      };
      res.json(updatedFaqItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/faq-items/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // Here we would delete the FAQ item from the database
      res.json({ success: true, message: `FAQ item with ID ${id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
  
  // Language routes
  app.get("/api/languages", async (req: Request, res: Response) => {
    try {
      const result = await pool.query("SELECT * FROM languages ORDER BY name");
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching languages:", error);
      res.status(500).json({ message: "Failed to fetch languages" });
    }
  });
  
  app.post("/api/languages", async (req: Request, res: Response) => {
    const { name, code, flagUrl, isActive, translationProgress } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO languages (name, code, flagUrl, isActive, translationProgress) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, code, flagUrl, isActive, translationProgress]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating language:", error);
      res.status(500).json({ message: "Failed to create language" });
    }
  });
  
  app.put("/api/languages/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name, code, flagUrl, isActive, isDefault, translationProgress } = req.body;
    
    try {
      // If setting a language as default, update all other languages first
      if (isDefault) {
        await pool.query(
          "UPDATE languages SET isDefault = false WHERE id != $1",
          [id]
        );
      }
      
      // Update the specific language
      const fields = [];
      const values = [];
      let paramIndex = 1;
      
      if (name !== undefined) {
        fields.push(`name = $${paramIndex}`);
        values.push(name);
        paramIndex++;
      }
      
      if (code !== undefined) {
        fields.push(`code = $${paramIndex}`);
        values.push(code);
        paramIndex++;
      }
      
      if (flagUrl !== undefined) {
        fields.push(`flagUrl = $${paramIndex}`);
        values.push(flagUrl);
        paramIndex++;
      }
      
      if (isActive !== undefined) {
        fields.push(`isActive = $${paramIndex}`);
        values.push(isActive);
        paramIndex++;
      }
      
      if (isDefault !== undefined) {
        fields.push(`isDefault = $${paramIndex}`);
        values.push(isDefault);
        paramIndex++;
      }
      
      if (translationProgress !== undefined) {
        fields.push(`translationProgress = $${paramIndex}`);
        values.push(translationProgress);
        paramIndex++;
      }
      
      if (fields.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }
      
      // Add ID as the last parameter
      values.push(id);
      
      const query = `UPDATE languages SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
      const result = await pool.query(query, values);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Language not found" });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating language:", error);
      res.status(500).json({ message: "Failed to update language" });
    }
  });
  
  app.delete("/api/languages/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      // Check if language is default
      const checkResult = await pool.query(
        "SELECT isDefault FROM languages WHERE id = $1",
        [id]
      );
      
      if (checkResult.rowCount === 0) {
        return res.status(404).json({ message: "Language not found" });
      }
      
      if (checkResult.rows[0].isDefault) {
        return res.status(400).json({ message: "Cannot delete default language" });
      }
      
      const result = await pool.query(
        "DELETE FROM languages WHERE id = $1 RETURNING *",
        [id]
      );
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error deleting language:", error);
      res.status(500).json({ message: "Failed to delete language" });
    }
  });
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
