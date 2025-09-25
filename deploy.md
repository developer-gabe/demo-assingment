# Deployment Guide

## Quick Deploy to Vercel

### Prerequisites
- Node.js 18.18.0+ (current system has 18.13.0 - needs upgrade)
- OpenAI API key
- Vercel account

### Steps

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Set Environment Variables**
   Create `.env.local`:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Production Environment Variables**
   In Vercel dashboard, add:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`

## Alternative: Manual Deployment

### Using Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Using Railway
```bash
# Connect GitHub repo to Railway
# Add environment variables in Railway dashboard
# Deploy automatically on git push
```

## Environment Variables Reference

```bash
# Required
OPENAI_API_KEY=sk-...

# Optional CMS Configuration
CMS_PROVIDER=local
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTSTACK_API_KEY=
CONTENTSTACK_DELIVERY_TOKEN=

# Optional Caching (Production)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Optional Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
SEGMENT_WRITE_KEY=
```

## Testing the Deployment

1. Visit the deployed URL
2. Try the AI assistant with these questions:
   - "What does Drata do?"
   - "How does automated evidence collection work?"
   - "What frameworks does Drata support?"
3. Verify citations and follow-ups work
4. Test CTA buttons
5. Check mobile responsiveness
6. Verify accessibility with screen reader

## Performance Checklist

- [ ] Response times < 2s
- [ ] Bundle size < 500KB
- [ ] Lighthouse score > 90
- [ ] Accessibility compliance
- [ ] Mobile responsiveness
- [ ] Error handling works

## Troubleshooting

### Common Issues

**Build fails with Node version error:**
```bash
# Upgrade Node.js to 18.18.0+
nvm install 20
nvm use 20
```

**API calls fail:**
```bash
# Check environment variables
vercel env ls
# Add missing OPENAI_API_KEY
vercel env add OPENAI_API_KEY
```

**Assistant doesn't load:**
- Check browser console for errors
- Verify CMS config is valid JSON
- Check API route is accessible at `/api/assistant`

### Debug Mode

Add to `.env.local`:
```bash
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

This enables:
- Console logging for analytics events
- Detailed error messages
- Performance timing logs
