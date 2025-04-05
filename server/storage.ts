import { 
  users, type User, type InsertUser,
  socialAccounts, type SocialAccount, type InsertSocialAccount,
  posts, type Post, type InsertPost,
  analytics, type Analytics, type InsertAnalytics
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Social Account operations
  getSocialAccounts(userId: number): Promise<SocialAccount[]>;
  getSocialAccount(id: number): Promise<SocialAccount | undefined>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: number, account: Partial<InsertSocialAccount>): Promise<SocialAccount | undefined>;
  deleteSocialAccount(id: number): Promise<boolean>;
  
  // Post operations
  getPosts(accountId: number): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  // Analytics operations
  getAnalytics(accountId: number): Promise<Analytics[]>;
  getAnalyticsForDate(accountId: number, date: Date): Promise<Analytics | undefined>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
}

// Database implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Social Account operations
  async getSocialAccounts(userId: number): Promise<SocialAccount[]> {
    return await db.select().from(socialAccounts).where(eq(socialAccounts.userId, userId));
  }
  
  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    const [account] = await db.select().from(socialAccounts).where(eq(socialAccounts.id, id));
    return account || undefined;
  }
  
  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const [newAccount] = await db.insert(socialAccounts).values({
      ...account,
      profilePicture: account.profilePicture || `https://ui-avatars.com/api/?name=${account.platform}&background=0D8ABC&color=fff`,
      followerCount: 0,
      followingCount: 0,
      lastSync: new Date()
    }).returning();
    return newAccount;
  }
  
  async updateSocialAccount(id: number, accountUpdate: Partial<InsertSocialAccount>): Promise<SocialAccount | undefined> {
    const [updatedAccount] = await db.update(socialAccounts)
      .set(accountUpdate)
      .where(eq(socialAccounts.id, id))
      .returning();
    return updatedAccount || undefined;
  }
  
  async deleteSocialAccount(id: number): Promise<boolean> {
    const result = await db.delete(socialAccounts).where(eq(socialAccounts.id, id));
    return !!result;
  }

  // Post operations
  async getPosts(accountId: number): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.accountId, accountId));
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }
  
  async createPost(post: InsertPost): Promise<Post> {
    const publishedAt = post.status === 'published' ? new Date() : null;
    const [newPost] = await db.insert(posts).values({
      ...post,
      publishedAt,
      engagement: {}
    }).returning();
    return newPost;
  }
  
  async updatePost(id: number, postUpdate: Partial<InsertPost>): Promise<Post | undefined> {
    // If status changed to published, set publishedAt
    let updateData: Record<string, any> = { ...postUpdate };
    if (postUpdate.status === 'published') {
      const [existingPost] = await db.select().from(posts).where(eq(posts.id, id));
      if (existingPost && existingPost.status !== 'published') {
        updateData.publishedAt = new Date();
      }
    }
    
    const [updatedPost] = await db.update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();
    return updatedPost || undefined;
  }
  
  async deletePost(id: number): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return !!result;
  }
  
  // Analytics operations
  async getAnalytics(accountId: number): Promise<Analytics[]> {
    return await db.select()
      .from(analytics)
      .where(eq(analytics.accountId, accountId))
      .orderBy(desc(analytics.date));
  }
  
  async getAnalyticsForDate(accountId: number, date: Date): Promise<Analytics | undefined> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Set to start of day
    
    // Convert to YYYY-MM-DD format for date comparison
    const formattedDate = targetDate.toISOString().split('T')[0];
    
    const [result] = await db.select()
      .from(analytics)
      .where(
        and(
          eq(analytics.accountId, accountId),
          sql`DATE(${analytics.date}) = ${formattedDate}`
        )
      );
    
    return result || undefined;
  }
  
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [newAnalytics] = await db.insert(analytics)
      .values(analyticsData)
      .returning();
    return newAnalytics;
  }
  
  // Seed demo data function
  async seedDemoData() {
    try {
      console.log("Checking if data exists...");
      const userCount = await db.select().from(users);
      
      if (userCount.length > 0) {
        console.log("Demo data already exists");
        return;
      }
      
      console.log("Seeding demo data...");
      
      // Create demo user
      const [demoUser] = await db.insert(users).values({
        username: "demo",
        password: "$2b$10$GqK5OjrC0Eby1NP0z5z/6uLVLKs3ezjEUrWrCsR66KSJpTpm6UZ5e", // password: demo
        fullName: "Demo Kullanıcı",
        email: "demo@example.com",
        avatar: "https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff"
      }).returning();
      
      // Create sample social accounts
      const platforms = ["twitter", "instagram", "facebook", "linkedin", "youtube"];
      for (const platform of platforms) {
        const index = platforms.indexOf(platform);
        
        const [account] = await db.insert(socialAccounts).values({
          userId: demoUser.id,
          platform,
          accountName: `demo_${platform}`,
          accountId: `${platform}_123456`,
          profilePicture: `https://ui-avatars.com/api/?name=${platform}&background=0D8ABC&color=fff`,
          followerCount: 1000 + (index * 500),
          followingCount: 500 + (index * 200),
          isActive: true,
          lastSync: new Date()
        }).returning();
        
        // Create sample posts
        const statuses = ["draft", "scheduled", "published"];
        for (let i = 0; i < 3; i++) {
          await db.insert(posts).values({
            accountId: account.id,
            content: `Örnek gönderi ${i+1} - ${platform} için`,
            mediaUrls: [],
            postUrl: i === 2 ? `https://${platform}.com/demo/${Date.now() + i}` : null,
            scheduledFor: i === 1 ? new Date(Date.now() + (i * 24 * 60 * 60 * 1000)) : null,
            publishedAt: i === 2 ? new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) : null,
            status: statuses[i],
            platform,
            engagement: i === 2 ? { likes: 50 + Math.floor(Math.random() * 100), comments: 5 + Math.floor(Math.random() * 20) } : null
          });
        }
        
        // Create sample analytics for the past 7 days
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          
          await db.insert(analytics).values({
            accountId: account.id,
            date,
            followers: (account.followerCount || 1000) - (i * 10),
            following: account.followingCount || 500,
            engagement: 50 + Math.floor(Math.random() * 100),
            impressions: 500 + Math.floor(Math.random() * 1000),
            reach: 300 + Math.floor(Math.random() * 800),
            profileVisits: 50 + Math.floor(Math.random() * 200),
            clickThroughs: 10 + Math.floor(Math.random() * 50),
            data: {
              storyViews: 100 + Math.floor(Math.random() * 300),
              postEngagement: 0.01 + (Math.random() * 0.05)
            }
          });
        }
      }
      
      console.log("Demo data seeded successfully");
    } catch (error) {
      console.error("Error seeding demo data:", error);
    }
  }
}

// In-memory implementation class for backwards compatibility
export class MemStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return undefined;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    throw new Error("MemStorage is deprecated");
  }
  
  async getSocialAccounts(userId: number): Promise<SocialAccount[]> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return [];
  }
  
  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return undefined;
  }
  
  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    throw new Error("MemStorage is deprecated");
  }
  
  async updateSocialAccount(id: number, account: Partial<InsertSocialAccount>): Promise<SocialAccount | undefined> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return undefined;
  }
  
  async deleteSocialAccount(id: number): Promise<boolean> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return false;
  }
  
  async getPosts(accountId: number): Promise<Post[]> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return [];
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return undefined;
  }
  
  async createPost(post: InsertPost): Promise<Post> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    throw new Error("MemStorage is deprecated");
  }
  
  async updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return undefined;
  }
  
  async deletePost(id: number): Promise<boolean> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return false;
  }
  
  async getAnalytics(accountId: number): Promise<Analytics[]> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return [];
  }
  
  async getAnalyticsForDate(accountId: number, date: Date): Promise<Analytics | undefined> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    return undefined;
  }
  
  async createAnalytics(analytics: InsertAnalytics): Promise<Analytics> {
    console.warn("Using MemStorage which is deprecated, use DatabaseStorage instead");
    throw new Error("MemStorage is deprecated");
  }
}

export const storage = new DatabaseStorage();
