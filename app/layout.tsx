import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DevBlog - Tech & Development Insights',
  description: 'A developer-focused blog featuring tutorials, code snippets, and technical insights on modern web development, programming languages, and software engineering best practices.',
  keywords: ['development', 'programming', 'coding', 'tutorials', 'tech blog', 'software engineering'],
  authors: [{ name: 'DevBlog' }],
  openGraph: {
    title: 'DevBlog - Tech & Development Insights',
    description: 'Technical articles and tutorials for modern developers',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevBlog - Tech & Development Insights',
    description: 'Technical articles and tutorials for modern developers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-dark-bg text-gray-100 antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
