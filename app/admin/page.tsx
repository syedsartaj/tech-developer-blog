'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  slug: string;
  category: string;
  status: 'draft' | 'published';
  featured: boolean;
  readTime: number;
  createdAt: string;
  updatedAt: string;
  views: number;
}

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, filterStatus, filterCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterCategory !== 'all') params.append('category', filterCategory);

      const response = await fetch(`/api/posts?${params.toString()}`);
      const data = await response.json();

      setPosts(data.posts || []);

      // Calculate stats
      const totalPosts = data.total || 0;
      const published = data.posts?.filter((p: Post) => p.status === 'published').length || 0;
      const drafts = data.posts?.filter((p: Post) => p.status === 'draft').length || 0;
      const views = data.posts?.reduce((acc: number, p: Post) => acc + (p.views || 0), 0) || 0;

      setStats({
        totalPosts,
        publishedPosts: published,
        draftPosts: drafts,
        totalViews: views,
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const categories = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'DevOps',
    'Cloud',
    'AI/ML',
    'Web Development',
    'Mobile',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Header */}
      <header className="border-b border-green-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-400 font-mono">&gt; Blog Admin</h1>
              <p className="text-gray-400 mt-1 font-mono text-sm">// Content Management System</p>
            </div>
            <Link
              href="/admin/posts/new"
              className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg shadow-green-500/50 hover:shadow-green-500/70 font-mono"
            >
              + New Post
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono mb-1">Total Posts</p>
                <p className="text-3xl font-bold text-green-400 font-mono">{stats.totalPosts}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500/30 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono mb-1">Published</p>
                <p className="text-3xl font-bold text-blue-400 font-mono">{stats.publishedPosts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/30 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono mb-1">Drafts</p>
                <p className="text-3xl font-bold text-yellow-400 font-mono">{stats.draftPosts}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-mono mb-1">Total Views</p>
                <p className="text-3xl font-bold text-purple-400 font-mono">{stats.totalViews}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-lg p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">// Search</label>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">// Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'draft' | 'published')}
                className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">// Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-green-400 font-mono">Loading...</div>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-400 font-mono mb-4">No posts found</p>
                <Link
                  href="/admin/posts/new"
                  className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-bold transition-all duration-200 font-mono"
                >
                  Create First Post
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-black/50 border-b border-green-500/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-mono text-green-400">Updated</th>
                    <th className="px-6 py-4 text-right text-sm font-mono text-green-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-500/10">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-green-500/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-100">{post.title}</span>
                          {post.featured && (
                            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded font-mono">
                              FEATURED
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 font-mono text-sm">{post.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono ${
                            post.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {post.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 font-mono text-sm">{post.views || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 font-mono text-sm">
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/posts/${post._id}`}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-sm font-mono transition-colors border border-blue-500/30"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id, post.title)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm font-mono transition-colors border border-red-500/30"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
