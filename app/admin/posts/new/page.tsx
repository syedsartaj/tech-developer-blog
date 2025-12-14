import PostForm from '@/components/PostForm';
import Link from 'next/link';

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Header */}
      <header className="border-b border-green-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-400 font-mono">&gt; New Post</h1>
              <p className="text-gray-400 mt-1 font-mono text-sm">// Create a new blog post</p>
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
          <PostForm />
        </div>
      </main>
    </div>
  );
}
