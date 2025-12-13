import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri: string = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the value
  // across module reloads caused by HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Database name from environment variable or default
const dbName = process.env.MONGODB_DB_NAME || 'tech-developer-blog';

// Helper function to get database instance
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

// Helper function to get a specific collection
export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

// Blog post interface
export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt?: Date;
  status: 'draft' | 'published';
  featured: boolean;
  coverImage?: string;
  readTime: number;
  views: number;
  likes: number;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
  };
}

// Helper functions for blog operations
export const blogOperations = {
  // Get all published posts
  async getAllPosts(limit = 20, skip = 0) {
    const collection = await getCollection('posts');
    return collection
      .find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();
  },

  // Get post by slug
  async getPostBySlug(slug: string) {
    const collection = await getCollection('posts');
    return collection.findOne({ slug, status: 'published' });
  },

  // Get posts by category
  async getPostsByCategory(category: string, limit = 20) {
    const collection = await getCollection('posts');
    return collection
      .find({ category, status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();
  },

  // Get posts by tag
  async getPostsByTag(tag: string, limit = 20) {
    const collection = await getCollection('posts');
    return collection
      .find({ tags: tag, status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();
  },

  // Get featured posts
  async getFeaturedPosts(limit = 5) {
    const collection = await getCollection('posts');
    return collection
      .find({ featured: true, status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();
  },

  // Create a new post
  async createPost(post: Omit<BlogPost, '_id'>) {
    const collection = await getCollection('posts');
    const result = await collection.insertOne({
      ...post,
      publishedAt: new Date(),
      views: 0,
      likes: 0,
    });
    return result;
  },

  // Update post
  async updatePost(slug: string, updates: Partial<BlogPost>) {
    const collection = await getCollection('posts');
    return collection.updateOne(
      { slug },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    );
  },

  // Increment post views
  async incrementViews(slug: string) {
    const collection = await getCollection('posts');
    return collection.updateOne(
      { slug },
      { $inc: { views: 1 } }
    );
  },

  // Increment post likes
  async incrementLikes(slug: string) {
    const collection = await getCollection('posts');
    return collection.updateOne(
      { slug },
      { $inc: { likes: 1 } }
    );
  },

  // Search posts
  async searchPosts(query: string, limit = 20) {
    const collection = await getCollection('posts');
    return collection
      .find({
        status: 'published',
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { excerpt: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } },
        ],
      })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();
  },

  // Get all categories with post counts
  async getAllCategories() {
    const collection = await getCollection('posts');
    return collection
      .aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();
  },

  // Get all tags with post counts
  async getAllTags() {
    const collection = await getCollection('posts');
    return collection
      .aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();
  },
};

// Export the client promise for use in other parts of the app
export default clientPromise;
