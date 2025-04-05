import {
  users, User, InsertUser,
  siteSettings, SiteSettings, InsertSiteSettings,
  seoSettings, SeoSettings, InsertSeoSettings,
  pages, Page, InsertPage,
  blogPosts, BlogPost, InsertBlogPost,
  categories, Category, InsertCategory,
  media, Media, InsertMedia,
  languages, Language, InsertLanguage,
  templates, Template, InsertTemplate,
  backups, Backup, InsertBackup,
  activityLogs, ActivityLog, InsertActivityLog,
  analytics, Analytics
} from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Site settings operations
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;
  
  // SEO settings operations
  getSeoSettings(): Promise<SeoSettings | undefined>;
  updateSeoSettings(settings: Partial<InsertSeoSettings>): Promise<SeoSettings>;
  
  // Page operations
  getPages(): Promise<Page[]>;
  getPage(id: number): Promise<Page | undefined>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: number, page: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: number): Promise<boolean>;
  
  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Media operations
  getAllMedia(): Promise<Media[]>;
  getMedia(id: number): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
  updateMedia(id: number, media: Partial<InsertMedia>): Promise<Media | undefined>;
  deleteMedia(id: number): Promise<boolean>;
  
  // Language operations
  getLanguages(): Promise<Language[]>;
  getLanguage(id: number): Promise<Language | undefined>;
  getLanguageByCode(code: string): Promise<Language | undefined>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  updateLanguage(id: number, language: Partial<InsertLanguage>): Promise<Language | undefined>;
  deleteLanguage(id: number): Promise<boolean>;
  
  // Template operations
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;
  
  // Backup operations
  getBackups(): Promise<Backup[]>;
  getBackup(id: number): Promise<Backup | undefined>;
  createBackup(backup: InsertBackup): Promise<Backup>;
  deleteBackup(id: number): Promise<boolean>;
  
  // Analytics operations
  getAnalytics(): Promise<Analytics[]>;
  getAnalyticsByDate(date: Date): Promise<Analytics | undefined>;
  
  // Activity logs
  getActivityLogs(): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private siteSettings: SiteSettings | undefined;
  private seoSettings: SeoSettings | undefined;
  private pages: Map<number, Page>;
  private blogPosts: Map<number, BlogPost>;
  private categories: Map<number, Category>;
  private mediaFiles: Map<number, Media>;
  private languagesList: Map<number, Language>;
  private templatesList: Map<number, Template>;
  private backupsList: Map<number, Backup>;
  private analyticsData: Analytics[];
  private activityLogsList: Map<number, ActivityLog>;
  currentUserId: number;
  currentPageId: number;
  currentBlogPostId: number;
  currentCategoryId: number;
  currentMediaId: number;
  currentLanguageId: number;
  currentTemplateId: number;
  currentBackupId: number;
  currentActivityLogId: number;
  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.pages = new Map();
    this.blogPosts = new Map();
    this.categories = new Map();
    this.mediaFiles = new Map();
    this.languagesList = new Map();
    this.templatesList = new Map();
    this.backupsList = new Map();
    this.analyticsData = [];
    this.activityLogsList = new Map();
    
    this.currentUserId = 1;
    this.currentPageId = 1;
    this.currentBlogPostId = 1;
    this.currentCategoryId = 1;
    this.currentMediaId = 1;
    this.currentLanguageId = 1;
    this.currentTemplateId = 1;
    this.currentBackupId = 1;
    this.currentActivityLogId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with default data
    this.initializeData();
  }

  private initializeData() {
    // Default site settings
    this.siteSettings = {
      id: 1,
      siteTitle: "SocialMasterPanel",
      siteTagline: "Sosyal Medya Yönetim Çözümü",
      contactEmail: "info@example.com",
      contactPhone: "+90 (212) 123 45 67",
      contactAddress: "İstanbul, Türkiye",
      logoUrl: null,
      faviconUrl: null,
      defaultLanguage: "tr",
      updatedAt: new Date()
    };
    
    // Default SEO settings
    this.seoSettings = {
      id: 1,
      metaTitle: "SocialMasterPanel - Sosyal Medya Yönetim Paneli",
      metaDescription: "Sosyal medya hesaplarınızı tek bir panelden yönetin",
      metaKeywords: "sosyal medya, yönetim, panel, pazarlama",
      ogTitle: "SocialMasterPanel",
      ogDescription: "Sosyal Medya Yönetim Paneli",
      ogImage: null,
      twitterCard: "summary_large_image",
      twitterTitle: "SocialMasterPanel",
      twitterDescription: "Sosyal Medya Yönetim Paneli",
      twitterImage: null,
      updatedAt: new Date()
    };
    
    // Default languages
    this.languagesList.set(1, {
      id: 1,
      name: "Türkçe",
      code: "tr",
      flagUrl: null,
      isActive: true,
      translationProgress: 100,
      isDefault: true
    });
    
    this.languagesList.set(2, {
      id: 2,
      name: "English",
      code: "en",
      flagUrl: null,
      isActive: true,
      translationProgress: 100,
      isDefault: false
    });
    
    this.languagesList.set(3, {
      id: 3,
      name: "Español",
      code: "es",
      flagUrl: null,
      isActive: true,
      translationProgress: 68,
      isDefault: false
    });
    
    this.languagesList.set(4, {
      id: 4,
      name: "Deutsch",
      code: "de",
      flagUrl: null,
      isActive: false,
      translationProgress: 0,
      isDefault: false
    });
    
    // Update counters
    this.currentLanguageId = 5;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Site settings operations
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    return this.siteSettings;
  }
  
  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    if (!this.siteSettings) {
      const newSettings: SiteSettings = {
        id: 1,
        siteTitle: settings.siteTitle || "SocialMasterPanel",
        siteTagline: settings.siteTagline || null,
        contactEmail: settings.contactEmail || null,
        contactPhone: settings.contactPhone || null,
        contactAddress: settings.contactAddress || null,
        logoUrl: settings.logoUrl || null,
        faviconUrl: settings.faviconUrl || null,
        defaultLanguage: settings.defaultLanguage || "tr",
        updatedAt: new Date()
      };
      this.siteSettings = newSettings;
    } else {
      this.siteSettings = {
        ...this.siteSettings,
        ...settings,
        updatedAt: new Date()
      };
    }
    return this.siteSettings;
  }
  
  // SEO settings operations
  async getSeoSettings(): Promise<SeoSettings | undefined> {
    return this.seoSettings;
  }
  
  async updateSeoSettings(settings: Partial<InsertSeoSettings>): Promise<SeoSettings> {
    if (!this.seoSettings) {
      const newSettings: SeoSettings = {
        id: 1,
        metaTitle: settings.metaTitle || null,
        metaDescription: settings.metaDescription || null,
        metaKeywords: settings.metaKeywords || null,
        ogTitle: settings.ogTitle || null,
        ogDescription: settings.ogDescription || null,
        ogImage: settings.ogImage || null,
        twitterCard: settings.twitterCard || null,
        twitterTitle: settings.twitterTitle || null,
        twitterDescription: settings.twitterDescription || null,
        twitterImage: settings.twitterImage || null,
        updatedAt: new Date()
      };
      this.seoSettings = newSettings;
    } else {
      this.seoSettings = {
        ...this.seoSettings,
        ...settings,
        updatedAt: new Date()
      };
    }
    return this.seoSettings;
  }
  
  // Page operations
  async getPages(): Promise<Page[]> {
    return Array.from(this.pages.values());
  }
  
  async getPage(id: number): Promise<Page | undefined> {
    return this.pages.get(id);
  }
  
  async getPageBySlug(slug: string): Promise<Page | undefined> {
    return Array.from(this.pages.values()).find(page => page.slug === slug);
  }
  
  async createPage(page: InsertPage): Promise<Page> {
    const id = this.currentPageId++;
    const now = new Date();
    const newPage: Page = { ...page, id, createdAt: now, updatedAt: now };
    this.pages.set(id, newPage);
    return newPage;
  }
  
  async updatePage(id: number, page: Partial<InsertPage>): Promise<Page | undefined> {
    const existingPage = this.pages.get(id);
    if (!existingPage) return undefined;
    
    const updatedPage: Page = {
      ...existingPage,
      ...page,
      updatedAt: new Date()
    };
    this.pages.set(id, updatedPage);
    return updatedPage;
  }
  
  async deletePage(id: number): Promise<boolean> {
    return this.pages.delete(id);
  }
  
  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const now = new Date();
    const newPost: BlogPost = { ...post, id, createdAt: now, updatedAt: now };
    this.blogPosts.set(id, newPost);
    return newPost;
  }
  
  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) return undefined;
    
    const updatedPost: BlogPost = {
      ...existingPost,
      ...post,
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const now = new Date();
    const newCategory: Category = { ...category, id, createdAt: now };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;
    
    const updatedCategory: Category = {
      ...existingCategory,
      ...category
    };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Media operations
  async getAllMedia(): Promise<Media[]> {
    return Array.from(this.mediaFiles.values());
  }
  
  async getMedia(id: number): Promise<Media | undefined> {
    return this.mediaFiles.get(id);
  }
  
  async createMedia(media: InsertMedia): Promise<Media> {
    const id = this.currentMediaId++;
    const now = new Date();
    const newMedia: Media = { ...media, id, createdAt: now };
    this.mediaFiles.set(id, newMedia);
    return newMedia;
  }
  
  async updateMedia(id: number, media: Partial<InsertMedia>): Promise<Media | undefined> {
    const existingMedia = this.mediaFiles.get(id);
    if (!existingMedia) return undefined;
    
    const updatedMedia: Media = {
      ...existingMedia,
      ...media
    };
    this.mediaFiles.set(id, updatedMedia);
    return updatedMedia;
  }
  
  async deleteMedia(id: number): Promise<boolean> {
    return this.mediaFiles.delete(id);
  }
  
  // Language operations
  async getLanguages(): Promise<Language[]> {
    return Array.from(this.languagesList.values());
  }
  
  async getLanguage(id: number): Promise<Language | undefined> {
    return this.languagesList.get(id);
  }
  
  async getLanguageByCode(code: string): Promise<Language | undefined> {
    return Array.from(this.languagesList.values()).find(lang => lang.code === code);
  }
  
  async createLanguage(language: InsertLanguage): Promise<Language> {
    const id = this.currentLanguageId++;
    const newLanguage: Language = { ...language, id };
    this.languagesList.set(id, newLanguage);
    return newLanguage;
  }
  
  async updateLanguage(id: number, language: Partial<InsertLanguage>): Promise<Language | undefined> {
    const existingLanguage = this.languagesList.get(id);
    if (!existingLanguage) return undefined;
    
    const updatedLanguage: Language = {
      ...existingLanguage,
      ...language
    };
    this.languagesList.set(id, updatedLanguage);
    return updatedLanguage;
  }
  
  async deleteLanguage(id: number): Promise<boolean> {
    return this.languagesList.delete(id);
  }
  
  // Template operations
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templatesList.values());
  }
  
  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templatesList.get(id);
  }
  
  async createTemplate(template: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const now = new Date();
    const newTemplate: Template = { ...template, id, createdAt: now };
    this.templatesList.set(id, newTemplate);
    return newTemplate;
  }
  
  async updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined> {
    const existingTemplate = this.templatesList.get(id);
    if (!existingTemplate) return undefined;
    
    const updatedTemplate: Template = {
      ...existingTemplate,
      ...template
    };
    this.templatesList.set(id, updatedTemplate);
    return updatedTemplate;
  }
  
  async deleteTemplate(id: number): Promise<boolean> {
    return this.templatesList.delete(id);
  }
  
  // Backup operations
  async getBackups(): Promise<Backup[]> {
    return Array.from(this.backupsList.values());
  }
  
  async getBackup(id: number): Promise<Backup | undefined> {
    return this.backupsList.get(id);
  }
  
  async createBackup(backup: InsertBackup): Promise<Backup> {
    const id = this.currentBackupId++;
    const now = new Date();
    const newBackup: Backup = { ...backup, id, createdAt: now };
    this.backupsList.set(id, newBackup);
    return newBackup;
  }
  
  async deleteBackup(id: number): Promise<boolean> {
    return this.backupsList.delete(id);
  }
  
  // Analytics operations
  async getAnalytics(): Promise<Analytics[]> {
    return this.analyticsData;
  }
  
  async getAnalyticsByDate(date: Date): Promise<Analytics | undefined> {
    const dateString = date.toISOString().split('T')[0];
    return this.analyticsData.find(a => {
      const analyticsDate = new Date(a.date).toISOString().split('T')[0];
      return analyticsDate === dateString;
    });
  }
  
  // Activity logs
  async getActivityLogs(): Promise<ActivityLog[]> {
    return Array.from(this.activityLogsList.values());
  }
  
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentActivityLogId++;
    const now = new Date();
    const newLog: ActivityLog = { ...log, id, createdAt: now };
    this.activityLogsList.set(id, newLog);
    return newLog;
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Site settings operations
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db.select().from(siteSettings);
    return settings || undefined;
  }
  
  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    const existingSettings = await this.getSiteSettings();
    
    if (!existingSettings) {
      const [newSettings] = await db
        .insert(siteSettings)
        .values({
          ...settings,
          siteTitle: settings.siteTitle || "SocialMasterPanel",
          updatedAt: new Date()
        })
        .returning();
      return newSettings;
    } else {
      const [updatedSettings] = await db
        .update(siteSettings)
        .set({
          ...settings,
          updatedAt: new Date()
        })
        .where(eq(siteSettings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    }
  }
  
  // SEO settings operations
  async getSeoSettings(): Promise<SeoSettings | undefined> {
    const [settings] = await db.select().from(seoSettings);
    return settings || undefined;
  }
  
  async updateSeoSettings(settings: Partial<InsertSeoSettings>): Promise<SeoSettings> {
    const existingSettings = await this.getSeoSettings();
    
    if (!existingSettings) {
      const [newSettings] = await db
        .insert(seoSettings)
        .values({
          ...settings,
          updatedAt: new Date()
        })
        .returning();
      return newSettings;
    } else {
      const [updatedSettings] = await db
        .update(seoSettings)
        .set({
          ...settings,
          updatedAt: new Date()
        })
        .where(eq(seoSettings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    }
  }
  
  // Page operations
  async getPages(): Promise<Page[]> {
    return await db.select().from(pages);
  }
  
  async getPage(id: number): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page || undefined;
  }
  
  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page || undefined;
  }
  
  async createPage(page: InsertPage): Promise<Page> {
    const now = new Date();
    const [newPage] = await db
      .insert(pages)
      .values({
        ...page,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return newPage;
  }
  
  async updatePage(id: number, page: Partial<InsertPage>): Promise<Page | undefined> {
    const [updatedPage] = await db
      .update(pages)
      .set({
        ...page,
        updatedAt: new Date()
      })
      .where(eq(pages.id, id))
      .returning();
    return updatedPage || undefined;
  }
  
  async deletePage(id: number): Promise<boolean> {
    const result = await db
      .delete(pages)
      .where(eq(pages.id, id));
    return true;
  }
  
  // Diğer metotlar da benzer şekilde implement edilecek
  // Şimdilik sadece kullanıcı, site ayarları, seo ayarları ve sayfa operasyonlarını tamamen implement ettik
  // Geri kalanları MemStorage'dan aldık

  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const now = new Date();
    const [newPost] = await db
      .insert(blogPosts)
      .values({
        ...post,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return newPost;
  }
  
  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({
        ...post,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost || undefined;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
    return true;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const now = new Date();
    const [newCategory] = await db
      .insert(categories)
      .values({
        ...category,
        createdAt: now
      })
      .returning();
    return newCategory;
  }
  
  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory || undefined;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    await db
      .delete(categories)
      .where(eq(categories.id, id));
    return true;
  }
  
  // Media operations
  async getAllMedia(): Promise<Media[]> {
    return await db.select().from(media);
  }
  
  async getMedia(id: number): Promise<Media | undefined> {
    const [mediaItem] = await db.select().from(media).where(eq(media.id, id));
    return mediaItem || undefined;
  }
  
  async createMedia(mediaItem: InsertMedia): Promise<Media> {
    const now = new Date();
    const [newMedia] = await db
      .insert(media)
      .values({
        ...mediaItem,
        createdAt: now
      })
      .returning();
    return newMedia;
  }
  
  async updateMedia(id: number, mediaItem: Partial<InsertMedia>): Promise<Media | undefined> {
    const [updatedMedia] = await db
      .update(media)
      .set(mediaItem)
      .where(eq(media.id, id))
      .returning();
    return updatedMedia || undefined;
  }
  
  async deleteMedia(id: number): Promise<boolean> {
    await db
      .delete(media)
      .where(eq(media.id, id));
    return true;
  }
  
  // Language operations
  async getLanguages(): Promise<Language[]> {
    return await db.select().from(languages);
  }
  
  async getLanguage(id: number): Promise<Language | undefined> {
    const [language] = await db.select().from(languages).where(eq(languages.id, id));
    return language || undefined;
  }
  
  async getLanguageByCode(code: string): Promise<Language | undefined> {
    const [language] = await db.select().from(languages).where(eq(languages.code, code));
    return language || undefined;
  }
  
  async createLanguage(language: InsertLanguage): Promise<Language> {
    const [newLanguage] = await db
      .insert(languages)
      .values(language)
      .returning();
    return newLanguage;
  }
  
  async updateLanguage(id: number, language: Partial<InsertLanguage>): Promise<Language | undefined> {
    const [updatedLanguage] = await db
      .update(languages)
      .set(language)
      .where(eq(languages.id, id))
      .returning();
    return updatedLanguage || undefined;
  }
  
  async deleteLanguage(id: number): Promise<boolean> {
    await db
      .delete(languages)
      .where(eq(languages.id, id));
    return true;
  }
  
  // Template operations
  async getTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }
  
  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }
  
  async createTemplate(template: InsertTemplate): Promise<Template> {
    const now = new Date();
    const [newTemplate] = await db
      .insert(templates)
      .values({
        ...template,
        createdAt: now
      })
      .returning();
    return newTemplate;
  }
  
  async updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined> {
    const [updatedTemplate] = await db
      .update(templates)
      .set(template)
      .where(eq(templates.id, id))
      .returning();
    return updatedTemplate || undefined;
  }
  
  async deleteTemplate(id: number): Promise<boolean> {
    await db
      .delete(templates)
      .where(eq(templates.id, id));
    return true;
  }
  
  // Backup operations
  async getBackups(): Promise<Backup[]> {
    return await db.select().from(backups);
  }
  
  async getBackup(id: number): Promise<Backup | undefined> {
    const [backup] = await db.select().from(backups).where(eq(backups.id, id));
    return backup || undefined;
  }
  
  async createBackup(backup: InsertBackup): Promise<Backup> {
    const now = new Date();
    const [newBackup] = await db
      .insert(backups)
      .values({
        ...backup,
        createdAt: now
      })
      .returning();
    return newBackup;
  }
  
  async deleteBackup(id: number): Promise<boolean> {
    await db
      .delete(backups)
      .where(eq(backups.id, id));
    return true;
  }
  
  // Analytics operations
  async getAnalytics(): Promise<Analytics[]> {
    return await db.select().from(analytics);
  }
  
  async getAnalyticsByDate(date: Date): Promise<Analytics | undefined> {
    const formattedDate = date.toISOString().split('T')[0];
    const [analyticsData] = await db
      .select()
      .from(analytics)
      .where(eq(analytics.date, formattedDate));
    return analyticsData || undefined;
  }
  
  // Activity logs
  async getActivityLogs(): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs);
  }
  
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const now = new Date();
    const [newLog] = await db
      .insert(activityLogs)
      .values({
        ...log,
        createdAt: now
      })
      .returning();
    return newLog;
  }
}

export const storage = new DatabaseStorage();
