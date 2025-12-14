import { NextResponse } from 'next/server'
import { getSmakslyBlogs } from '@/lib/smaksly-blogs'

export const dynamic = 'force-dynamic'

export async function GET() {
  const smakslyId = process.env.SMAKSLY_ID
  const mongoUri = process.env.MONGODB_URI || process.env.MongoDB_URL

  try {
    const blogs = await getSmakslyBlogs()

    return NextResponse.json({
      smaksly_id: smakslyId || 'NOT SET',
      mongodb_uri_set: !!mongoUri,
      blogs_count: blogs.length,
      blogs: blogs.map(b => ({ id: b.id, title: b.title, slug: b.slug }))
    })
  } catch (error: any) {
    return NextResponse.json({
      smaksly_id: smakslyId || 'NOT SET',
      mongodb_uri_set: !!mongoUri,
      error: error.message
    }, { status: 500 })
  }
}
