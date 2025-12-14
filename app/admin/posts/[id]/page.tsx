'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostForm from '@/components/PostForm';
import Link from 'next/link';

interface Post {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  codeSnippets?: Array<{
    language: string;
    code: string;
    title?: string;
    highlight?: number[];
  }>;
  publishedAt: string;
  featured: boolean;
  readTime: number;
  status: 'draft' | 'published';
}

export default function EditPostPage() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }

      const data = await response.json();
      setPost(data);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Header */}
      <header className="border-b border-green-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-400 font-mono">&gt; Edit Post</h1>
              <p className="text-gray-400 mt-1 font-mono text-sm">
                // Update existing blog post
              </p>
            </div>
            <Link
              href="/admin"
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-6 py-3 rounded-lg font-mono transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-lg p-8 shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-green-400 font-mono text-lg">Loading post...</div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-red-400 font-mono mb-4">Error: {error}</div>
              <Link
                href="/admin"
                className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-mono transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          ) : post ? (
            <PostForm
              initialData={{
                ...post,
                publishedAt: new Date(post.publishedAt),
              }}
              postId={id}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-gray-400 font-mono mb-4">Post not found</div>
              <Link
                href="/admin"
                className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-mono transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
