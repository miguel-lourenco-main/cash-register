# Theming System

This cash register app includes a comprehensive theming system built on top of Tailwind CSS v4 and CSS variables.

## Features

- **Light/Dark/System themes** - Three theme modes with automatic system preference detection
- **Smooth transitions** - All theme changes include smooth CSS transitions
- **Theme persistence** - User theme preference is saved to localStorage
- **CSS Variables** - All colors use CSS custom properties for easy customization
- **Component theming** - All UI components are theme-aware
- **Custom scrollbars** - Themed scrollbars that adapt to light/dark modes

## Theme Provider

The app uses a React context-based theme provider located at `lib/theme-provider.tsx`:

```tsx
import { ThemeProvider } from "@/lib/theme-provider"

// Wrap your app
<ThemeProvider defaultTheme="system" storageKey="cash-register-theme">
  <App />
</ThemeProvider>
```

## Theme Toggle

A theme toggle component is available at `components/ui/theme-toggle.tsx`:

```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle"

// Use in your components
<ThemeToggle />
```

## Available Themes

### Light Mode
- Clean, bright interface
- High contrast for readability
- Optimized for daytime use

### Dark Mode  
- Easy on the eyes in low light
- Reduced eye strain
- Modern dark aesthetic

### System Mode
- Automatically follows system preference
- Updates when system theme changes
- Best user experience

## CSS Variables

All theme colors are defined as CSS custom properties in `app/globals.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... more variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  /* ... more variables */
}
```

## Theme-Aware Components

### Loading Spinner
```tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner"

<LoadingSpinner 
  size="md"
  text="Loading..."
  description="Please wait"
/>
```

### Error Display
```tsx
import { ErrorDisplay } from "@/components/ui/error-display"

<ErrorDisplay 
  title="Something went wrong"
  message="Try again later"
  onRetry={handleRetry}
/>
```

### Status Indicator
```tsx
import { StatusIndicator } from "@/components/ui/status-indicator"

<StatusIndicator status="success" size="md" />
```

### Badge
```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="success">Completed</Badge>
```

## Customization

### Adding New Theme Colors

1. Add the color to CSS variables in `app/globals.css`:
```css
:root {
  --custom-color: oklch(0.5 0.1 180);
}

.dark {
  --custom-color: oklch(0.7 0.1 180);
}
```

2. Add to Tailwind config if needed:
```css
@theme inline {
  --color-custom: var(--custom-color);
}
```

### Creating Theme-Aware Components

Use the `cn` utility and theme variables:

```tsx
import { cn } from "@/lib/utils"

export function MyComponent({ className, ...props }) {
  return (
    <div 
      className={cn(
        "bg-background text-foreground border-border",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors duration-200",
        className
      )}
      {...props}
    />
  )
}
```

## Theme Configuration

Theme settings are centralized in `lib/theme-config.ts`:

```tsx
export const themeConfig = {
  storageKey: "cash-register-theme",
  defaultTheme: "system",
  themes: [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "system", label: "System", icon: "💻" },
  ],
}
```

## Best Practices

1. **Always use theme variables** - Use `bg-background` instead of `bg-white`
2. **Include transitions** - Add `transition-colors` for smooth theme changes
3. **Test both themes** - Ensure components work in light and dark modes
4. **Use semantic colors** - Prefer `text-foreground` over `text-black`
5. **Consider contrast** - Ensure sufficient contrast in both themes

## Browser Support

- Modern browsers with CSS custom properties support
- Automatic fallbacks for older browsers
- Progressive enhancement approach
