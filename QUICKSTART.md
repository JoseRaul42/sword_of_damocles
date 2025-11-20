# Quick Start Guide

Get up and running in under 5 minutes!

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **pnpm** ([install](https://pnpm.io/installation))

```bash
# Install pnpm globally
npm install -g pnpm
```

## Local Development

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### 3. Make Changes

Edit files in `src/` and see live updates:

- **Pages**: `src/routes/+page.svelte`
- **Components**: `src/lib/views/`
- **Logic**: `src/lib/viewmodels/`
- **Styles**: Use Tailwind classes inline

### 4. Build for Production

```bash
pnpm build
```

Preview the build:

```bash
pnpm preview
```

## Deploy to Vercel (1-Click)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Click "Deploy" (zero config needed!)

**That's it!** Your app is live in 1-2 minutes.

## Project Structure (Simplified)

```
src/
├── lib/
│   ├── models/         → Data types (TypeScript interfaces)
│   ├── services/       → API calls & localStorage
│   ├── viewmodels/     → Business logic (Svelte 5 runes)
│   └── views/          → UI components (Svelte)
└── routes/
    └── +page.svelte    → Main page
```

## Common Tasks

### Add a New Data Point

1. **Update the model** (`src/lib/models/*.ts`)
2. **Update the service** (`src/lib/services/*.ts`)
3. **Update the view** (`src/lib/views/*Card.svelte`)

That's it! The ViewModel handles the rest.

### Change the Design

Edit Tailwind classes in components:

- Colors: `text-orange-600` → `text-blue-600`
- Spacing: `px-6` → `px-8`
- Sizes: `text-lg` → `text-xl`

All components are in `src/lib/views/`.

### Add a New Page

1. Create `src/routes/about/+page.svelte`
2. Add content
3. Link to it: `<a href="/about">About</a>`

SvelteKit handles routing automatically!

### Use a Different IP API

Edit `src/lib/services/ipGeoService.ts`:

```typescript
// Change the API endpoint
const response = await fetch('https://your-api.com/endpoint');
```

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm check            # TypeScript type checking
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier

# Deployment
vercel                # Deploy to Vercel (one-time)
vercel --prod         # Deploy to production
```

## Troubleshooting

### "Cannot find module"

```bash
pnpm install
```

### "Port 5173 already in use"

```bash
pnpm dev --port 3000
```

### Build fails

```bash
# Clear cache and rebuild
rm -rf .svelte-kit node_modules
pnpm install
pnpm build
```

### TypeScript errors

```bash
pnpm check
```

Fix reported errors in your IDE.

## Learn More

- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Full Docs**: See [README.md](README.md)

## Need Help?

- Check the [README](README.md) for detailed info
- Open an issue on GitHub
- Read [SvelteKit docs](https://kit.svelte.dev)
- Read [Svelte 5 docs](https://svelte.dev/docs)

## What's Next?

- [ ] Customize the design
- [ ] Add more data points
- [ ] Deploy to Vercel
- [ ] Add analytics
- [ ] Share with friends!

---

**Happy coding!** 🚀
