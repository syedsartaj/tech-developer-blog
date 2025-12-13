import Link from 'next/link';
import { notFound } from 'next/navigation';

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

const blogPosts: Record<string, BlogPost> = {
  'building-scalable-apis-with-nodejs': {
    slug: 'building-scalable-apis-with-nodejs',
    title: 'Building Scalable APIs with Node.js and Express',
    date: '2024-01-15',
    readTime: '8 min read',
    tags: ['Node.js', 'Express', 'API', 'Backend'],
    author: {
      name: 'Tech Developer',
      role: 'Full Stack Engineer'
    },
    content: `Building scalable APIs is crucial for modern web applications. In this guide, we'll explore best practices for creating production-ready REST APIs using Node.js and Express.

## Setting Up the Project

First, let's initialize our Node.js project with the necessary dependencies:

\`\`\`bash
npm init -y
npm install express dotenv helmet cors compression
npm install -D typescript @types/node @types/express nodemon
\`\`\`

## Creating the Express Server

Here's a basic Express server setup with essential middleware for security and performance.

## Performance Optimization

### 1. Implement Caching

Use Redis for caching frequently accessed data to improve response times.

### 2. Rate Limiting

Protect your API from abuse with rate limiting middleware.

## Conclusion

Building scalable APIs requires careful planning and implementation of best practices. Focus on security, performance, and maintainability from the start.`
  },
  'mastering-react-hooks': {
    slug: 'mastering-react-hooks',
    title: 'Mastering React Hooks: A Deep Dive',
    date: '2024-01-10',
    readTime: '12 min read',
    tags: ['React', 'JavaScript', 'Frontend'],
    author: {
      name: 'Tech Developer',
      role: 'Full Stack Engineer'
    },
    content: `React Hooks revolutionized how we write React components. Let's explore advanced patterns and best practices.

## Understanding useState

The useState hook is the foundation of state management in functional components. It provides a simple way to add state to your components without writing class components.

## useEffect for Side Effects

Managing side effects properly is crucial for building reliable applications. Always remember to clean up subscriptions and async operations.

## Custom Hooks

Create reusable logic with custom hooks. They let you extract component logic into reusable functions.

## Performance Optimization with useMemo and useCallback

These hooks help prevent unnecessary re-renders and optimize performance in your React applications.

React Hooks provide a powerful and flexible way to manage state and side effects in your applications.`
  },
  'typescript-best-practices-2024': {
    slug: 'typescript-best-practices-2024',
    title: 'TypeScript Best Practices in 2024',
    date: '2024-01-05',
    readTime: '10 min read',
    tags: ['TypeScript', 'JavaScript', 'Development'],
    author: {
      name: 'Tech Developer',
      role: 'Full Stack Engineer'
    },
    content: `TypeScript has become essential for building maintainable JavaScript applications. Here are the best practices for 2024.

## Type Safety

Always prefer explicit typing over implicit any. This helps catch bugs early and improves code maintainability.

## Advanced Type Patterns

TypeScript provides powerful utility types like Pick, Omit, Partial, and Required that help you create flexible and reusable type definitions.

## Generic Constraints

Use generic constraints to create type-safe functions that work with multiple types while still providing compile-time checks.

TypeScript's type system helps catch bugs early and improves code maintainability.`
  }
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

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
