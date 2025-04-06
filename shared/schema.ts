import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  avatar: text("avatar"),
  role: text("role").default("user"),
  subscriptionTier: text("subscription_tier").default("free"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Social Media Accounts
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(), // twitter, instagram, facebook, etc
  accountName: text("account_name").notNull(),
  accountId: text("account_id"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  profilePicture: text("profile_picture"),
  followerCount: integer("follower_count"),
  followingCount: integer("following_count"),
  isActive: boolean("is_active").default(true),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
  createdAt: true,
  followerCount: true,
  followingCount: true,
  lastSync: true,
});

// Social Media Posts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => socialAccounts.id),
  content: text("content"),
  mediaUrls: text("media_urls").array(),
  postUrl: text("post_url"),
  scheduledFor: timestamp("scheduled_for"),
  publishedAt: timestamp("published_at"),
  status: text("status").notNull(), // draft, scheduled, published, failed
  platform: text("platform").notNull(),
  engagement: jsonb("engagement"), // likes, comments, shares, etc
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  publishedAt: true,
  engagement: true,
  createdAt: true,
});

// Analytics
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => socialAccounts.id),
  date: timestamp("date").notNull(),
  followers: integer("followers"),
  following: integer("following"),
  engagement: integer("engagement"),
  impressions: integer("impressions"),
  reach: integer("reach"),
  profileVisits: integer("profile_visits"),
  clickThroughs: integer("click_throughs"),
  data: jsonb("data"), // platform specific analytics data
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
