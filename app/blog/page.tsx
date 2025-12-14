import Link from 'next/link';
import { getSmakslyBlogs, formatBlogDate, estimateReadTime, SmakslyBlog } from '@/lib/smaksly-blogs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  codePreview?: string;
}

// Transform SmakslyBlog to BlogPost format
function transformSmakslyBlog(blog: SmakslyBlog): BlogPost {
  // Extract first 200 characters from body as excerpt
  const plainText = blog.body.replace(/<[^>]*>/g, '').replace(/[#*`]/g, '');
  const excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');

  // Extract code block from body for preview (if exists)
  const codeBlockMatch = blog.body.match(/```[\s\S]*?\n([\s\S]*?)```/);
  const codePreview = codeBlockMatch ? codeBlockMatch[1].substring(0, 100) : undefined;

  return {
    slug: blog.slug,
    title: blog.title,
    date: new Date(blog.publish_date).toISOString().split('T')[0],
    excerpt,
    tags: blog.category ? [blog.category] : ['Technology'],
    readTime: estimateReadTime(blog.body),
    codePreview,
  };
}

export default async function BlogPage() {
  const smakslyBlogs = await getSmakslyBlogs();
  const blogPosts = smakslyBlogs.map(transformSmakslyBlog);
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">Tech Blog</h1>
        <p className="text-xl text-gray-400">
          Articles about web development, software engineering, and technology
        </p>
      </div>

      <div className="space-y-6">
        {blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-[#161b22] border border-gray-800 rounded-lg p-6 hover:border-[#00ff88] transition-colors group"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-2xl font-bold group-hover:text-[#00ff88] transition-colors">
                      {post.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <p className="text-gray-300 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {post.codePreview && (
                    <div className="bg-[#0d1117] border border-gray-800 rounded p-4 overflow-x-auto">
                      <pre className="text-sm font-mono text-[#00ff88]">
                        <code>{post.codePreview}</code>
                      </pre>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#0d1117] border border-gray-800 rounded-full text-sm text-[#00ff88]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <span className="text-[#00ff88] group-hover:underline font-medium">
                      Read article →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))
        ) : (
          <div className="text-center py-16 bg-[#161b22] border border-gray-800 rounded-lg">
            <p className="text-gray-400 text-xl">No blog posts available yet.</p>
            <p className="text-gray-500 mt-2">Check back soon for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
}
