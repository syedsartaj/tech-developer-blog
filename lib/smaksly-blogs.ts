import mongoose from 'mongoose'

// Blog interface matching Smaksly's blog schema
export interface SmakslyBlog {
  id: string
  title: string
  image_url?: string
  publish_date: Date
  modify_date: Date
  category?: string
  body: string
  slug: string
}

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || process.env.MongoDB_URL

let cached = (global as any).mongooseSmaksly

if (!cached) {
  cached = (global as any).mongooseSmaksly = { conn: null, promise: null }
}

async function connectDB() {
  if (!MONGODB_URI) {
    console.warn('MongoDB URI not defined')
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Get all blogs for this deployment from Smaksly database
export async function getSmakslyBlogs(): Promise<SmakslyBlog[]> {
  const smakslyId = process.env.SMAKSLY_ID

  if (!smakslyId) {
    console.warn('SMAKSLY_ID not defined - returning empty blogs')
    return []
  }

  try {
    await connectDB()

    // Use the clients collection directly
    const db = mongoose.connection.db
    if (!db) {
      console.error('Database connection not available')
      return []
    }

    const clientsCollection = db.collection('clients')

    const client = await clientsCollection.findOne({
      'Deployments.vercel_id': smakslyId
    })

    if (!client) {
      console.warn(`No deployment found for SMAKSLY_ID: ${smakslyId}`)
      return []
    }

    const deployment = client.Deployments?.find(
      (d: any) => d.vercel_id === smakslyId
    )

    if (!deployment?.Data?.[0]?.blogs) {
      console.warn('No blogs found in deployment data')
      return []
    }

    const blogs = deployment.Data[0].blogs as SmakslyBlog[]

    // Sort by publish_date descending (newest first)
    return blogs.sort((a, b) =>
      new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
    )
  } catch (error) {
    console.error('Error fetching Smaksly blogs:', error)
    return []
  }
}

// Get a single blog by slug
export async function getSmakslyBlogBySlug(slug: string): Promise<SmakslyBlog | null> {
  const blogs = await getSmakslyBlogs()
  return blogs.find(blog => blog.slug === slug) || null
}

// Get a single blog by id
export async function getSmakslyBlogById(id: string): Promise<SmakslyBlog | null> {
  const blogs = await getSmakslyBlogs()
  return blogs.find(blog => blog.id === id) || null
}

// Helper to format date for display
export function formatBlogDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper to estimate read time
export function estimateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}
