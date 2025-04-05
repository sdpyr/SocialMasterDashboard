import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Custom types for components that are not saved to database
export type Keyword = {
  id: number;
  keyword: string;
  platform?: string;
  mentions: number;
  changePercentage: number;
  sentiment: number;
  lastUpdated: Date;
};

export type Activity = {
  id: number;
  type: string;
  content: string;
  timestamp: Date;
  platform: string;
  accountId: number;
};

export type ScheduledContent = {
  id: number;
  accountId: number;
  platform: string;
  content: string;
  mediaUrls?: string[];
  scheduledAt: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  postType: string;
};

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Site settings table
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteTitle: text("site_title").notNull(),
  siteTagline: text("site_tagline"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  contactAddress: text("contact_address"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  defaultLanguage: text("default_language").default("tr"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SEO settings table
export const seoSettings = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  twitterCard: text("twitter_card"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pages table
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  status: text("status").default("draft"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  status: text("status").default("draft"),
  authorId: integer("author_id").references(() => users.id),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: integer("parent_id").references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Media table
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalFilename: text("original_filename").notNull(),
  fileType: text("file_type").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  altText: text("alt_text"),
  title: text("title"),
  description: text("description"),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Languages table
export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  flagUrl: text("flag_url"),
  isActive: boolean("is_active").default(true),
  translationProgress: integer("translation_progress").default(0),
  isDefault: boolean("is_default").default(false),
});

// Templates table
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  isActive: boolean("is_active").default(false),
  config: jsonb("config"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics table
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  visitors: integer("visitors").default(0),
  pageViews: integer("page_views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  bounceRate: integer("bounce_rate"),
  avgSessionDuration: integer("avg_session_duration"),
  topPages: jsonb("top_pages"),
  referrers: jsonb("referrers"),
  devices: jsonb("devices"),
  countries: jsonb("countries"),
});

// Backups table
export const backups = pgTable("backups", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  status: text("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  details: text("details"),
  entityType: text("entity_type"),
  entityId: integer("entity_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Social Media API Keys table
export const socialApiKeys = pgTable("social_api_keys", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  platform: text("platform").notNull(), // facebook, instagram, twitter, linkedin, tiktok, youtube, pinterest vs.
  clientId: text("client_id"),
  clientSecret: text("client_secret"),
  apiKey: text("api_key"),
  apiSecret: text("api_secret"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  isActive: boolean("is_active").default(true),
  scopes: text("scopes"),
  additionalConfig: jsonb("additional_config"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Social Media Accounts table
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  apiKeyId: integer("api_key_id").references(() => socialApiKeys.id),
  platform: text("platform").notNull(), // facebook, instagram, twitter, linkedin, tiktok, youtube, pinterest vs.
  accountId: text("account_id").notNull(),
  accountName: text("account_name").notNull(),
  accountType: text("account_type"), // personal, business, creator vs.
  accountUrl: text("account_url"),
  username: text("username"),
  profilePictureUrl: text("profile_picture_url"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  isActive: boolean("is_active").default(true),
  lastSyncedAt: timestamp("last_synced_at"),
  accountStats: jsonb("account_stats"), // followers, following, post count, vs.
  additionalData: jsonb("additional_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    userPlatformAccountIdx: uniqueIndex("user_platform_account_idx").on(table.userId, table.platform, table.accountId)
  }
});

// Social Media Posts table
export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").references(() => socialAccounts.id),
  platformPostId: text("platform_post_id"),
  content: text("content"),
  mediaUrls: jsonb("media_urls"),
  postUrl: text("post_url"),
  postType: text("post_type"), // text, image, video, carousel, vs.
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"),
  status: text("status").default("draft"), // draft, scheduled, published, failed
  platformData: jsonb("platform_data"),
  stats: jsonb("stats"), // likes, comments, shares, vs.
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create Zod schemas for insert operations
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  role: true,
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).pick({
  siteTitle: true,
  siteTagline: true,
  contactEmail: true,
  contactPhone: true,
  contactAddress: true,
  logoUrl: true,
  faviconUrl: true,
  defaultLanguage: true,
});

export const insertSeoSettingsSchema = createInsertSchema(seoSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export const insertLanguageSchema = createInsertSchema(languages).omit({
  id: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});

export const insertBackupSchema = createInsertSchema(backups).omit({
  id: true,
  createdAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

// Sosyal Medya şemaları
export const insertSocialApiKeySchema = createInsertSchema(socialApiKeys).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define types for all schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;

export type InsertSeoSettings = z.infer<typeof insertSeoSettingsSchema>;
export type SeoSettings = typeof seoSettings.$inferSelect;

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Language = typeof languages.$inferSelect;

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type InsertBackup = z.infer<typeof insertBackupSchema>;
export type Backup = typeof backups.$inferSelect;

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

export type InsertSocialApiKey = z.infer<typeof insertSocialApiKeySchema>;
export type SocialApiKey = typeof socialApiKeys.$inferSelect;

export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type SocialAccount = typeof socialAccounts.$inferSelect;

export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type SocialPost = typeof socialPosts.$inferSelect;

export type Analytics = typeof analytics.$inferSelect;
