# TrendWise - Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- A Vercel account
- MongoDB Atlas database
- Google OAuth credentials
- Gemini API key

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# MongoDB
MONGODB_URI=your-mongodb-connection-string

# NextAuth.js
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# App URL
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
```

## Vercel Deployment Steps

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select your repository

### 2. Configure Environment Variables
In your Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add all the environment variables from your `.env.local` file
3. Make sure to add them for all environments (Production, Preview, Development)

### 3. Build Settings
Vercel should automatically detect your Next.js project. Verify these settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Deploy
1. Click "Deploy"
2. Wait for the deployment to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## Google OAuth Setup

### Update OAuth Redirect URIs
In your Google Cloud Console:
1. Go to "APIs & Services" → "Credentials"
2. Edit your OAuth 2.0 Client
3. Add your Vercel URL to Authorized redirect URIs:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

## MongoDB Atlas Setup

### 1. Create Database
1. Create a new MongoDB Atlas cluster
2. Create a database named `trendwise`
3. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)

### 2. Get Connection String
1. Go to "Database" → "Connect" → "Connect your application"
2. Copy the connection string
3. Replace `<password>` with your database password
4. Use this as your `MONGODB_URI`

## Domain Configuration (Optional)

### Using Custom Domain
1. In Vercel Dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update your environment variables:
   ```bash
   NEXTAUTH_URL=https://your-domain.com
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   ```
4. Update Google OAuth redirect URIs with your custom domain

## Testing Deployment

After deployment, test these features:
1. **Homepage**: Should load with articles
2. **Google Login**: Should work without errors
3. **Article Generation**: Test AI article creation
4. **Search**: Test article search functionality
5. **Trending**: Check trending topics page
6. **Admin**: Verify admin dashboard (after login)

## Troubleshooting

### Common Issues

1. **OAuth Errors**
   - Check redirect URIs match exactly
   - Verify environment variables are set correctly

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas

3. **Build Failures**
   - Check for TypeScript errors
   - Verify all dependencies are installed

4. **API Errors**
   - Confirm Gemini API key is valid
   - Check API rate limits

### Environment Variables Checklist
- [ ] MONGODB_URI
- [ ] NEXTAUTH_URL
- [ ] NEXTAUTH_SECRET
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] GEMINI_API_KEY
- [ ] NEXT_PUBLIC_BASE_URL

## Performance Optimization

### Recommended Vercel Settings
1. Enable "Automatically expose System Environment Variables"
2. Use Vercel Analytics (optional)
3. Enable "Function Regions" for better performance

### Caching
The app uses:
- ISR (Incremental Static Regeneration) for articles
- Client-side caching for search results
- MongoDB connection pooling

## Monitoring

### Vercel Analytics
1. Go to your project in Vercel
2. Navigate to "Analytics" tab
3. Monitor page views, performance, and user interactions

### Error Tracking
Check Vercel Functions logs for:
- API errors
- Database connection issues
- Authentication problems

## Security

### Environment Variables
- Never commit `.env.local` to version control
- Use strong, random secrets
- Rotate API keys regularly

### MongoDB
- Use strong database passwords
- Restrict IP access when possible
- Enable MongoDB Atlas security features

## Updates and Maintenance

### Automatic Deployments
- Vercel automatically deploys on git push to main branch
- Preview deployments are created for pull requests

### Manual Deployments
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments" → "Redeploy"

---

Your TrendWise application should now be live and fully functional on Vercel!
