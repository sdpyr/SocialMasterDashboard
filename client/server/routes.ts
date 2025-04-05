import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertSiteSettingsSchema,
  insertSeoSettingsSchema,
  insertPageSchema,
  insertBlogPostSchema,
  insertCategorySchema,
  insertMediaSchema,
  insertLanguageSchema,
  insertTemplateSchema,
  insertBackupSchema
} from "@shared/schema";
import { z } from "zod";

// Set up multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: function (req, file, cb) {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Helper function to validate request body against a schema
function validateBody<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ 
        error: "Geçersiz veri", 
        details: error instanceof z.ZodError ? error.errors : undefined 
      });
    }
  };
}

// Helper function to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Lütfen giriş yapın" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Social Media Accounts Routes
  app.get("/api/accounts", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as Express.User).id;
      // Mock veri gönderelim
      const accounts = [
        {
          id: 1,
          username: "instagram_hesap",
          platform: "instagram",
          followers: 1250,
          profileUrl: "https://instagram.com/instagram_hesap",
          isActive: true,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSync: new Date(),
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
          profilePicture: "https://picsum.photos/200",
          description: "Instagram hesabı",
          additionalData: null
        },
        {
          id: 2,
          username: "facebook_hesap",
          platform: "facebook",
          followers: 2500,
          profileUrl: "https://facebook.com/facebook_hesap",
          isActive: true,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSync: new Date(),
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
          profilePicture: "https://picsum.photos/200",
          description: "Facebook hesabı",
          additionalData: null
        },
        {
          id: 3,
          username: "twitter_hesap",
          platform: "twitter",
          followers: 3200,
          profileUrl: "https://twitter.com/twitter_hesap",
          isActive: true,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSync: new Date(),
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
          profilePicture: "https://picsum.photos/200",
          description: "Twitter hesabı",
          additionalData: null
        }
      ];
      
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Hesaplar alınırken bir hata oluştu" });
    }
  });

  app.get("/api/accounts/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Mock veri gönderelim
      const accounts = [
        {
          id: 1,
          username: "instagram_hesap",
          platform: "instagram",
          followers: 1250,
          profileUrl: "https://instagram.com/instagram_hesap",
          isActive: true,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSync: new Date(),
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
          profilePicture: "https://picsum.photos/200",
          description: "Instagram hesabı",
          additionalData: null
        },
        {
          id: 2,
          username: "facebook_hesap",
          platform: "facebook",
          followers: 2500,
          profileUrl: "https://facebook.com/facebook_hesap",
          isActive: true,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSync: new Date(),
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
          profilePicture: "https://picsum.photos/200",
          description: "Facebook hesabı",
          additionalData: null
        },
        {
          id: 3,
          username: "twitter_hesap",
          platform: "twitter",
          followers: 3200,
          profileUrl: "https://twitter.com/twitter_hesap",
          isActive: true,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSync: new Date(),
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
          profilePicture: "https://picsum.photos/200",
          description: "Twitter hesabı",
          additionalData: null
        }
      ];
      
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Hesaplar alınırken bir hata oluştu" });
    }
  });
  
  // API Keys Endpoints
  app.get("/api/api-keys", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as Express.User).id;
      
      // Mock veri gönderelim
      const apiKeys = [
        {
          id: 1,
          platform: "instagram",
          apiKey: "************",
          secretKey: "************",
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        },
        {
          id: 2,
          platform: "facebook",
          apiKey: "************",
          secretKey: "************",
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        },
        {
          id: 3,
          platform: "twitter",
          apiKey: "************",
          secretKey: "************",
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        }
      ];
      
      res.json(apiKeys);
    } catch (error) {
      res.status(500).json({ message: "API Anahtarları alınırken bir hata oluştu" });
    }
  });
  
  // Analytics mock endpoint
  app.get("/api/analytics/:platform", isAuthenticated, async (req, res) => {
    try {
      const platform = req.params.platform;
      
      // Platformlara göre farklı analitik verisi
      const analytics = {
        followers: [
          { date: '2023-01-01', count: 1000 },
          { date: '2023-02-01', count: 1150 },
          { date: '2023-03-01', count: 1300 },
          { date: '2023-04-01', count: 1450 },
          { date: '2023-05-01', count: 1600 },
          { date: '2023-06-01', count: 1800 },
        ],
        engagement: [
          { date: '2023-01-01', count: 250 },
          { date: '2023-02-01', count: 300 },
          { date: '2023-03-01', count: 280 },
          { date: '2023-04-01', count: 320 },
          { date: '2023-05-01', count: 380 },
          { date: '2023-06-01', count: 420 },
        ],
        posts: [
          { date: '2023-01-01', count: 20 },
          { date: '2023-02-01', count: 25 },
          { date: '2023-03-01', count: 18 },
          { date: '2023-04-01', count: 22 },
          { date: '2023-05-01', count: 30 },
          { date: '2023-06-01', count: 28 },
        ],
        likes: [
          { date: '2023-01-01', count: 1200 },
          { date: '2023-02-01', count: 1380 },
          { date: '2023-03-01', count: 1250 },
          { date: '2023-04-01', count: 1420 },
          { date: '2023-05-01', count: 1800 },
          { date: '2023-06-01', count: 2100 },
        ],
        comments: [
          { date: '2023-01-01', count: 85 },
          { date: '2023-02-01', count: 120 },
          { date: '2023-03-01', count: 95 },
          { date: '2023-04-01', count: 140 },
          { date: '2023-05-01', count: 180 },
          { date: '2023-06-01', count: 210 },
        ],
        shares: [
          { date: '2023-01-01', count: 45 },
          { date: '2023-02-01', count: 65 },
          { date: '2023-03-01', count: 50 },
          { date: '2023-04-01', count: 70 },
          { date: '2023-05-01', count: 95 },
          { date: '2023-06-01', count: 120 },
        ]
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Analiz verileri alınırken bir hata oluştu" });
    }
  });
  
  // Messages mock endpoint
  app.get("/api/messages", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as Express.User).id;
      
      // Mock mesaj verisi
      const messages = [
        {
          id: 1,
          platform: "instagram",
          sender: "follower1",
          recipient: "instagram_hesap",
          content: "Ürünleriniz hakkında bilgi alabilir miyim?",
          sentAt: new Date(Date.now() - 1000 * 60 * 30), // 30 dakika önce
          isRead: true,
          userId: userId
        },
        {
          id: 2,
          platform: "facebook",
          sender: "customer123",
          recipient: "facebook_hesap",
          content: "Geçen hafta sipariş ettiğim ürün ne zaman gelecek?",
          sentAt: new Date(Date.now() - 1000 * 60 * 120), // 2 saat önce
          isRead: true,
          userId: userId
        },
        {
          id: 3,
          platform: "instagram",
          sender: "potential_customer",
          recipient: "instagram_hesap",
          content: "Bu ürünün mor rengi var mı?",
          sentAt: new Date(Date.now() - 1000 * 60 * 5), // 5 dakika önce
          isRead: false,
          userId: userId
        },
        {
          id: 4,
          platform: "twitter",
          sender: "twitter_user",
          recipient: "twitter_hesap",
          content: "Harika içerikler paylaşıyorsunuz!",
          sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 saat önce
          isRead: false,
          userId: userId
        },
        {
          id: 5,
          platform: "instagram",
          sender: "regular_customer",
          recipient: "instagram_hesap",
          content: "Bir sipariş daha verdim, teşekkürler!",
          sentAt: new Date(Date.now() - 1000 * 60 * 45), // 45 dakika önce
          isRead: false,
          userId: userId
        }
      ];
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Mesajlar alınırken bir hata oluştu" });
    }
  });
  
  // Scheduled content endpoint
  app.get("/api/scheduled-content", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as Express.User).id;
      
      // Mock içerik verisi
      const scheduledContent = [
        {
          id: 1,
          platform: "instagram",
          content: "Yeni koleksiyonumuz çıktı! #yeniürünler #moda",
          mediaUrl: "https://picsum.photos/800/800",
          scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 gün sonra
          status: "scheduled",
          socialAccountId: 1,
          createdAt: new Date(),
          userId: userId
        },
        {
          id: 2,
          platform: "facebook",
          content: "Bu haftaya özel indirim kampanyamız başladı! Tüm ürünlerde %20 indirim.",
          mediaUrl: "https://picsum.photos/800/600",
          scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 48), // 2 gün sonra
          status: "scheduled",
          socialAccountId: 2,
          createdAt: new Date(),
          userId: userId
        },
        {
          id: 3,
          platform: "twitter",
          content: "Sosyal medya yönetimi ile ilgili ipuçları blogumuzda yayında!",
          mediaUrl: null,
          scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 saat sonra
          status: "scheduled",
          socialAccountId: 3,
          createdAt: new Date(),
          userId: userId
        },
        {
          id: 4,
          platform: "instagram",
          content: "Müşterilerimizden gelen yorumlar #mutlumüşteriler",
          mediaUrl: "https://picsum.photos/800/800",
          scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 gün önce
          status: "published",
          socialAccountId: 1,
          createdAt: new Date(),
          userId: userId
        }
      ];
      
      res.json(scheduledContent);
    } catch (error) {
      res.status(500).json({ message: "Planlanmış içerikler alınırken bir hata oluştu" });
    }
  });

  // Site Settings Routes
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ message: "Ayarlar alınırken bir hata oluştu" });
    }
  });

  app.put("/api/site-settings", isAuthenticated, validateBody(insertSiteSettingsSchema.partial()), async (req, res) => {
    try {
      const updatedSettings = await storage.updateSiteSettings(req.body);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "update",
        details: "Site ayarları güncellendi",
        entityType: "site_settings",
        entityId: 1
      });
      
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: "Ayarlar güncellenirken bir hata oluştu" });
    }
  });

  // SEO Settings Routes
  app.get("/api/seo-settings", async (req, res) => {
    try {
      const settings = await storage.getSeoSettings();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ message: "SEO ayarları alınırken bir hata oluştu" });
    }
  });

  app.put("/api/seo-settings", isAuthenticated, validateBody(insertSeoSettingsSchema.partial()), async (req, res) => {
    try {
      const updatedSettings = await storage.updateSeoSettings(req.body);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "update",
        details: "SEO ayarları güncellendi",
        entityType: "seo_settings",
        entityId: 1
      });
      
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: "SEO ayarları güncellenirken bir hata oluştu" });
    }
  });

  // Pages Routes
  app.get("/api/pages", async (req, res) => {
    try {
      const pages = await storage.getPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Sayfalar alınırken bir hata oluştu" });
    }
  });

  app.get("/api/pages/:id", async (req, res) => {
    try {
      const page = await storage.getPage(parseInt(req.params.id));
      if (!page) {
        return res.status(404).json({ message: "Sayfa bulunamadı" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Sayfa alınırken bir hata oluştu" });
    }
  });

  app.post("/api/pages", isAuthenticated, validateBody(insertPageSchema), async (req, res) => {
    try {
      const newPage = await storage.createPage(req.body);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "create",
        details: `"${newPage.title}" sayfası oluşturuldu`,
        entityType: "page",
        entityId: newPage.id
      });
      
      res.status(201).json(newPage);
    } catch (error) {
      res.status(500).json({ message: "Sayfa oluşturulurken bir hata oluştu" });
    }
  });

  app.put("/api/pages/:id", isAuthenticated, validateBody(insertPageSchema.partial()), async (req, res) => {
    try {
      const updatedPage = await storage.updatePage(parseInt(req.params.id), req.body);
      if (!updatedPage) {
        return res.status(404).json({ message: "Sayfa bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "update",
        details: `"${updatedPage.title}" sayfası güncellendi`,
        entityType: "page",
        entityId: updatedPage.id
      });
      
      res.json(updatedPage);
    } catch (error) {
      res.status(500).json({ message: "Sayfa güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/pages/:id", isAuthenticated, async (req, res) => {
    try {
      const page = await storage.getPage(parseInt(req.params.id));
      if (!page) {
        return res.status(404).json({ message: "Sayfa bulunamadı" });
      }
      
      const success = await storage.deletePage(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Sayfa bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "delete",
        details: `"${page.title}" sayfası silindi`,
        entityType: "page",
        entityId: parseInt(req.params.id)
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Sayfa silinirken bir hata oluştu" });
    }
  });

  // Blog Posts Routes
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Blog yazıları alınırken bir hata oluştu" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Blog yazısı bulunamadı" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Blog yazısı alınırken bir hata oluştu" });
    }
  });

  app.post("/api/blog-posts", isAuthenticated, validateBody(insertBlogPostSchema), async (req, res) => {
    try {
      const postData = {
        ...req.body,
        authorId: (req.user as Express.User).id
      };
      
      const newPost = await storage.createBlogPost(postData);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "create",
        details: `"${newPost.title}" blog yazısı oluşturuldu`,
        entityType: "blog_post",
        entityId: newPost.id
      });
      
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: "Blog yazısı oluşturulurken bir hata oluştu" });
    }
  });

  app.put("/api/blog-posts/:id", isAuthenticated, validateBody(insertBlogPostSchema.partial()), async (req, res) => {
    try {
      const updatedPost = await storage.updateBlogPost(parseInt(req.params.id), req.body);
      if (!updatedPost) {
        return res.status(404).json({ message: "Blog yazısı bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "update",
        details: `"${updatedPost.title}" blog yazısı güncellendi`,
        entityType: "blog_post",
        entityId: updatedPost.id
      });
      
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Blog yazısı güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/blog-posts/:id", isAuthenticated, async (req, res) => {
    try {
      const post = await storage.getBlogPost(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Blog yazısı bulunamadı" });
      }
      
      const success = await storage.deleteBlogPost(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Blog yazısı bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "delete",
        details: `"${post.title}" blog yazısı silindi`,
        entityType: "blog_post",
        entityId: parseInt(req.params.id)
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Blog yazısı silinirken bir hata oluştu" });
    }
  });

  // Categories Routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Kategoriler alınırken bir hata oluştu" });
    }
  });

  app.post("/api/categories", isAuthenticated, validateBody(insertCategorySchema), async (req, res) => {
    try {
      const newCategory = await storage.createCategory(req.body);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "create",
        details: `"${newCategory.name}" kategorisi oluşturuldu`,
        entityType: "category",
        entityId: newCategory.id
      });
      
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: "Kategori oluşturulurken bir hata oluştu" });
    }
  });

  app.put("/api/categories/:id", isAuthenticated, validateBody(insertCategorySchema.partial()), async (req, res) => {
    try {
      const updatedCategory = await storage.updateCategory(parseInt(req.params.id), req.body);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Kategori bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "update",
        details: `"${updatedCategory.name}" kategorisi güncellendi`,
        entityType: "category",
        entityId: updatedCategory.id
      });
      
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: "Kategori güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const category = await storage.getCategory(parseInt(req.params.id));
      if (!category) {
        return res.status(404).json({ message: "Kategori bulunamadı" });
      }
      
      const success = await storage.deleteCategory(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Kategori bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "delete",
        details: `"${category.name}" kategorisi silindi`,
        entityType: "category",
        entityId: parseInt(req.params.id)
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Kategori silinirken bir hata oluştu" });
    }
  });

  // Media Routes
  app.get("/api/media", async (req, res) => {
    try {
      const media = await storage.getAllMedia();
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Medya dosyaları alınırken bir hata oluştu" });
    }
  });

  app.post("/api/media", isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Dosya yüklenmedi" });
      }
      
      const fileData = {
        filename: req.file.filename,
        originalFilename: req.file.originalname,
        fileType: path.extname(req.file.originalname).substring(1),
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: `/uploads/${req.file.filename}`,
        title: req.body.title || req.file.originalname,
        altText: req.body.altText || "",
        description: req.body.description || "",
        uploadedBy: (req.user as Express.User).id
      };
      
      const newMedia = await storage.createMedia(fileData);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "upload",
        details: `"${newMedia.originalFilename}" medya dosyası yüklendi`,
        entityType: "media",
        entityId: newMedia.id
      });
      
      res.status(201).json(newMedia);
    } catch (error) {
      res.status(500).json({ message: "Medya dosyası yüklenirken bir hata oluştu" });
    }
  });

  app.put("/api/media/:id", isAuthenticated, validateBody(insertMediaSchema.partial()), async (req, res) => {
    try {
      const updatedMedia = await storage.updateMedia(parseInt(req.params.id), req.body);
      if (!updatedMedia) {
        return res.status(404).json({ message: "Medya dosyası bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "update",
        details: `"${updatedMedia.originalFilename}" medya dosyası güncellendi`,
        entityType: "media",
        entityId: updatedMedia.id
      });
      
      res.json(updatedMedia);
    } catch (error) {
      res.status(500).json({ message: "Medya dosyası güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/media/:id", isAuthenticated, async (req, res) => {
    try {
      const media = await storage.getMedia(parseInt(req.params.id));
      if (!media) {
        return res.status(404).json({ message: "Medya dosyası bulunamadı" });
      }
      
      const success = await storage.deleteMedia(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Medya dosyası bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "delete",
        details: `"${media.originalFilename}" medya dosyası silindi`,
        entityType: "media",
        entityId: parseInt(req.params.id)
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Medya dosyası silinirken bir hata oluştu" });
    }
  });

  // Languages Routes
  app.get("/api/languages", async (req, res) => {
    try {
      const languages = await storage.getLanguages();
      res.json(languages);
    } catch (error) {
      res.status(500).json({ message: "Diller alınırken bir hata oluştu" });
    }
  });

  app.post("/api/languages", isAuthenticated, validateBody(insertLanguageSchema), async (req, res) => {
    try {
      const newLanguage = await storage.createLanguage(req.body);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "create",
        details: `"${newLanguage.name}" dili eklendi`,
        entityType: "language",
        entityId: newLanguage.id
      });
      
      res.status(201).json(newLanguage);
    } catch (error) {
      res.status(500).json({ message: "Dil eklenirken bir hata oluştu" });
    }
  });

  app.put("/api/languages/:id", isAuthenticated, validateBody(insertLanguageSchema.partial()), async (req, res) => {
    try {
      const updatedLanguage = await storage.updateLanguage(parseInt(req.params.id), req.body);
      if (!updatedLanguage) {
        return res.status(404).json({ message: "Dil bulunamadı" });
      }
      
      // If setting a language as default, update other languages to not be default
      if (req.body.isDefault && req.body.isDefault === true) {
        const languages = await storage.getLanguages();
        for (const lang of languages) {
          if (lang.id !== updatedLanguage.id && lang.isDefault) {
            await storage.updateLanguage(lang.id, { isDefault: false });
          }
        }
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "update",
        details: `"${updatedLanguage.name}" dili güncellendi`,
        entityType: "language",
        entityId: updatedLanguage.id
      });
      
      res.json(updatedLanguage);
    } catch (error) {
      res.status(500).json({ message: "Dil güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/languages/:id", isAuthenticated, async (req, res) => {
    try {
      const language = await storage.getLanguage(parseInt(req.params.id));
      if (!language) {
        return res.status(404).json({ message: "Dil bulunamadı" });
      }
      
      // Don't allow deletion of default language
      if (language.isDefault) {
        return res.status(400).json({ message: "Varsayılan dil silinemez" });
      }
      
      const success = await storage.deleteLanguage(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Dil bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "delete",
        details: `"${language.name}" dili silindi`,
        entityType: "language",
        entityId: parseInt(req.params.id)
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Dil silinirken bir hata oluştu" });
    }
  });

  // Templates Routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Şablonlar alınırken bir hata oluştu" });
    }
  });

  app.post("/api/templates", isAuthenticated, validateBody(insertTemplateSchema), async (req, res) => {
    try {
      const newTemplate = await storage.createTemplate(req.body);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "create",
        details: `"${newTemplate.name}" şablonu oluşturuldu`,
        entityType: "template",
        entityId: newTemplate.id
      });
      
      res.status(201).json(newTemplate);
    } catch (error) {
      res.status(500).json({ message: "Şablon oluşturulurken bir hata oluştu" });
    }
  });

  app.put("/api/templates/:id", isAuthenticated, validateBody(insertTemplateSchema.partial()), async (req, res) => {
    try {
      const updatedTemplate = await storage.updateTemplate(parseInt(req.params.id), req.body);
      if (!updatedTemplate) {
        return res.status(404).json({ message: "Şablon bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "update",
        details: `"${updatedTemplate.name}" şablonu güncellendi`,
        entityType: "template",
        entityId: updatedTemplate.id
      });
      
      res.json(updatedTemplate);
    } catch (error) {
      res.status(500).json({ message: "Şablon güncellenirken bir hata oluştu" });
    }
  });

  app.delete("/api/templates/:id", isAuthenticated, async (req, res) => {
    try {
      const template = await storage.getTemplate(parseInt(req.params.id));
      if (!template) {
        return res.status(404).json({ message: "Şablon bulunamadı" });
      }
      
      const success = await storage.deleteTemplate(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Şablon bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "delete",
        details: `"${template.name}" şablonu silindi`,
        entityType: "template",
        entityId: parseInt(req.params.id)
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Şablon silinirken bir hata oluştu" });
    }
  });

  // Backups Routes
  app.get("/api/backups", isAuthenticated, async (req, res) => {
    try {
      const backups = await storage.getBackups();
      res.json(backups);
    } catch (error) {
      res.status(500).json({ message: "Yedekler alınırken bir hata oluştu" });
    }
  });

  app.post("/api/backups", isAuthenticated, validateBody(insertBackupSchema), async (req, res) => {
    try {
      const backupData = {
        ...req.body,
        createdBy: (req.user as Express.User).id
      };
      
      const newBackup = await storage.createBackup(backupData);
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "create",
        details: `"${newBackup.filename}" yedeği oluşturuldu`,
        entityType: "backup",
        entityId: newBackup.id
      });
      
      res.status(201).json(newBackup);
    } catch (error) {
      res.status(500).json({ message: "Yedek oluşturulurken bir hata oluştu" });
    }
  });

  app.delete("/api/backups/:id", isAuthenticated, async (req, res) => {
    try {
      const backup = await storage.getBackup(parseInt(req.params.id));
      if (!backup) {
        return res.status(404).json({ message: "Yedek bulunamadı" });
      }
      
      const success = await storage.deleteBackup(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Yedek bulunamadı" });
      }
      
      // Log activity
      await storage.createActivityLog({
        userId: (req.user as Express.User).id,
        action: "delete",
        details: `"${backup.filename}" yedeği silindi`,
        entityType: "backup",
        entityId: parseInt(req.params.id)
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Yedek silinirken bir hata oluştu" });
    }
  });

  // Analytics Routes
  app.get("/api/analytics", isAuthenticated, async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "İstatistikler alınırken bir hata oluştu" });
    }
  });

  app.get("/api/analytics/summary", isAuthenticated, async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      const today = new Date();
      
      // Calculate summary data
      let totalVisitors = 0;
      let totalPageViews = 0;
      
      analytics.forEach(item => {
        totalVisitors += item.visitors || 0;
        totalPageViews += item.pageViews || 0;
      });
      
      const summary = {
        totalVisitors,
        totalPageViews,
        blogPostsCount: (await storage.getBlogPosts()).length,
        mediaCount: (await storage.getAllMedia()).length
      };
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "İstatistik özeti alınırken bir hata oluştu" });
    }
  });

  // Activity Logs Routes
  app.get("/api/activity-logs", isAuthenticated, async (req, res) => {
    try {
      const logs = await storage.getActivityLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Aktivite logları alınırken bir hata oluştu" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
