import BlogCard from '@/components/BlogCard';
import CodeBlock from '@/components/CodeBlock';
import Link from 'next/link';

const samplePosts = [
  {
    id: '1',
    title: 'Building Scalable APIs with Node.js and Express',
    excerpt: 'Learn how to design and implement production-ready REST APIs with proper error handling, validation, and performance optimization.',
    author: 'Jane Developer',
    date: '2024-03-15',
    category: 'Backend',
    tags: ['Node.js', 'Express', 'API'],
    readTime: '8 min read',
    codePreview: `const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});`,
  },
  {
    id: '2',
    title: 'React Server Components: A Deep Dive',
    excerpt: 'Explore the new paradigm of React Server Components and how they improve performance and developer experience in Next.js applications.',
    author: 'John Code',
    date: '2024-03-12',
    category: 'Frontend',
    tags: ['React', 'Next.js', 'RSC'],
    readTime: '12 min read',
    codePreview: `// app/page.tsx - Server Component
async function getData() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <PostList posts={data} />;
}`,
  },
  {
    id: '3',
    title: 'TypeScript Advanced Patterns and Best Practices',
    excerpt: 'Master advanced TypeScript features including generics, utility types, and conditional types to write more maintainable code.',
    author: 'Sarah Types',
    date: '2024-03-10',
    category: 'TypeScript',
    tags: ['TypeScript', 'Patterns', 'Best Practices'],
    readTime: '10 min read',
    codePreview: `type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface User {
  name: string;
  settings: {
    theme: string;
  };
}

const user: DeepReadonly<User> = {
  name: 'John',
  settings: { theme: 'dark' }
};`,
  },
  {
    id: '4',
    title: 'Mastering MongoDB Aggregation Pipeline',
    excerpt: 'Unlock the power of MongoDB aggregation framework for complex data transformations and analytics queries.',
    author: 'Mike Database',
    date: '2024-03-08',
    category: 'Database',
    tags: ['MongoDB', 'Database', 'Aggregation'],
    readTime: '15 min read',
    codePreview: `db.orders.aggregate([
  {
    $match: {
      status: 'completed',
      orderDate: { $gte: new Date('2024-01-01') }
    }
  },
  {
    $group: {
      _id: '$customerId',
      totalSpent: { $sum: '$amount' },
      orderCount: { $sum: 1 }
    }
  },
  {
    $sort: { totalSpent: -1 }
  }
]);`,
  },
];

const categories = [
  { name: 'Frontend', count: 45, icon: '⚛️' },
  { name: 'Backend', count: 38, icon: '⚙️' },
  { name: 'Database', count: 22, icon: '🗄️' },
  { name: 'TypeScript', count: 31, icon: '📘' },
  { name: 'DevOps', count: 18, icon: '🚀' },
  { name: 'AI/ML', count: 12, icon: '🤖' },
];

const sampleCode = `// Example: Custom React Hook for API Fetching
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error });
      }
    };

    fetchData();
  }, [url]);

  return state;
}

export default useFetch;`;

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent-green to-blue-400 bg-clip-text text-transparent">
            Developer Insights & Tutorials
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Dive deep into modern web development with code-focused articles, tutorials, and best practices
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/posts"
              className="px-6 py-3 bg-accent-green text-dark-bg font-semibold rounded-lg hover:bg-green-400 transition-colors"
            >
              Browse Articles
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-gray-700 text-gray-300 font-semibold rounded-lg hover:border-accent-green hover:text-accent-green transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.name.toLowerCase()}`}
              className="p-6 bg-dark-card border border-gray-800 rounded-lg hover:border-accent-green transition-colors text-center group"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-lg group-hover:text-accent-green transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.count} articles</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Code Snippet */}
      <section className="mb-16">
        <div className="bg-dark-card border border-gray-800 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Code Snippet</h2>
            <span className="text-sm text-gray-500">TypeScript / React</span>
          </div>
          <CodeBlock code={sampleCode} language="typescript" />
          <p className="mt-4 text-gray-400">
            A reusable custom hook for handling API requests with proper TypeScript typing and error handling.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest Articles</h2>
          <Link
            href="/posts"
            className="text-accent-green hover:text-green-400 transition-colors font-semibold"
          >
            View All →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {samplePosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mt-16 bg-gradient-to-r from-accent-green/10 to-blue-500/10 border border-accent-green/20 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Get the latest tutorials, code snippets, and developer insights delivered to your inbox weekly
        </p>
        <form className="flex max-w-md mx-auto gap-3">
          <input
            type="email"
            placeholder="your.email@example.com"
            className="flex-1 px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg focus:outline-none focus:border-accent-green text-gray-100 font-mono"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-accent-green text-dark-bg font-semibold rounded-lg hover:bg-green-400 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
