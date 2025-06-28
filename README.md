# TrendWise - AI-Powered Blog Platform

![TrendWise](https://img.shields.io/badge/TrendWise-AI%20Blog-blue)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

> A full-stack SEO-optimized blog platform that fetches trending topics and uses AI to generate comprehensive articles with embedded media.

## 🌟 Features

### 🤖 AI-Powered Content Generation
- **Gemini AI Integration**: Generate high-quality, SEO-optimized articles
- **Smart Content Structure**: Automated H1-H3 headings, meta descriptions
- **Media Integration**: Embedded images, videos, and tweets
- **Keyword Optimization**: AI-driven keyword selection and placement

### 📈 Trending Topic Discovery
- **Multi-Source Data**: Google Trends, Twitter API, GitHub Trending
- **Real-time Updates**: Live trending topic monitoring
- **Smart Filtering**: Category-based trending analysis
- **Trend Scoring**: Advanced algorithms to rank topic popularity

### 🔍 Advanced Search & Discovery
- **Intelligent Search**: Full-text search across articles, tags, and metadata
- **Recent Searches**: Saved search history for quick access
- **Auto-suggestions**: Smart search recommendations
- **Filter Options**: Category, date, and relevance filters

### 🔐 Authentication & User Management
- **Google OAuth**: Seamless Google Sign-In integration
- **Session Management**: Secure user session handling
- **Protected Routes**: Admin-only areas and features
- **User Profiles**: Comment history and preferences

### 💬 Interactive Comments System
- **Real-time Comments**: Live comment posting and viewing
- **User Attribution**: Comments linked to authenticated users
- **Moderation Tools**: Admin comment management
- **Engagement Metrics**: Like counts and interaction tracking

### 📱 Modern UI/UX
- **Responsive Design**: Mobile-first, fully responsive layout
- **Dark/Light Mode**: System-aware theme switching
- **Smooth Animations**: Polished transitions and interactions
- **Accessibility**: WCAG compliant design patterns

### ⚡ Performance & SEO
- **Next.js 14+**: App Router, SSR, ISR for optimal performance
- **Dynamic Sitemap**: Auto-generated XML sitemap
- **Meta Tags**: Complete OpenGraph and Twitter Card support
- **Fast Loading**: Optimized images, lazy loading, and caching

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14+, React 19, TypeScript |
| **Styling** | TailwindCSS, Radix UI, Lucide Icons |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | NextAuth.js, Google OAuth |
| **AI/ML** | Google Gemini AI, OpenAI GPT (optional) |
| **Deployment** | Vercel, MongoDB Atlas |
| **SEO** | Dynamic sitemap, Meta tags, Schema markup |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Google Cloud Console project
- Gemini API key

### 1. Clone and Install
```bash
git clone https://github.com/your-username/trendwise-internship.git
cd trendwise-internship
npm install
```

### 2. Environment Setup
Create `.env.local`:
```bash
# Database
MONGODB_URI=your-mongodb-connection-string

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI
GEMINI_API_KEY=your-gemini-api-key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Development
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 📖 API Documentation

### Articles API
- `GET /api/articles` - Fetch all articles
- `GET /api/articles/[slug]` - Get article by slug
- `POST /api/articles/generate` - Generate new article with AI

### Search API
- `GET /api/search?q={query}` - Search articles

### Trending API
- `GET /api/trending` - Get trending topics
- `POST /api/trending` - Refresh trending data

### Comments API
- `GET /api/comments?articleId={id}` - Get article comments
- `POST /api/comments` - Create new comment

## 🎯 Key Features Implementation

### AI Article Generation
```typescript
// Generate article from trending topic
const response = await fetch('/api/articles/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    topic: "React 19 New Features",
    keywords: ["React", "JavaScript", "Frontend"],
    media: { image: "...", videos: [...], tweets: [...] }
  })
})
```

### Search Functionality
```typescript
// Intelligent search with MongoDB text indexing
const articles = await db.collection("articles").find({
  $or: [
    { title: { $regex: query, $options: "i" } },
    { content: { $regex: query, $options: "i" } },
    { tags: { $in: [new RegExp(query, "i")] } }
  ]
}).sort({ publishedAt: -1 }).toArray()
```

### Trending Topics Integration
```typescript
// Multi-source trending data aggregation
const trendingData = {
  google_trends: await fetchGoogleTrends(),
  twitter_api: await fetchTwitterTrends(),
  github_trending: await fetchGitHubTrending()
}
```

## 📂 Project Structure

```
trendwise-internship/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── articles/      # Article management
│   │   ├── comments/      # Comment system
│   │   ├── search/        # Search functionality
│   │   └── trending/      # Trending topics
│   ├── admin/             # Admin dashboard
│   ├── article/[slug]/    # Dynamic article pages
│   ├── trending/          # Trending topics page
│   └── login/             # Authentication pages
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── article-generator.tsx
│   ├── search-component.tsx
│   ├── trending-topics.tsx
│   └── navigation.tsx
├── lib/                  # Utilities and configurations
│   ├── auth.ts          # NextAuth configuration
│   ├── mongodb.ts       # Database connection
│   └── utils.ts         # Helper functions
└── types/               # TypeScript definitions
```

## 🔧 Configuration

### Google OAuth Setup
1. Create project in Google Cloud Console
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs

### MongoDB Setup
1. Create MongoDB Atlas cluster
2. Create database named "trendwise"
3. Create collections: articles, comments, users
4. Add connection string to environment

### Gemini AI Setup
1. Get API key from Google AI Studio
2. Add to environment variables
3. Configure rate limits and usage quotas

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Vercel
Add all environment variables in Vercel dashboard under Settings → Environment Variables.

### Custom Domain
1. Add domain in Vercel settings
2. Update NEXTAUTH_URL and NEXT_PUBLIC_BASE_URL
3. Update Google OAuth redirect URIs

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Database**: Connection pooling and query optimization

## 🔒 Security

- **Authentication**: Secure OAuth implementation
- **Data Validation**: Input sanitization and validation
- **Environment Variables**: Secure secret management
- **CORS**: Properly configured cross-origin requests

## 🛠️ Development

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Testing
```bash
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📈 SEO Features

- **Dynamic Sitemap**: Auto-generated XML sitemap at `/sitemap.xml`
- **Robots.txt**: SEO-friendly robots configuration
- **Meta Tags**: Complete OpenGraph and Twitter Card support
- **Schema Markup**: Structured data for articles
- **Fast Loading**: Optimized Core Web Vitals

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Vercel](https://vercel.com/) for seamless deployment
- [TailwindCSS](https://tailwindcss.com/) for beautiful styling
- [MongoDB](https://mongodb.com/) for robust database solutions
- [Google AI](https://ai.google.dev/) for powerful AI capabilities

---

## 📞 Support

If you have any questions or need help with deployment, please check the [DEPLOYMENT.md](DEPLOYMENT.md) guide or open an issue.

**Live Demo**: [https://trendwise-internship.vercel.app](https://trendwise-internship.vercel.app)

Made with ❤️ for the TrendWise Internship Project
