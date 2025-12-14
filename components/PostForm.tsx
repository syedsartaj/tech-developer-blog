'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface CodeSnippet {
  language: string;
  code: string;
  title?: string;
  highlight?: number[];
}

interface PostFormData {
  title: string;
  slug: string;
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
  codeSnippets?: CodeSnippet[];
  featured: boolean;
  readTime: number;
  status: 'draft' | 'published';
  publishedAt?: Date;
}

interface PostFormProps {
  initialData?: Partial<PostFormData>;
  postId?: string;
}

const CATEGORIES = [
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

const CODE_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'rust',
  'html',
  'css',
  'bash',
  'sql',
  'json',
  'yaml',
  'markdown',
];

export default function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    coverImage: initialData?.coverImage || '',
    author: initialData?.author || {
      name: '',
      email: '',
      avatar: '',
    },
    category: initialData?.category || CATEGORIES[0],
    tags: initialData?.tags || [],
    codeSnippets: initialData?.codeSnippets || [],
    featured: initialData?.featured || false,
    readTime: initialData?.readTime || 5,
    status: initialData?.status || 'draft',
    publishedAt: initialData?.publishedAt,
  });

  const [tagInput, setTagInput] = useState('');
  const [snippetInput, setSnippetInput] = useState<CodeSnippet>({
    language: 'javascript',
    code: '',
    title: '',
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleAddCodeSnippet = () => {
    if (snippetInput.code.trim()) {
      setFormData({
        ...formData,
        codeSnippets: [...(formData.codeSnippets || []), snippetInput],
      });
      setSnippetInput({
        language: 'javascript',
        code: '',
        title: '',
      });
    }
  };

  const handleRemoveCodeSnippet = (index: number) => {
    setFormData({
      ...formData,
      codeSnippets: formData.codeSnippets?.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = postId ? `/api/posts/${postId}` : '/api/posts';
      const method = postId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save post');
      }

      const savedPost = await response.json();
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error saving post:', error);
      alert(error instanceof Error ? error.message : 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">// Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          placeholder="Enter post title..."
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">// Slug (URL) *</label>
        <input
          type="text"
          required
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          placeholder="post-url-slug"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">// Excerpt *</label>
        <textarea
          required
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={3}
          className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          placeholder="Brief summary of the post..."
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">// Content (Markdown) *</label>
        <textarea
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={15}
          className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-gray-100 font-mono text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          placeholder="Write your post content in Markdown..."
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">// Cover Image URL</label>
        <input
          type="url"
          value={formData.coverImage}
          onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
          className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Author Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">// Author Name *</label>
          <input
            type="text"
            required
            value={formData.author.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                author: { ...formData.author, name: e.target.value },
              })
            }
            className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">// Author Email *</label>
          <input
            type="email"
            required
            value={formData.author.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                author: { ...formData.author, email: e.target.value },
              })
            }
            className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* Category and Read Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">// Category *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">// Read Time (minutes)</label>
          <input
            type="number"
            min="1"
            value={formData.readTime}
            onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
            className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">// Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-1 bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            placeholder="Add tag..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg font-mono border border-green-500/30"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-mono flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Code Snippets */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">// Code Snippets</label>
        <div className="bg-black/30 border border-green-500/20 rounded-lg p-4 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">Language</label>
              <select
                value={snippetInput.language}
                onChange={(e) => setSnippetInput({ ...snippetInput, language: e.target.value })}
                className="w-full bg-black/50 border border-green-500/30 rounded-lg px-3 py-2 text-gray-100 font-mono text-sm"
              >
                {CODE_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">Title (optional)</label>
              <input
                type="text"
                value={snippetInput.title}
                onChange={(e) => setSnippetInput({ ...snippetInput, title: e.target.value })}
                className="w-full bg-black/50 border border-green-500/30 rounded-lg px-3 py-2 text-gray-100 font-mono text-sm"
                placeholder="e.g., API Example"
              />
            </div>
          </div>
          <textarea
            value={snippetInput.code}
            onChange={(e) => setSnippetInput({ ...snippetInput, code: e.target.value })}
            rows={6}
            className="w-full bg-black/50 border border-green-500/30 rounded-lg px-3 py-2 text-gray-100 font-mono text-sm mb-2"
            placeholder="Paste your code here..."
          />
          <button
            type="button"
            onClick={handleAddCodeSnippet}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg font-mono text-sm border border-blue-500/30"
          >
            Add Code Snippet
          </button>
        </div>

        {formData.codeSnippets && formData.codeSnippets.length > 0 && (
          <div className="space-y-2">
            {formData.codeSnippets.map((snippet, index) => (
              <div
                key={index}
                className="bg-black/30 border border-green-500/20 rounded-lg p-3 flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 font-mono text-sm">{snippet.language}</span>
                    {snippet.title && (
                      <span className="text-gray-400 font-mono text-sm">- {snippet.title}</span>
                    )}
                  </div>
                  <pre className="text-gray-400 font-mono text-xs overflow-x-auto">
                    {snippet.code.substring(0, 100)}...
                  </pre>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCodeSnippet(index)}
                  className="text-red-400 hover:text-red-300 font-mono ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status and Featured */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">// Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
            className="w-full bg-black/50 border border-green-500/30 rounded-lg px-4 py-3 text-gray-100 font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 rounded border-green-500/30 bg-black/50 text-green-500 focus:ring-green-500/20"
            />
            <span className="text-sm font-mono text-gray-400">// Featured Post</span>
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-6 border-t border-green-500/20">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-black disabled:text-gray-400 px-6 py-3 rounded-lg font-bold font-mono transition-all duration-200 shadow-lg shadow-green-500/50 disabled:shadow-none"
        >
          {loading ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg font-mono transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
