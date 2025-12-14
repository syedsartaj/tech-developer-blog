'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Code, Terminal, Eye, X, Save, Image } from 'lucide-react';

// TypeScript Interfaces
interface Author {
  name: string;
  avatar: string;
  github: string;
  twitter: string;
}

interface CodeSnippet {
  language: string;
  code: string;
  filename?: string;
}

interface Post {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: Author;
  category: 'tutorials' | 'news' | 'reviews' | 'opinion' | 'guides';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  codeSnippets: CodeSnippet[];
  techStack: string[];
  published: boolean;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface Stats {
  total: number;
  published: number;
  drafts: number;
  byCategory: {
    tutorials: number;
    news: number;
    reviews: number;
    opinion: number;
    guides: number;
  };
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const CATEGORIES = ['tutorials', 'news', 'reviews', 'opinion', 'guides'] as const;
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    published: 0,
    drafts: 0,
    byCategory: { tutorials: 0, news: 0, reviews: 0, opinion: 0, guides: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [formData, setFormData] = useState<Post>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: { name: '', avatar: '', github: '', twitter: '' },
    category: 'tutorials',
    difficulty: 'beginner',
    readTime: 5,
    codeSnippets: [],
    techStack: [],
    published: false,
    tags: [],
  });

  // Fetch posts on mount and when search changes
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      const data = await response.json();

      const postsData = Array.isArray(data) ? data : data.posts || [];
      setPosts(postsData);
      calculateStats(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      showToast('Failed to fetch posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (postsData: Post[]) => {
    const stats: Stats = {
      total: postsData.length,
      published: postsData.filter(p => p.published).length,
      drafts: postsData.filter(p => !p.published).length,
      byCategory: {
        tutorials: postsData.filter(p => p.category === 'tutorials').length,
        news: postsData.filter(p => p.category === 'news').length,
        reviews: postsData.filter(p => p.category === 'reviews').length,
        opinion: postsData.filter(p => p.category === 'opinion').length,
        guides: postsData.filter(p => p.category === 'guides').length,
      },
    };
    setStats(stats);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      author: { name: '', avatar: '', github: '', twitter: '' },
      category: 'tutorials',
      difficulty: 'beginner',
      readTime: 5,
      codeSnippets: [],
      techStack: [],
      published: false,
      tags: [],
    });
    setShowForm(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setFormData(post);
    setShowForm(true);
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Post deleted successfully', 'success');
        await fetchPosts();
      } else {
        showToast('Failed to delete post', 'error');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Error deleting post', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPost ? `/api/posts/${editingPost._id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(
          editingPost ? 'Post updated successfully' : 'Post created successfully',
          'success'
        );
        setShowForm(false);
        setEditingPost(null);
        await fetchPosts();
      } else {
        showToast('Failed to save post', 'error');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      showToast('Error saving post', 'error');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAuthorChange = (field: keyof Author, value: string) => {
    setFormData(prev => ({
      ...prev,
      author: { ...prev.author, [field]: value },
    }));
  };

  const handleArrayChange = (field: 'tags' | 'techStack', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(Boolean),
    }));
  };

  const addCodeSnippet = () => {
    setFormData(prev => ({
      ...prev,
      codeSnippets: [...prev.codeSnippets, { language: '', code: '', filename: '' }],
    }));
  };

  const updateCodeSnippet = (index: number, field: keyof CodeSnippet, value: string) => {
    setFormData(prev => ({
      ...prev,
      codeSnippets: prev.codeSnippets.map((snippet, i) =>
        i === index ? { ...snippet, [field]: value } : snippet
      ),
    }));
  };

  const removeCodeSnippet = (index: number) => {
    setFormData(prev => ({
      ...prev,
      codeSnippets: prev.codeSnippets.filter((_, i) => i !== index),
    }));
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-lg shadow-lg border-l-4 backdrop-blur-sm flex items-center gap-3 ${
              toast.type === 'success'
                ? 'bg-green-900/90 border-green-500 text-green-100'
                : 'bg-red-900/90 border-red-500 text-red-100'
            }`}
          >
            <Terminal className="w-5 h-5" />
            <span className="font-mono text-sm">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-green-500/30 bg-black/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-8 h-8 text-green-400" />
              <div>
                <h1 className="text-3xl font-bold text-green-400 font-mono">
                  &gt; Tech Blog Dashboard
                </h1>
                <p className="text-gray-400 mt-1 font-mono text-sm">
                  // Centralized CRUD Control Panel
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Actions Section */}
        <div className="mb-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-400 font-mono mb-4 flex items-center gap-2">
            <Code className="w-6 h-6" />
            // Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCreatePost}
              className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-bold font-mono flex items-center gap-2 transition-all shadow-lg shadow-green-500/50 hover:shadow-green-500/70"
            >
              <Plus className="w-5 h-5" />
              Create Post
            </button>
            <button
              onClick={() => fetchPosts()}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 px-6 py-3 rounded-lg font-bold font-mono flex items-center gap-2 transition-all"
            >
              <Terminal className="w-5 h-5" />
              Refresh Data
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 border border-gray-600 px-6 py-3 rounded-lg font-bold font-mono flex items-center gap-2 transition-all"
            >
              <X className="w-5 h-5" />
              Close Form
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-lg p-4 shadow-lg">
            <p className="text-gray-400 text-xs font-mono mb-1">// Total</p>
            <p className="text-2xl font-bold text-green-400 font-mono">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500/30 rounded-lg p-4 shadow-lg">
            <p className="text-gray-400 text-xs font-mono mb-1">// Published</p>
            <p className="text-2xl font-bold text-blue-400 font-mono">{stats.published}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/30 rounded-lg p-4 shadow-lg">
            <p className="text-gray-400 text-xs font-mono mb-1">// Drafts</p>
            <p className="text-2xl font-bold text-yellow-400 font-mono">{stats.drafts}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 rounded-lg p-4 shadow-lg">
            <p className="text-gray-400 text-xs font-mono mb-1">// Tutorials</p>
            <p className="text-2xl font-bold text-purple-400 font-mono">{stats.byCategory.tutorials}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-lg p-4 shadow-lg">
            <p className="text-gray-400 text-xs font-mono mb-1">// News</p>
            <p className="text-2xl font-bold text-cyan-400 font-mono">{stats.byCategory.news}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-pink-500/30 rounded-lg p-4 shadow-lg">
            <p className="text-gray-400 text-xs font-mono mb-1">// Guides</p>
            <p className="text-2xl font-bold text-pink-400 font-mono">{stats.byCategory.guides}</p>
          </div>
        </div>

        {/* Inline Create/Edit Form */}
        {showForm && (
          <div className="mb-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-green-500/30 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-400 font-mono flex items-center gap-2">
                <Edit className="w-6 h-6" />
                {editingPost ? '// Edit Post' : '// Create New Post'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    placeholder="Enter post title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    placeholder="post-slug"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Excerpt *</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  placeholder="Brief description..."
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  placeholder="Full content (markdown supported)..."
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Featured Image URL *
                </label>
                <input
                  type="text"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  placeholder="https://..."
                />
              </div>

              {/* Author Info */}
              <div className="border-t border-green-500/20 pt-6">
                <h3 className="text-lg font-bold text-green-400 font-mono mb-4">// Author Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">Author Name *</label>
                    <input
                      type="text"
                      value={formData.author.name}
                      onChange={(e) => handleAuthorChange('name', e.target.value)}
                      required
                      className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">Avatar URL *</label>
                    <input
                      type="text"
                      value={formData.author.avatar}
                      onChange={(e) => handleAuthorChange('avatar', e.target.value)}
                      required
                      className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">GitHub</label>
                    <input
                      type="text"
                      value={formData.author.github}
                      onChange={(e) => handleAuthorChange('github', e.target.value)}
                      className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">Twitter</label>
                    <input
                      type="text"
                      value={formData.author.twitter}
                      onChange={(e) => handleAuthorChange('twitter', e.target.value)}
                      className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">Difficulty *</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    {DIFFICULTIES.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">Read Time (min)</label>
                  <input
                    type="number"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
              </div>

              {/* Tech Stack & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formData.techStack.join(', ')}
                    onChange={(e) => handleArrayChange('techStack', e.target.value)}
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleArrayChange('tags', e.target.value)}
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    placeholder="javascript, web, frontend"
                  />
                </div>
              </div>

              {/* Code Snippets */}
              <div className="border-t border-green-500/20 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-green-400 font-mono flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    // Code Snippets
                  </h3>
                  <button
                    type="button"
                    onClick={addCodeSnippet}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 px-4 py-2 rounded-lg text-sm font-mono flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Snippet
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.codeSnippets.map((snippet, index) => (
                    <div key={index} className="bg-black/30 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-green-400 font-mono text-sm">Snippet {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeCodeSnippet(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={snippet.language}
                          onChange={(e) => updateCodeSnippet(index, 'language', e.target.value)}
                          className="bg-black/50 border border-green-500/30 rounded px-3 py-2 text-gray-100 font-mono text-sm focus:border-green-500 focus:outline-none"
                          placeholder="Language (e.g., javascript)"
                        />
                        <input
                          type="text"
                          value={snippet.filename || ''}
                          onChange={(e) => updateCodeSnippet(index, 'filename', e.target.value)}
                          className="bg-black/50 border border-green-500/30 rounded px-3 py-2 text-gray-100 font-mono text-sm focus:border-green-500 focus:outline-none"
                          placeholder="Filename (optional)"
                        />
                      </div>
                      <textarea
                        value={snippet.code}
                        onChange={(e) => updateCodeSnippet(index, 'code', e.target.value)}
                        rows={6}
                        className="w-full bg-black/50 border border-green-500/30 rounded px-3 py-2 text-gray-100 font-mono text-sm focus:border-green-500 focus:outline-none"
                        placeholder="Code..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="w-5 h-5 bg-black/50 border border-green-500/30 rounded text-green-500 focus:ring-2 focus:ring-green-500/20"
                />
                <label htmlFor="published" className="text-gray-300 font-mono text-sm">
                  Publish post (make it live)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-green-500/20">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-black px-8 py-3 rounded-lg font-bold font-mono flex items-center gap-2 transition-all shadow-lg shadow-green-500/50"
                >
                  <Save className="w-5 h-5" />
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 border border-gray-600 px-8 py-3 rounded-lg font-bold font-mono transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-green-400" />
            <input
              type="text"
              placeholder="Search posts by title, excerpt, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-green-500/30 rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-black/50 border-b border-green-500/30 px-6 py-4">
            <h2 className="text-xl font-bold text-green-400 font-mono flex items-center gap-2">
              <Terminal className="w-6 h-6" />
              // All Posts ({filteredPosts.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-green-400 font-mono flex items-center gap-3">
                <Terminal className="w-6 h-6 animate-pulse" />
                Loading...
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Code className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-400 font-mono mb-4">
                {searchTerm ? 'No posts match your search' : 'No posts yet'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreatePost}
                  className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-bold font-mono flex items-center gap-2 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-green-500/10">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="px-6 py-6 hover:bg-green-500/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-100 font-mono">
                          {post.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-mono ${
                            post.published
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}
                        >
                          {post.published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 font-mono">{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-gray-500 font-mono flex items-center gap-1">
                          <Code className="w-4 h-4" />
                          {post.category}
                        </span>
                        <span className="text-gray-500 font-mono">
                          {post.difficulty}
                        </span>
                        <span className="text-gray-500 font-mono flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.readTime} min
                        </span>
                        {post.techStack.length > 0 && (
                          <div className="flex items-center gap-2">
                            {post.techStack.slice(0, 3).map((tech, i) => (
                              <span
                                key={i}
                                className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-mono border border-purple-500/30"
                              >
                                {tech}
                              </span>
                            ))}
                            {post.techStack.length > 3 && (
                              <span className="text-gray-500 text-xs font-mono">
                                +{post.techStack.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 px-4 py-2 rounded-lg text-sm font-mono flex items-center gap-2 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id!, post.title)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-mono flex items-center gap-2 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
