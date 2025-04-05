import { 
  users, type User, type InsertUser,
  socialAccounts, type SocialAccount, type InsertSocialAccount,
  posts, type Post, type InsertPost,
  analytics, type Analytics, type InsertAnalytics
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

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
    let updateData = { ...postUpdate };
    if (postUpdate.status === 'published') {
      const [existingPost] = await db.select().from(posts).where(eq(posts.id, id));
      if (existingPost && existingPost.status !== 'published') {
        updateData = { ...updateData, publishedAt: new Date() };
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
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const [result] = await db.select()
      .from(analytics)
      .where(
        and(
          eq(analytics.accountId, accountId),
          and(
            date => date >= targetDate,
            date => date < nextDay
          )
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
      fullName: "Demo User",
      email: "demo@example.com",
      avatar: null,
      createdAt: new Date(),
    };
    this.users.set(this.currentUserId, demoUser);
    this.currentUserId++;
    
    // Add sample social accounts
    const platforms = ["twitter", "instagram", "facebook", "linkedin", "youtube"];
    platforms.forEach(platform => {
      const account: SocialAccount = {
        id: this.currentAccountId,
        userId: 1,
        platform,
        accountName: `demo_${platform}`,
        accountId: `${platform}_123456`,
        accessToken: `token_${platform}`,
        refreshToken: `refresh_${platform}`,
        tokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        profilePicture: null,
        followerCount: Math.floor(Math.random() * 10000),
        followingCount: Math.floor(Math.random() * 1000),
        isActive: true,
        lastSync: new Date(),
        createdAt: new Date(),
      };
      this.socialAccounts.set(this.currentAccountId, account);
      this.currentAccountId++;
    });
    
    // Add sample posts
    const statuses = ["draft", "scheduled", "published", "failed"];
    for (let i = 1; i <= 5; i++) {
      for (let j = 0; j < 3; j++) {
        const post: Post = {
          id: this.currentPostId,
          accountId: i,
          content: `Sample post ${j+1} for account ${i}`,
          mediaUrls: [],
          postUrl: null,
          scheduledFor: j === 1 ? new Date(Date.now() + 86400000) : null, // 1 day from now if scheduled
          publishedAt: j === 2 ? new Date() : null, // Today if published
          status: statuses[j],
          platform: Array.from(this.socialAccounts.values()).find(a => a.id === i)?.platform || "unknown",
          engagement: j === 2 ? { likes: Math.floor(Math.random() * 100), comments: Math.floor(Math.random() * 20), shares: Math.floor(Math.random() * 10) } : null,
          createdAt: new Date(),
        };
        this.posts.set(this.currentPostId, post);
        this.currentPostId++;
      }
    }
    
    // Add sample analytics
    for (let i = 1; i <= 5; i++) {
      for (let j = 0; j < 7; j++) { // Last 7 days
        const date = new Date();
        date.setDate(date.getDate() - j);
        
        const analyticsEntry: Analytics = {
          id: this.currentAnalyticsId,
          accountId: i,
          date,
          followers: 1000 + Math.floor(Math.random() * 100) * j,
          following: 500 + Math.floor(Math.random() * 50) * j,
          engagement: Math.floor(Math.random() * 500),
          impressions: 2000 + Math.floor(Math.random() * 1000),
          reach: 1500 + Math.floor(Math.random() * 800),
          profileVisits: 300 + Math.floor(Math.random() * 100),
          clickThroughs: 50 + Math.floor(Math.random() * 30),
          data: { 
            postEngagement: Math.random() * 0.1,
            storyViews: Math.floor(Math.random() * 200),
            videoWatches: Math.floor(Math.random() * 150)
          },
          createdAt: new Date(),
        };
        this.analytics.set(this.currentAnalyticsId, analyticsEntry);
        this.currentAnalyticsId++;
      }
    }
  }

  // User methods
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
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Social Account methods
  async getSocialAccounts(userId: number): Promise<SocialAccount[]> {
    return Array.from(this.socialAccounts.values()).filter(
      (account) => account.userId === userId
    );
  }

  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    return this.socialAccounts.get(id);
  }

  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const id = this.currentAccountId++;
    const newAccount: SocialAccount = { 
      ...account, 
      id, 
      followerCount: 0,
      followingCount: 0,
      lastSync: new Date(),
      createdAt: new Date() 
    };
    this.socialAccounts.set(id, newAccount);
    return newAccount;
  }

  async updateSocialAccount(id: number, accountUpdate: Partial<InsertSocialAccount>): Promise<SocialAccount | undefined> {
    const existingAccount = this.socialAccounts.get(id);
    if (!existingAccount) return undefined;
    
    const updatedAccount = { ...existingAccount, ...accountUpdate };
    this.socialAccounts.set(id, updatedAccount);
    return updatedAccount;
  }

  async deleteSocialAccount(id: number): Promise<boolean> {
    return this.socialAccounts.delete(id);
  }

  // Post methods
  async getPosts(accountId: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(
      (post) => post.accountId === accountId
    );
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const newPost: Post = { 
      ...post, 
      id, 
      publishedAt: null,
      engagement: null,
      createdAt: new Date() 
    };
    this.posts.set(id, newPost);
    return newPost;
  }

  async updatePost(id: number, postUpdate: Partial<InsertPost>): Promise<Post | undefined> {
    const existingPost = this.posts.get(id);
    if (!existingPost) return undefined;
    
    const updatedPost = { ...existingPost, ...postUpdate };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  // Analytics methods
  async getAnalytics(accountId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values())
      .filter(analytics => analytics.accountId === accountId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getAnalyticsForDate(accountId: number, date: Date): Promise<Analytics | undefined> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return Array.from(this.analytics.values()).find(
      (a) => a.accountId === accountId && 
             a.date.getDate() === targetDate.getDate() &&
             a.date.getMonth() === targetDate.getMonth() &&
             a.date.getFullYear() === targetDate.getFullYear()
    );
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const newAnalytics: Analytics = { 
      ...analyticsData, 
      id, 
      createdAt: new Date() 
    };
    this.analytics.set(id, newAnalytics);
    return newAnalytics;
  }
}

export const storage = new MemStorage();
