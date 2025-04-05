import { 
  users, type User, type InsertUser,
  socialAccounts, type SocialAccount, type InsertSocialAccount,
  posts, type Post, type InsertPost,
  analytics, type Analytics, type InsertAnalytics
} from "@shared/schema";

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

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private socialAccounts: Map<number, SocialAccount>;
  private posts: Map<number, Post>;
  private analytics: Map<number, Analytics>;
  private currentUserId: number;
  private currentAccountId: number;
  private currentPostId: number;
  private currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.socialAccounts = new Map();
    this.posts = new Map();
    this.analytics = new Map();
    this.currentUserId = 1;
    this.currentAccountId = 1;
    this.currentPostId = 1;
    this.currentAnalyticsId = 1;
    
    // Add sample user for demo
    const demoUser: User = {
      id: this.currentUserId,
      username: "demo",
      password: "password", // In real app, this would be hashed
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
