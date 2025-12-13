import Link from 'next/link';
import CodeBlock from './CodeBlock';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  codePreview?: string;
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="bg-dark-card border border-gray-800 rounded-lg overflow-hidden hover:border-accent-green/50 transition-all duration-300 group">
      <div className="p-6">
        {/* Category and Read Time */}
        <div className="flex items-center justify-between mb-3">
          <Link
            href={`/category/${post.category.toLowerCase()}`}
            className="text-accent-green text-sm font-semibold hover:text-green-400 transition-colors"
          >
            {post.category}
          </Link>
          <span className="text-gray-500 text-sm">{post.readTime}</span>
        </div>

        {/* Title */}
        <Link href={`/posts/${post.id}`}>
          <h3 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-accent-green transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>

        {/* Code Preview */}
        {post.codePreview && (
          <div className="mb-4 overflow-hidden rounded-lg">
            <div className="max-h-48 overflow-hidden relative">
              <CodeBlock
                code={post.codePreview}
                language="javascript"
                compact
              />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-code-bg to-transparent pointer-events-none" />
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag.toLowerCase()}`}
              className="px-2 py-1 bg-dark-bg border border-gray-800 rounded text-xs text-gray-400 hover:border-accent-green hover:text-accent-green transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Author and Date */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-green to-blue-400 rounded-full flex items-center justify-center">
              <span className="text-dark-bg font-semibold text-sm">
                {post.author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">{post.author}</p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>

          <Link
            href={`/posts/${post.id}`}
            className="text-accent-green hover:text-green-400 transition-colors flex items-center space-x-1 text-sm font-semibold"
          >
            <span>Read more</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
