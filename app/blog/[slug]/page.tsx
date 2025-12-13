import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
    content: `
Building scalable APIs is crucial for modern web applications. In this guide, we'll explore best practices for creating production-ready REST APIs using Node.js and Express.

## Setting Up the Project

First, let's initialize our Node.js project with the necessary dependencies:

\`\`\`bash
npm init -y
npm install express dotenv helmet cors compression
npm install -D typescript @types/node @types/express nodemon
\`\`\`

## Creating the Express Server

Here's a basic Express server setup with essential middleware:

\`\`\`javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', require('./routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Implementing Route Handlers

Organize your routes using Express Router for better modularity:

\`\`\`javascript
const express = require('express');
const router = express.Router();

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .limit(parseInt(req.query.limit) || 10)
      .skip(parseInt(req.query.skip) || 0);

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create user
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
\`\`\`

## Database Connection

Using MongoDB with Mongoose for data persistence:

\`\`\`javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
\`\`\`

## Performance Optimization

### 1. Implement Caching

Use Redis for caching frequently accessed data:

\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

const cacheMiddleware = (duration) => async (req, res, next) => {
  const key = req.originalUrl;

  try {
    const cached = await client.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    res.originalJson = res.json;
    res.json = (data) => {
      client.setex(key, duration, JSON.stringify(data));
      res.originalJson(data);
    };

    next();
  } catch (error) {
    next();
  }
};
\`\`\`

### 2. Rate Limiting

Protect your API from abuse with rate limiting:

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
\`\`\`

## Conclusion

Building scalable APIs requires careful planning and implementation of best practices. Focus on security, performance, and maintainability from the start.
    `
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
    content: `
React Hooks revolutionized how we write React components. Let's explore advanced patterns and best practices.

## Understanding useState

The useState hook is the foundation of state management in functional components:

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
\`\`\`

## useEffect for Side Effects

Managing side effects properly is crucial:

\`\`\`javascript
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();

        if (!cancelled) {
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
}
\`\`\`

## Custom Hooks

Create reusable logic with custom hooks:

\`\`\`javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', 'Guest');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
\`\`\`

## Performance Optimization with useMemo and useCallback

\`\`\`javascript
import { useMemo, useCallback } from 'react';

function ExpensiveComponent({ items, onItemClick }) {
  // Memoize expensive calculations
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.value - b.value);
  }, [items]);

  // Memoize callback functions
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div>
      {sortedItems.map(item => (
        <Item
          key={item.id}
          item={item}
          onClick={() => handleClick(item.id)}
        />
      ))}
    </div>
  );
}
\`\`\`

React Hooks provide a powerful and flexible way to manage state and side effects in your applications.
    `
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
    content: `
TypeScript has become essential for building maintainable JavaScript applications. Here are the best practices for 2024.

## Type Safety

Always prefer explicit typing over implicit any:

\`\`\`typescript
// Bad
function processData(data: any) {
  return data.value;
}

// Good
interface DataItem {
  id: number;
  value: string;
}

function processData(data: DataItem): string {
  return data.value;
}
\`\`\`

## Advanced Type Patterns

\`\`\`typescript
// Utility types
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

// Pick specific properties
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Omit sensitive data
type SafeUser = Omit<User, 'password'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;
\`\`\`

## Generic Constraints

\`\`\`typescript
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Usage
const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
const user = findById(users, 1); // Type is inferred correctly
\`\`\`

TypeScript's type system helps catch bugs early and improves code maintainability.
    `
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

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100">
      <Header />

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

        <div className="prose prose-invert prose-lg max-w-none">
          <style jsx global>{`
            .prose h2 {
              font-size: 2rem;
              font-weight: 700;
              margin-top: 2.5rem;
              margin-bottom: 1rem;
              color: #fff;
              border-bottom: 1px solid #30363d;
              padding-bottom: 0.5rem;
            }

            .prose h3 {
              font-size: 1.5rem;
              font-weight: 600;
              margin-top: 2rem;
              margin-bottom: 0.75rem;
              color: #fff;
            }

            .prose p {
              margin-bottom: 1.5rem;
              line-height: 1.8;
              color: #c9d1d9;
            }

            .prose code {
              background: #161b22;
              border: 1px solid #30363d;
              border-radius: 4px;
              padding: 0.2rem 0.4rem;
              font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
              font-size: 0.9em;
              color: #00ff88;
            }

            .prose pre {
              background: #161b22;
              border: 1px solid #30363d;
              border-radius: 8px;
              padding: 1.5rem;
              overflow-x: auto;
              margin: 1.5rem 0;
            }

            .prose pre code {
              background: transparent;
              border: none;
              padding: 0;
              color: #c9d1d9;
              font-size: 0.9rem;
              line-height: 1.6;
            }

            .prose ul, .prose ol {
              margin: 1.5rem 0;
              padding-left: 2rem;
            }

            .prose li {
              margin-bottom: 0.5rem;
              color: #c9d1d9;
            }

            .prose strong {
              color: #00ff88;
              font-weight: 600;
            }

            .prose a {
              color: #00ff88;
              text-decoration: none;
              border-bottom: 1px solid transparent;
              transition: border-color 0.2s;
            }

            .prose a:hover {
              border-bottom-color: #00ff88;
            }
          `}</style>

          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
            } else if (paragraph.startsWith('### ')) {
              return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
            } else if (paragraph.startsWith('```')) {
              const codeContent = paragraph.replace(/```\w*\n/, '').replace(/```$/, '');
              return (
                <pre key={index}>
                  <code>{codeContent}</code>
                </pre>
              );
            } else if (paragraph.trim().length > 0) {
              return <p key={index} dangerouslySetInnerHTML={{ __html: paragraph.replace(/`([^`]+)`/g, '<code>$1</code>') }} />;
            }
            return null;
          })}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <h3 className="text-2xl font-bold mb-6">Share this article</h3>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-[#161b22] border border-gray-800 rounded-lg hover:border-[#00ff88] transition-colors">
              Twitter
            </button>
            <button className="px-6 py-3 bg-[#161b22] border border-gray-800 rounded-lg hover:border-[#00ff88] transition-colors">
              LinkedIn
            </button>
            <button className="px-6 py-3 bg-[#161b22] border border-gray-800 rounded-lg hover:border-[#00ff88] transition-colors">
              Copy Link
            </button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
