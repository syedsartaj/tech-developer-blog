'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-bold mb-6">Get In Touch</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? Feel free to reach out!
        </p>
        <div className="h-1 w-20 bg-[#00ff88] mx-auto mt-6"></div>
      </div>

      <div className="grid md:grid-cols-5 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-[#161b22] border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#00ff88] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0d1117] font-bold">@</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a
                    href="mailto:dev@example.com"
                    className="text-gray-400 hover:text-[#00ff88] transition-colors"
                  >
                    dev@example.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#00ff88] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0d1117] font-bold">#</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-gray-400">San Francisco, CA</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#00ff88] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0d1117] font-bold">T</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Response Time</h3>
                  <p className="text-gray-400">Usually within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Social Links</h2>
            <div className="space-y-3">
              {[
                { name: 'GitHub', url: 'https://github.com' },
                { name: 'LinkedIn', url: 'https://linkedin.com' },
                { name: 'Twitter', url: 'https://twitter.com' },
                { name: 'Dev.to', url: 'https://dev.to' }
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-[#0d1117] border border-gray-800 rounded-lg hover:border-[#00ff88] transition-colors group"
                >
                  <span>{link.name}</span>
                  <span className="text-[#00ff88] group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#00ff88] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">Available for Hire</h2>
            <p className="text-gray-400 text-sm mb-4">
              I&apos;m currently accepting freelance projects and contract work. Let&apos;s build something amazing together!
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-[#0d1117] border border-gray-800 rounded-full text-xs text-[#00ff88]">
                Full Stack Development
              </span>
              <span className="px-3 py-1 bg-[#0d1117] border border-gray-800 rounded-full text-xs text-[#00ff88]">
                API Design
              </span>
              <span className="px-3 py-1 bg-[#0d1117] border border-gray-800 rounded-full text-xs text-[#00ff88]">
                Consulting
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-[#161b22] border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-[#00ff88] bg-opacity-10 border border-[#00ff88] rounded-lg">
                <p className="text-[#00ff88] font-semibold">
                  Message sent successfully! I&apos;ll get back to you soon.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                <p className="text-red-500 font-semibold">
                  Something went wrong. Please try again.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0d1117] border border-gray-800 rounded-lg focus:border-[#00ff88] focus:outline-none transition-colors text-gray-100"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0d1117] border border-gray-800 rounded-lg focus:border-[#00ff88] focus:outline-none transition-colors text-gray-100"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0d1117] border border-gray-800 rounded-lg focus:border-[#00ff88] focus:outline-none transition-colors text-gray-100"
                >
                  <option value="">Select a subject</option>
                  <option value="freelance">Freelance Project</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="question">Technical Question</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 bg-[#0d1117] border border-gray-800 rounded-lg focus:border-[#00ff88] focus:outline-none transition-colors text-gray-100 resize-none font-mono"
                  placeholder="Tell me about your project or inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full px-8 py-4 bg-[#00ff88] text-[#0d1117] font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              <p className="text-sm text-gray-400 text-center">
                By submitting this form, you agree to be contacted regarding your inquiry.
              </p>
            </form>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-[#00ff88] mb-2">24h</div>
              <p className="text-sm text-gray-400">Average Response Time</p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-[#00ff88] mb-2">50+</div>
              <p className="text-sm text-gray-400">Projects Completed</p>
            </div>
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-[#00ff88] mb-2">100%</div>
              <p className="text-sm text-gray-400">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
