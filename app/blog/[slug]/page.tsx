import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSmakslyBlogs, getSmakslyBlogBySlug, formatBlogDate, estimateReadTime } from '@/lib/smaksly-blogs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
  author: {
    name: string;
    role: string;
  };
}

export async function generateStaticParams() {
  const blogs = await getSmakslyBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const smakslyBlog = await getSmakslyBlogBySlug(params.slug);

  if (!smakslyBlog) {
    notFound();
  }

  // Transform SmakslyBlog to BlogPost format
  const post: BlogPost = {
    slug: smakslyBlog.slug,
    title: smakslyBlog.title,
    date: new Date(smakslyBlog.publish_date).toISOString().split('T')[0],
    readTime: estimateReadTime(smakslyBlog.body),
    tags: smakslyBlog.category ? [smakslyBlog.category] : ['Technology'],
    content: smakslyBlog.body,
    author: {
      name: 'Tech Developer',
      role: 'Full Stack Engineer'
    }
  };

  // Simple markdown-like parsing
  const renderContent = (content: string) => {
    const blocks = content.split('\n\n');
    return blocks.map((block, index) => {
      const trimmed = block.trim();

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="text-3xl font-bold mt-10 mb-4 text-white border-b border-gray-700 pb-2">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-2xl font-semibold mt-8 mb-3 text-white">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const codeContent = lines.slice(1, -1).join('\n');
        return (
          <pre key={index} className="bg-[#161b22] border border-gray-700 rounded-lg p-4 overflow-x-auto my-6">
            <code className="text-gray-300 text-sm font-mono">{codeContent}</code>
          </pre>
        );
      }

      if (trimmed.length > 0) {
        // Handle inline code
        const withCode = trimmed.replace(
          /`([^`]+)`/g,
          '<code class="bg-[#161b22] border border-gray-700 rounded px-1.5 py-0.5 text-[#00ff88] text-sm font-mono">$1</code>'
        );
        return (
          <p
            key={index}
            className="mb-6 leading-relaxed text-gray-300"
            dangerouslySetInnerHTML={{ __html: withCode }}
          />
        );
      }

      return null;
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link
            href="/blog"
            className="text-[#00ff88] hover:underline mb-4 inline-block"
          >
            ← Back to Blog
          </Link>
        </div>

        <header className="mb-12 pb-8 border-b border-gray-800">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-400 mb-6">
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

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#00ff88] rounded-full flex items-center justify-center text-[#0d1117] font-bold text-lg">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="text-sm text-gray-400">{post.author.role}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#161b22] border border-gray-800 rounded-full text-sm text-[#00ff88]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose-content">
          {renderContent(post.content)}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <h3 className="text-2xl font-bold mb-6">Share this article</h3>
          <div className="flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#161b22] border border-gray-800 rounded-lg hover:border-[#00ff88] transition-colors"
            >
              Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#161b22] border border-gray-800 rounded-lg hover:border-[#00ff88] transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
    </article>
  );
}
