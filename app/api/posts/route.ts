import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/db';

// GET /api/posts - Get all posts with pagination and search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') as 'draft' | 'published' | undefined;

    const result = await getAllPosts({
      page,
      limit,
      search,
      category,
      status,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'slug', 'excerpt', 'content', 'category', 'author'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Ensure required fields are properly formatted
    const postData = {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage || undefined,
      author: {
        name: body.author.name,
        email: body.author.email,
        avatar: body.author.avatar || undefined,
      },
      category: body.category,
      tags: Array.isArray(body.tags) ? body.tags : [],
      codeSnippets: Array.isArray(body.codeSnippets) ? body.codeSnippets : undefined,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      featured: body.featured === true,
      readTime: body.readTime || 5,
      status: (body.status === 'draft' || body.status === 'published') ? body.status : 'draft',
      metadata: body.metadata || undefined,
    };

    const newPost = await createPost(postData);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
