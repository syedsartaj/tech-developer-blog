# Tech Developer Blog

A modern, dark-themed blog platform built for developers featuring code syntax highlighting, AI-powered content generation, and MongoDB integration. Perfect for technical writing, tutorials, and sharing programming insights.

## Features

- **Dark Theme Design**: Eye-friendly dark color scheme optimized for reading code
- **Syntax Highlighting**: Beautiful code block rendering with Prism.js
- **AI Content Generation**: OpenAI integration for automated blog post creation
- **MongoDB Database**: Scalable NoSQL database for blog posts and metadata
- **SEO Optimized**: Built-in SEO best practices and metadata management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Fully typed for better development experience
- **Performance**: Optimized with Next.js 14 and React Server Components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **AI**: OpenAI GPT-4
- **Fonts**: Inter + JetBrains Mono
- **Markdown**: react-markdown + remark-gfm
- **Syntax Highlighting**: Prism.js

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tech-developer-blog
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB_NAME=tech-developer-blog
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tech-developer-blog/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Homepage with featured posts
│   └── globals.css         # Global styles and syntax highlighting
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer with links
│   ├── BlogCard.tsx        # Blog post card component
│   └── CodeBlock.tsx       # Syntax highlighted code display
├── lib/
│   ├── db.ts              # MongoDB connection and operations
│   └── openai.ts          # OpenAI API integration
├── public/                # Static assets
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies and scripts
```

## Database Setup

### MongoDB Collections

The blog uses the following MongoDB collections:

#### Posts Collection
```typescript
{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt?: Date;
  status: 'draft' | 'published';
  featured: boolean;
  coverImage?: string;
  readTime: number;
  views: number;
  likes: number;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
  };
}
```

### Sample Data

To seed your database with sample posts:

```javascript
const samplePosts = [
  {
    title: "Building Scalable APIs with Node.js",
    slug: "building-scalable-apis-nodejs",
    excerpt: "Learn best practices for API development",
    content: "...", // Markdown content
    author: {
      name: "Jane Developer",
      email: "jane@example.com"
    },
    category: "Backend",
    tags: ["Node.js", "API", "Express"],
    publishedAt: new Date(),
    status: "published",
    featured: true,
    readTime: 8,
    views: 0,
    likes: 0
  }
];
```

## AI Content Generation

### Generate a Blog Post

```typescript
import { generateBlogPost } from '@/lib/openai';

const post = await generateBlogPost({
  topic: 'React Server Components',
  category: 'Frontend',
  tags: ['React', 'Next.js'],
  tone: 'technical',
  length: 'medium'
});
```

### Available AI Functions

- `generateBlogPost()` - Generate complete blog posts
- `explainCode()` - Explain code snippets
- `generateSEOMetadata()` - Create SEO metadata
- `improveBlogContent()` - Enhance existing content
- `generateRelatedTopics()` - Suggest related topics

## Customization

### Theme Colors

Edit `tailwind.config.ts` to customize colors:

```typescript
colors: {
  'dark-bg': '#0d1117',        // Main background
  'dark-card': '#161b22',      // Card background
  'code-bg': '#1c2128',        // Code block background
  'accent-green': '#00ff88',   // Primary accent
}
```

### Fonts

Customize fonts in `app/layout.tsx`:

```typescript
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });
```

### Code Syntax Theme

Modify syntax highlighting colors in `app/globals.css` under the Prism.js section.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables:
   - `MONGODB_URI`
   - `MONGODB_DB_NAME`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy to Other Platforms

The blog works with any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

Required variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGODB_DB_NAME` | Database name | `tech-developer-blog` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `NEXT_PUBLIC_SITE_URL` | Production URL | `https://yourblog.com` |

Optional variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID |
| `SMTP_*` | Email configuration for newsletters |
| `NEXTAUTH_*` | NextAuth.js configuration |

## Performance Optimization

- **Image Optimization**: Next.js Image component with AVIF/WebP
- **Code Splitting**: Automatic route-based splitting
- **Server Components**: React Server Components by default
- **Font Optimization**: Google Fonts with display swap
- **Caching**: MongoDB client pooling in development

## SEO Features

- Semantic HTML structure
- Open Graph metadata
- Twitter Card metadata
- Sitemap generation
- RSS feed support
- Structured data (JSON-LD)
- Optimized meta descriptions

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this template for your own projects!

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [Next.js documentation](https://nextjs.org/docs)
- Visit [MongoDB documentation](https://docs.mongodb.com/)
- Review [OpenAI API docs](https://platform.openai.com/docs)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [MongoDB](https://www.mongodb.com/)
- AI by [OpenAI](https://openai.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

Made with code and coffee by developers, for developers.
