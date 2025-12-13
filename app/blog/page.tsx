import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  codePreview?: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'building-scalable-apis-with-nodejs',
    title: 'Building Scalable APIs with Node.js and Express',
    date: '2024-01-15',
    excerpt: 'Learn how to architect and build production-ready REST APIs using Node.js, Express, and modern best practices for scalability.',
    tags: ['Node.js', 'Express', 'API', 'Backend'],
    readTime: '8 min read',
    codePreview: 'const express = require("express");\nconst app = express();'
  },
  {
    slug: 'mastering-react-hooks',
    title: 'Mastering React Hooks: A Deep Dive',
    date: '2024-01-10',
    excerpt: 'Explore advanced React Hooks patterns, custom hooks, and performance optimization techniques for modern React applications.',
    tags: ['React', 'JavaScript', 'Frontend'],
    readTime: '12 min read',
    codePreview: 'const [state, setState] = useState(initialValue);'
  },
  {
    slug: 'typescript-best-practices-2024',
    title: 'TypeScript Best Practices in 2024',
    date: '2024-01-05',
    excerpt: 'Comprehensive guide to TypeScript best practices, type safety patterns, and advanced typing techniques.',
    tags: ['TypeScript', 'JavaScript', 'Development'],
    readTime: '10 min read',
    codePreview: 'interface User {\n  id: number;\n  name: string;\n}'
  },
  {
    slug: 'docker-kubernetes-deployment',
    title: 'Container Orchestration: Docker to Kubernetes',
    date: '2023-12-28',
    excerpt: 'Step-by-step guide to containerizing applications with Docker and deploying them to Kubernetes clusters.',
    tags: ['Docker', 'Kubernetes', 'DevOps'],
    readTime: '15 min read',
    codePreview: 'FROM node:18-alpine\nWORKDIR /app'
  },
  {
    slug: 'graphql-vs-rest',
    title: 'GraphQL vs REST: When to Use Each',
    date: '2023-12-20',
    excerpt: 'An in-depth comparison of GraphQL and REST APIs, exploring use cases, performance, and implementation strategies.',
    tags: ['GraphQL', 'REST', 'API'],
    readTime: '7 min read',
    codePreview: 'query GetUser($id: ID!) {\n  user(id: $id) { name }\n}'
  },
  {
    slug: 'database-optimization-postgresql',
    title: 'Database Optimization Techniques for PostgreSQL',
    date: '2023-12-15',
    excerpt: 'Improve your PostgreSQL database performance with indexing strategies, query optimization, and configuration tuning.',
    tags: ['PostgreSQL', 'Database', 'Performance'],
    readTime: '11 min read',
    codePreview: 'CREATE INDEX idx_users_email ON users(email);'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Tech Blog</h1>
          <p className="text-xl text-gray-400">
            Articles about web development, software engineering, and technology
          </p>
        </div>

        <div className="space-y-6">
          {blogPosts.map((post) => (
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
          ))}
        </div>

        <div className="mt-12 text-center text-gray-400">
          <p>More articles coming soon...</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
