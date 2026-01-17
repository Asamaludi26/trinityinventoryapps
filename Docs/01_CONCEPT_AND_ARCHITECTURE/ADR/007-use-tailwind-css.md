# ADR 007: Tailwind CSS sebagai Styling Framework

- **Status**: Diterima
- **Tanggal**: 2025-10-10

## Konteks

Aplikasi Trinity Asset Flow membutuhkan solusi styling yang:

- Konsisten di seluruh aplikasi
- Mudah di-maintain dan di-scale
- Developer-friendly dengan learning curve yang reasonable
- Performa yang baik (bundle size optimal)
- Mendukung responsive design dan dark mode

Alternatif yang dipertimbangkan:

1. **CSS Modules**: Scoped CSS per component
2. **Styled Components / Emotion**: CSS-in-JS solutions
3. **Tailwind CSS**: Utility-first CSS framework
4. **SCSS/Sass**: CSS preprocessor dengan variables dan mixins
5. **Chakra UI / MUI**: Complete component libraries

## Keputusan

Kami memutuskan untuk menggunakan **Tailwind CSS** sebagai primary styling solution.

## Konsekuensi

### Keuntungan (Positif)

- **Utility-First Approach**: Styling langsung di component tanpa context switching ke file CSS terpisah:

```tsx
<button
  className="px-4 py-2 bg-blue-600 text-white rounded-lg 
    hover:bg-blue-700 transition-colors duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed"
>
  Submit
</button>
```

- **Consistency via Design Tokens**: Tailwind config menjadi single source of truth untuk design system:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        // All brand colors defined here
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};
```

- **Small Bundle Size**: PurgeCSS built-in removes unused styles. Production CSS typically <10KB gzipped.

- **Responsive Design**: Mobile-first breakpoints dengan prefix yang intuitif:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

- **Dark Mode Support**: Built-in dark mode dengan `dark:` prefix:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

- **Rapid Development**: Tidak perlu naming CSS classes atau maintain stylesheet terpisah.

### Kerugian (Negatif)

- **Long Class Names**: Class strings bisa menjadi panjang dan sulit dibaca.

  **Mitigasi**:
  - Extract components untuk patterns yang berulang
  - Gunakan `clsx` atau `cn` utility untuk conditional classes
  - Define reusable components di design system

```tsx
// components/ui/Button.tsx
const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export const Button = ({ variant = "primary", className, ...props }) => (
  <button
    className={cn(
      "px-4 py-2 rounded-lg transition-colors",
      variants[variant],
      className,
    )}
    {...props}
  />
);
```

- **Learning Curve**: Developer perlu mempelajari class names Tailwind.

  **Mitigasi**:
  - Tailwind IntelliSense VS Code extension
  - CheatSheet dan dokumentasi yang excellent

- **Design Constraints**: Menggunakan value arbitrary memerlukan bracket syntax `[16px]`.

  **Mitigasi**: Extend theme config untuk design tokens yang sering digunakan.

- **HTML Pollution**: Banyak classes di HTML/JSX.

  **Mitigasi**: Ini adalah trade-off. Locality of styles memudahkan maintenance.

## Integration Setup

### Installation

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

### Entry CSS

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg 
               hover:bg-blue-700 transition-colors;
  }
}
```

## Utility Patterns

### Class Merging Utility

```typescript
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
    'base-styles',
    isActive && 'active-styles',
    className // Allow override
)} />
```

### Variant-based Components

```typescript
// Using class-variance-authority (cva)
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  // ... other props
}
```

## Referensi

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DESIGN_SYSTEM.md](../../03_STANDARDS_AND_PROCEDURES/DESIGN_SYSTEM.md)
- [DESIGN_TOKENS.md](../../03_STANDARDS_AND_PROCEDURES/DESIGN_TOKENS.md)
