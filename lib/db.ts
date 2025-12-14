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

// Code snippet interface
export interface CodeSnippet {
  language: string;
  code: string;
  title?: string;
  highlight?: number[];
}

// Blog post interface
export interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  codeSnippets?: CodeSnippet[];
  publishedAt: Date;
  featured: boolean;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
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
    const now = new Date();
    const result = await collection.insertOne({
      ...post,
      createdAt: now,
      updatedAt: now,
      publishedAt: post.publishedAt || now,
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

// Additional CRUD functions for admin panel
import { ObjectId } from 'mongodb';

// Get all posts (including drafts) for admin
export async function getPosts(filter: any = {}, options: any = {}) {
  const collection = await getCollection('posts');
  const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;

  const posts = await collection
    .find(filter)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .toArray();

  return posts.map(post => ({
    ...post,
    _id: post._id.toString(),
  }));
}

// Get single post by ID
export async function getPostById(id: string) {
  const collection = await getCollection('posts');
  const post = await collection.findOne({ _id: new ObjectId(id) });

  if (!post) return null;

  return {
    ...post,
    _id: post._id.toString(),
  };
}

// Create new post
export async function createPost(postData: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) {
  const collection = await getCollection('posts');
  const now = new Date();

  const result = await collection.insertOne({
    ...postData,
    createdAt: now,
    updatedAt: now,
    views: 0,
    likes: 0,
  });

  return {
    _id: result.insertedId.toString(),
    ...postData,
    createdAt: now,
    updatedAt: now,
    views: 0,
    likes: 0,
  };
}

// Update post by ID
export async function updatePost(id: string, updates: Partial<BlogPost>) {
  const collection = await getCollection('posts');

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw new Error('Post not found');
  }

  return await getPostById(id);
}

// Delete post by ID
export async function deletePost(id: string) {
  const collection = await getCollection('posts');

  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    throw new Error('Post not found');
  }

  return { success: true, deletedCount: result.deletedCount };
}

// Get all posts with pagination and search
export async function getAllPosts(options: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: 'draft' | 'published';
} = {}) {
  const collection = await getCollection('posts');
  const { page = 1, limit = 20, search, category, status } = options;
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (status) {
    filter.status = status;
  }

  const [posts, total] = await Promise.all([
    collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  return {
    posts: posts.map(post => ({
      ...post,
      _id: post._id.toString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// Export the client promise for use in other parts of the app
export default clientPromise;
