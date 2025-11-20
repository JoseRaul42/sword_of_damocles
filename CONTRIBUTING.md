# Contributing to The Sword of Damocles

Thank you for your interest in contributing! This project welcomes contributions of all kinds.

## Code of Conduct

Be respectful, inclusive, and constructive. This is an educational tool focused on privacy awareness.

## How to Contribute

### Reporting Bugs

1. Check if the issue already exists
2. Use the bug report template
3. Include:
   - Browser and OS
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots if applicable

### Suggesting Features

1. Open an issue with the "enhancement" label
2. Describe:
   - The problem you're solving
   - Your proposed solution
   - Any alternatives considered
   - Implementation complexity estimate

### Code Contributions

#### Setup

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sword-of-damocles.git
   cd sword-of-damocles
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Workflow

1. **Make your changes**
2. **Follow the code style**:
   - Run `pnpm lint` to check
   - Run `pnpm format` to auto-fix
3. **Test thoroughly**:
   - Run `pnpm check` for TypeScript errors
   - Run `pnpm build` to ensure it builds
   - Test in browser (Chrome, Firefox, Safari)
4. **Commit with clear messages**:

   ```bash
   git commit -m "feat: add dark mode toggle"
   ```

   Use conventional commits:
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation
   - `style:` formatting
   - `refactor:` code restructure
   - `test:` tests
   - `chore:` maintenance

5. **Push and create a PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

#### Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: Explain what and why
- **Screenshots**: For UI changes
- **Tests**: Describe how you tested
- **Breaking Changes**: Clearly mark if any

## Project Structure

```
src/
├── lib/
│   ├── models/         # TypeScript interfaces
│   ├── viewmodels/     # Business logic (Svelte 5 runes)
│   ├── services/       # Data fetching & storage
│   └── views/          # UI components
└── routes/             # SvelteKit pages
```

### MVVM Architecture

Follow the existing pattern:

- **Models**: Pure TypeScript types, no logic
- **Services**: Stateless functions for data operations
- **ViewModels**: Reactive state with Svelte 5 runes
- **Views**: Svelte components consuming ViewModels

## Code Style

### TypeScript

- **Strict mode**: Always
- **No `any`**: Use proper types
- **Explicit returns**: For public functions
- **JSDoc comments**: For exported functions

Example:

```typescript
/**
 * Fetches user's IP address
 * @returns Promise resolving to IP string or null on error
 */
export async function fetchIp(): Promise<string | null> {
	// implementation
}
```

### Svelte 5

- **Use runes**: `$state`, `$derived`, `$props`
- **No legacy syntax**: Avoid `$:`, `export let`
- **Inline Tailwind**: Don't use `@apply`
- **TypeScript**: Always use `<script lang="ts">`

Example:

```svelte
<script lang="ts">
	interface Props {
		data: SomeType;
	}

	let { data }: Props = $props();

	const computed = $derived(data.field * 2);
</script>

<div class="flex items-center gap-4">
	{computed}
</div>
```

### Naming Conventions

- **Files**: `kebab-case.ts`, `PascalCase.svelte`
- **Variables**: `camelCase`
- **Types**: `PascalCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Private functions**: Prefix with `_`

## Testing

Currently, the project doesn't have automated tests. We welcome contributions to add:

- Unit tests (Vitest)
- Component tests (Svelte Testing Library)
- E2E tests (Playwright)

## Documentation

Update documentation for:

- New features
- API changes
- Architecture changes
- Breaking changes

Files to update:

- `README.md` - Main documentation
- `DEPLOYMENT.md` - Deployment info
- Code comments - JSDoc
- This file - If contributing guidelines change

## Feature Ideas

Good first contributions:

- [ ] Add more data points (canvas fingerprint, WebGL info)
- [ ] Export data as JSON/CSV
- [ ] Dark/light mode toggle
- [ ] Comparison feature (current vs. VPN)
- [ ] Internationalization (i18n)
- [ ] Privacy tips and recommendations
- [ ] Browser extension detector
- [ ] WebRTC leak checker
- [ ] DNS leak checker

Larger features:

- [ ] Historical data tracking
- [ ] Anonymous aggregated statistics
- [ ] Educational quiz about privacy
- [ ] Integration with Have I Been Pwned
- [ ] Browser fingerprinting resistance test

## Questions?

- Open a discussion on GitHub
- Check existing issues and PRs
- Read the [README](README.md) and [DEPLOYMENT](DEPLOYMENT.md) docs

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to digital privacy awareness! 🔒
