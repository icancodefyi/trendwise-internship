# Google OAuth Setup Guide

## Google Cloud Console Configuration

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select an existing one
3. **Enable the Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"

## Required OAuth Configuration

### Authorized JavaScript Origins
```
https://trendwise-internship.vercel.app
http://localhost:3000
```

### Authorized Redirect URIs
```
https://trendwise-internship.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

## Environment Variables

Make sure your `.env.local` file has:

```bash
NEXTAUTH_URL=https://trendwise-internship.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-connection-string
```

## Vercel Deployment

1. **Set environment variables in Vercel**:
   - Go to your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add all the variables from your `.env.local` file

2. **Redeploy your application** after updating the environment variables

## Testing

1. **Local development**: `npm run dev` and go to `http://localhost:3000`
2. **Production**: Go to `https://trendwise-internship.vercel.app`
3. **Sign in**: Click "Sign In with Google" and test the authentication flow

## Troubleshooting

- **"Invalid OAuth client"**: Check that your redirect URIs match exactly
- **"This app isn't verified"**: This is normal for development - you can proceed by clicking "Advanced" → "Go to [app name] (unsafe)"
- **Environment variables not loading**: Make sure to redeploy after adding variables in Vercel
