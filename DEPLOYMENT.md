# Deployment Guide

## Vercel Deployment (Recommended)

This app is optimized for Vercel deployment with zero configuration required.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

### Manual Deployment Steps

1. **Install Vercel CLI** (optional):

   ```bash
   npm i -g vercel
   ```

2. **Connect your repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect SvelteKit

3. **Configure (if needed)**:
   - **Build Command**: `pnpm build` (auto-detected)
   - **Output Directory**: `.svelte-kit/output` (auto-detected)
   - **Install Command**: `pnpm install` (auto-detected)
   - **Framework Preset**: SvelteKit (auto-detected)

4. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app is live!

### Environment Variables (Optional)

If you want to use a custom IP geolocation API:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `PUBLIC_IP_API_URL`: Your API endpoint
   - `PUBLIC_IP_API_KEY`: Your API key

Note: The app works out-of-the-box with ipapi.co (1000 free requests/day, no key required).

### Custom Domain

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Alternative Platforms

### Netlify

1. Connect your repository
2. Build command: `pnpm build`
3. Publish directory: `.svelte-kit/output`
4. Install command: `pnpm install`

### Cloudflare Pages

1. Connect your repository
2. Build command: `pnpm build`
3. Build output directory: `.svelte-kit/output`
4. Framework preset: SvelteKit

### Static Hosting (GitHub Pages, Netlify, etc.)

If you want fully static hosting without any server-side rendering:

1. Update `src/routes/+page.ts`:

   ```typescript
   export const ssr = false;
   export const prerender = true;
   ```

2. Update `svelte.config.js`:

   ```javascript
   import adapter from '@sveltejs/adapter-static';

   export default {
   	kit: {
   		adapter: adapter({
   			pages: 'build',
   			assets: 'build',
   			fallback: 'index.html'
   		})
   	}
   };
   ```

3. Build:

   ```bash
   pnpm build
   ```

4. Deploy the `build/` directory

## Post-Deployment Checklist

- [ ] Test IP geolocation functionality
- [ ] Verify localStorage persistence
- [ ] Test "Clear My Data" button
- [ ] Check mobile responsiveness
- [ ] Verify all cards display correctly
- [ ] Test error handling (disconnect internet temporarily)
- [ ] Check browser console for errors
- [ ] Verify HTTPS is working
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)

## Monitoring & Analytics

### Vercel Analytics (Recommended)

1. Go to your Vercel project
2. Navigate to "Analytics"
3. Enable Vercel Analytics
4. Install the package:
   ```bash
   pnpm add @vercel/analytics
   ```
5. Add to `src/routes/+layout.svelte`:
   ```svelte
   <script>
   	import { inject } from '@vercel/analytics';
   	inject();
   </script>
   ```

### Performance Monitoring

Vercel provides built-in:

- Core Web Vitals tracking
- Edge function metrics
- Bandwidth usage
- Request logs

## Security Considerations

### Content Security Policy (CSP)

Add to `svelte.config.js`:

```javascript
export default {
	kit: {
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'unsafe-inline'],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https:'],
				'connect-src': ['self', 'https://ipapi.co']
			}
		}
	}
};
```

### HTTPS

Vercel automatically provides HTTPS for all deployments.

## Troubleshooting

### Build Fails

**Issue**: "Cannot find module" errors

- **Solution**: Run `pnpm install` locally and commit `pnpm-lock.yaml`

**Issue**: Tailwind CSS errors

- **Solution**: Ensure Tailwind v4 is properly configured in `vite.config.ts`

### Runtime Issues

**Issue**: IP geolocation not working

- **Solution**: Check browser console for CORS errors. The ipapi.co API should work, but rate limits might apply.

**Issue**: LocalStorage not persisting

- **Solution**: Ensure the app is served over HTTPS. Many browsers restrict localStorage on non-HTTPS sites.

**Issue**: "navigator is not defined" errors

- **Solution**: Ensure `export const ssr = false;` is set in `src/routes/+page.ts`

### Performance Issues

**Issue**: Slow initial load

- **Solution**: Check Vercel Analytics for bottlenecks. The app is lightweight, but API calls might be slow in certain regions.

**Issue**: API rate limiting

- **Solution**: Consider using a paid IP geolocation service with higher rate limits.

## Scaling

This app is designed to be stateless and scales automatically on Vercel:

- **Edge Network**: Deployed globally
- **No Database**: No scaling concerns
- **Client-Side Heavy**: Minimal server load
- **API Calls**: Only to external IP geolocation service

Expected performance:

- **Initial Load**: < 1s (global edge)
- **API Call**: 200-500ms (depending on region)
- **Total Time to Interactive**: < 2s

## Cost Estimation

### Vercel Free Tier

- **Bandwidth**: 100 GB/month
- **Invocations**: Unlimited
- **Build Minutes**: 6,000/month
- **Projects**: Unlimited

With typical usage (10,000 visitors/month):

- **Bandwidth**: ~5 GB
- **Cost**: $0 (well within free tier)

### Paid Plans

Only needed if you exceed:

- 100 GB bandwidth/month (~200,000 visitors)
- Custom domains (included in free tier)
- Team collaboration (free for solo)

## Maintenance

### Regular Updates

Update dependencies monthly:

```bash
pnpm update
pnpm audit
pnpm build
pnpm preview
```

### Monitoring

Check Vercel dashboard weekly for:

- Error rates
- Response times
- Bandwidth usage
- Failed builds

---

**Need Help?** Open an issue on GitHub or check the [main README](README.md).
