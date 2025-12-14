# Blog Management System Documentation

## Overview

This blog management system provides a complete CRUD (Create, Read, Update, Delete) interface for managing blog posts in the Tech Developer Blog. It features a dark-themed, terminal-inspired admin dashboard with full support for creating and editing blog posts with code snippets.

## Features

- **MongoDB Integration**: Full database layer with connection management
- **RESTful API**: Complete API endpoints for post management
- **Admin Dashboard**: Tech-themed UI with stats, search, and filtering
- **Rich Post Editor**: Support for markdown, code snippets, tags, and metadata
- **Code Snippet Management**: Add multiple code snippets with syntax highlighting
- **Category System**: Pre-configured tech categories
- **Draft/Publish Workflow**: Save posts as drafts or publish immediately
- **Featured Posts**: Mark posts as featured for homepage highlighting
- **Real-time Search**: Search posts by title, excerpt, or content
- **Responsive Design**: Mobile-friendly interface

## File Structure

```
blog-templates/tech-developer-blog/
├── lib/
│   └── db.ts                          # MongoDB connection and CRUD functions
├── app/
│   ├── api/
│   │   └── posts/
│   │       ├── route.ts               # GET all posts, POST create
│   │       └── [id]/
│   │           └── route.ts           # GET/PUT/DELETE single post
│   └── admin/
│       ├── page.tsx                   # Admin dashboard
│       └── posts/
│           ├── new/
│           │   └── page.tsx           # Create new post
│           └── [id]/
│               └── page.tsx           # Edit existing post
├── components/
│   └── PostForm.tsx                   # Reusable post form component
└── BLOG_MANAGEMENT.md                 # This file
```

## Database Schema

### Post Interface

```typescript
interface BlogPost {
  _id?: string;
  slug: string;                        // URL-friendly identifier
  title: string;
  excerpt: string;                     // Short summary
  content: string;                     // Full markdown content
  coverImage?: string;                 // URL to cover image
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  category: string;                    // One of predefined categories
  tags: string[];                      // Array of tags
  codeSnippets?: CodeSnippet[];        // Code examples
  publishedAt: Date;
  featured: boolean;                   // Show on homepage
  readTime: number;                    // Estimated reading time in minutes
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  views: number;                       // View counter
  likes: number;                       // Like counter
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
  };
}

interface CodeSnippet {
  language: string;                    // Programming language
  code: string;                        // Code content
  title?: string;                      // Optional title
  highlight?: number[];                // Lines to highlight
}
```

## Categories

The system supports the following predefined categories:

- JavaScript
- TypeScript
- React
- Node.js
- Python
- DevOps
- Cloud
- AI/ML
- Web Development
- Mobile

## API Endpoints

### GET /api/posts

Get all posts with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Posts per page (default: 20)
- `search` (string): Search query
- `category` (string): Filter by category
- `status` ('draft' | 'published'): Filter by status

**Response:**
```json
{
  "posts": [...],
  "total": 42,
  "page": 1,
  "totalPages": 3
}
```

### POST /api/posts

Create a new post.

**Request Body:**
```json
{
  "title": "Getting Started with TypeScript",
  "slug": "getting-started-with-typescript",
  "excerpt": "Learn the basics of TypeScript...",
  "content": "# Introduction\n\nTypeScript is...",
  "coverImage": "https://example.com/image.jpg",
  "author": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "category": "TypeScript",
  "tags": ["typescript", "javascript", "tutorial"],
  "codeSnippets": [
    {
      "language": "typescript",
      "code": "const greeting: string = 'Hello';",
      "title": "Basic Type Annotation"
    }
  ],
  "featured": false,
  "readTime": 5,
  "status": "draft"
}
```

**Response:** Created post object with `_id`

### GET /api/posts/[id]

Get a single post by ID.

**Response:** Post object

### PUT /api/posts/[id]

Update an existing post.

**Request Body:** Partial post object with fields to update

**Response:** Updated post object

### DELETE /api/posts/[id]

Delete a post by ID.

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

## Admin Dashboard

### Accessing the Dashboard

Navigate to `/admin` to access the admin dashboard.

### Features

1. **Stats Cards**
   - Total Posts
   - Published Posts
   - Draft Posts
   - Total Views

2. **Search and Filters**
   - Search by title, excerpt, or content
   - Filter by status (all/draft/published)
   - Filter by category

3. **Post Management**
   - View all posts in a table
   - Edit existing posts
   - Delete posts with confirmation
   - View post metadata (category, status, views, updated date)
   - See featured post indicators

4. **Actions**
   - Create new post (+ New Post button)
   - Edit post (Edit button)
   - Delete post (Delete button with confirmation)

## Creating a New Post

1. Navigate to `/admin`
2. Click "New Post" button
3. Fill in the form:
   - **Title**: Auto-generates slug
   - **Slug**: URL-friendly identifier (editable)
   - **Excerpt**: Brief summary
   - **Content**: Full markdown content
   - **Cover Image**: Optional image URL
   - **Author Info**: Name and email
   - **Category**: Select from dropdown
   - **Read Time**: Estimated minutes
   - **Tags**: Add multiple tags
   - **Code Snippets**: Add code examples with language selection
   - **Status**: Draft or Published
   - **Featured**: Toggle featured status
4. Click "Create Post"

## Editing an Existing Post

1. Navigate to `/admin`
2. Find the post in the table
3. Click "Edit" button
4. Modify the form fields
5. Click "Update Post"

## Code Snippets

The post editor supports adding multiple code snippets with:
- Language selection (JavaScript, TypeScript, Python, etc.)
- Optional title
- Syntax highlighting support
- Preview before adding

### Supported Languages

- javascript
- typescript
- python
- java
- go
- rust
- html
- css
- bash
- sql
- json
- yaml
- markdown

## Database Functions

### lib/db.ts Functions

```typescript
// Get all posts with pagination and search
getAllPosts(options: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: 'draft' | 'published';
})

// Get single post by ID
getPostById(id: string)

// Create new post
createPost(postData: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>)

// Update post by ID
updatePost(id: string, updates: Partial<BlogPost>)

// Delete post by ID
deletePost(id: string)

// Get posts with custom filter
getPosts(filter: any, options: any)
```

## Environment Variables

Ensure your `.env.local` file contains:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=tech-developer-blog
```

## Setup Instructions

### 1. Database Setup

1. Create a MongoDB Atlas account (or use local MongoDB)
2. Create a new cluster
3. Get your connection string
4. Create a database named `tech-developer-blog`
5. Add connection string to `.env.local`

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Access Admin Dashboard

Open browser and navigate to:
```
http://localhost:3000/admin
```

## Usage Examples

### Creating a Post via API

```javascript
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'React Hooks Tutorial',
    slug: 'react-hooks-tutorial',
    excerpt: 'Master React Hooks in 10 minutes',
    content: '# React Hooks\n\nLet\'s learn about hooks...',
    author: {
      name: 'Jane Developer',
      email: 'jane@example.com',
    },
    category: 'React',
    tags: ['react', 'hooks', 'tutorial'],
    featured: true,
    readTime: 10,
    status: 'published',
  }),
});

const post = await response.json();
```

### Updating a Post

```javascript
const response = await fetch(`/api/posts/${postId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Updated Title',
    featured: true,
  }),
});
```

### Searching Posts

```javascript
const response = await fetch('/api/posts?search=typescript&status=published');
const data = await response.json();
```

## Design Theme

The admin dashboard features a terminal/code-inspired dark theme:

- **Primary Color**: Green (#10B981) - Terminal green
- **Background**: Dark gradient (gray-900 to black)
- **Text**: Light gray on dark background
- **Font**: Monospace (font-mono) for tech aesthetic
- **Borders**: Subtle green glow effects
- **Buttons**: High contrast with shadow effects

## Best Practices

1. **Slug Generation**: Slugs are auto-generated from titles but can be manually edited
2. **SEO**: Add descriptive excerpts for better search engine visibility
3. **Images**: Use external CDN URLs for cover images
4. **Code Snippets**: Add titles to code snippets for better context
5. **Tags**: Use consistent tag naming (lowercase, hyphenated)
6. **Read Time**: Estimate 200-250 words per minute for read time
7. **Draft Workflow**: Save as draft first, review, then publish
8. **Featured Posts**: Limit featured posts to 3-5 for homepage

## Troubleshooting

### Connection Issues

If you can't connect to MongoDB:
1. Check `.env.local` has correct `MONGODB_URI`
2. Verify MongoDB cluster is running
3. Check IP whitelist in MongoDB Atlas
4. Ensure database user has correct permissions

### API Errors

If API requests fail:
1. Check browser console for errors
2. Verify MongoDB connection
3. Check required fields are provided
4. Ensure valid ObjectId format for post IDs

### Build Errors

If TypeScript errors occur:
1. Run `npm install` to ensure all dependencies
2. Check import paths use `@/` alias
3. Verify all required types are defined

## Security Considerations

**Note**: This implementation does not include authentication. For production use:

1. Add authentication (NextAuth.js recommended)
2. Implement role-based access control (RBAC)
3. Add API rate limiting
4. Validate and sanitize all inputs
5. Use CSRF tokens
6. Implement file upload security for images
7. Add audit logging

## Future Enhancements

Potential improvements:

- [ ] User authentication and authorization
- [ ] Image upload functionality
- [ ] Rich text editor (WYSIWYG)
- [ ] Post scheduling
- [ ] Comments system
- [ ] Analytics dashboard
- [ ] Bulk operations
- [ ] Import/export posts
- [ ] Version history
- [ ] Media library
- [ ] SEO preview
- [ ] Social media integration

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check Next.js documentation
4. Review MongoDB documentation

## License

This blog management system is part of the Tech Developer Blog template.

---

**Version**: 1.0.0
**Last Updated**: 2025-12-14
**Author**: Tech Developer Blog Team
