# Design Tokens

Dokumentasi design tokens untuk Trinity Asset Flow - variabel desain yang konsisten di seluruh aplikasi.

---

## 1. Overview

Design tokens adalah primitive values yang menjadi fondasi visual design system. Tokens ini digunakan untuk memastikan konsistensi warna, tipografi, spacing, dan elemen visual lainnya.

### Struktur Token Naming

```
--{category}-{property}-{variant}-{state}

Contoh:
--color-primary-500
--color-primary-500-hover
--spacing-md
--font-size-lg
```

---

## 2. Color Tokens

### 2.1. Primary Colors (Brand)

| Token                 | Value     | Preview                                              | Usage             |
| --------------------- | --------- | ---------------------------------------------------- | ----------------- |
| `--color-primary-50`  | `#eff6ff` | ![#eff6ff](https://placehold.co/24x24/eff6ff/eff6ff) | Background subtle |
| `--color-primary-100` | `#dbeafe` | ![#dbeafe](https://placehold.co/24x24/dbeafe/dbeafe) | Background light  |
| `--color-primary-200` | `#bfdbfe` | ![#bfdbfe](https://placehold.co/24x24/bfdbfe/bfdbfe) | Border light      |
| `--color-primary-300` | `#93c5fd` | ![#93c5fd](https://placehold.co/24x24/93c5fd/93c5fd) | Border            |
| `--color-primary-400` | `#60a5fa` | ![#60a5fa](https://placehold.co/24x24/60a5fa/60a5fa) | Icon secondary    |
| `--color-primary-500` | `#3b82f6` | ![#3b82f6](https://placehold.co/24x24/3b82f6/3b82f6) | Primary default   |
| `--color-primary-600` | `#2563eb` | ![#2563eb](https://placehold.co/24x24/2563eb/2563eb) | Primary hover     |
| `--color-primary-700` | `#1d4ed8` | ![#1d4ed8](https://placehold.co/24x24/1d4ed8/1d4ed8) | Primary active    |
| `--color-primary-800` | `#1e40af` | ![#1e40af](https://placehold.co/24x24/1e40af/1e40af) | Text on light     |
| `--color-primary-900` | `#1e3a8a` | ![#1e3a8a](https://placehold.co/24x24/1e3a8a/1e3a8a) | Text emphasis     |

### 2.2. Neutral Colors (Gray Scale)

| Token              | Value     | Usage            |
| ------------------ | --------- | ---------------- |
| `--color-gray-50`  | `#f9fafb` | Page background  |
| `--color-gray-100` | `#f3f4f6` | Card background  |
| `--color-gray-200` | `#e5e7eb` | Border light     |
| `--color-gray-300` | `#d1d5db` | Border default   |
| `--color-gray-400` | `#9ca3af` | Placeholder text |
| `--color-gray-500` | `#6b7280` | Secondary text   |
| `--color-gray-600` | `#4b5563` | Body text        |
| `--color-gray-700` | `#374151` | Heading text     |
| `--color-gray-800` | `#1f2937` | Primary text     |
| `--color-gray-900` | `#111827` | Emphasis text    |

### 2.3. Semantic Colors

#### Success (Green)

| Token                 | Value     | Usage            |
| --------------------- | --------- | ---------------- |
| `--color-success-50`  | `#f0fdf4` | Success bg light |
| `--color-success-100` | `#dcfce7` | Success bg       |
| `--color-success-500` | `#22c55e` | Success default  |
| `--color-success-600` | `#16a34a` | Success text     |
| `--color-success-700` | `#15803d` | Success emphasis |

#### Warning (Amber/Yellow)

| Token                 | Value     | Usage            |
| --------------------- | --------- | ---------------- |
| `--color-warning-50`  | `#fffbeb` | Warning bg light |
| `--color-warning-100` | `#fef3c7` | Warning bg       |
| `--color-warning-500` | `#f59e0b` | Warning default  |
| `--color-warning-600` | `#d97706` | Warning text     |
| `--color-warning-700` | `#b45309` | Warning emphasis |

#### Error (Red)

| Token               | Value     | Usage          |
| ------------------- | --------- | -------------- |
| `--color-error-50`  | `#fef2f2` | Error bg light |
| `--color-error-100` | `#fee2e2` | Error bg       |
| `--color-error-500` | `#ef4444` | Error default  |
| `--color-error-600` | `#dc2626` | Error text     |
| `--color-error-700` | `#b91c1c` | Error emphasis |

#### Info (Blue)

| Token              | Value     | Usage         |
| ------------------ | --------- | ------------- |
| `--color-info-50`  | `#eff6ff` | Info bg light |
| `--color-info-100` | `#dbeafe` | Info bg       |
| `--color-info-500` | `#3b82f6` | Info default  |
| `--color-info-600` | `#2563eb` | Info text     |

### 2.4. Status Colors (Application-Specific)

| Status      | Color Token          | Hex       | Tailwind Class     |
| ----------- | -------------------- | --------- | ------------------ |
| Active      | `--status-active`    | `#22c55e` | `text-green-500`   |
| Inactive    | `--status-inactive`  | `#6b7280` | `text-gray-500`    |
| Pending     | `--status-pending`   | `#f59e0b` | `text-amber-500`   |
| Approved    | `--status-approved`  | `#3b82f6` | `text-blue-500`    |
| Rejected    | `--status-rejected`  | `#ef4444` | `text-red-500`     |
| In Progress | `--status-progress`  | `#8b5cf6` | `text-violet-500`  |
| Completed   | `--status-completed` | `#10b981` | `text-emerald-500` |
| Cancelled   | `--status-cancelled` | `#9ca3af` | `text-gray-400`    |

---

## 3. Typography Tokens

### 3.1. Font Family

```css
--font-family-sans: "Inter", system-ui, -apple-system, sans-serif;
--font-family-mono: "JetBrains Mono", "Fira Code", monospace;
```

### 3.2. Font Size

| Token              | Value             | Tailwind    | Usage            |
| ------------------ | ----------------- | ----------- | ---------------- |
| `--font-size-xs`   | `0.75rem` (12px)  | `text-xs`   | Captions, labels |
| `--font-size-sm`   | `0.875rem` (14px) | `text-sm`   | Secondary text   |
| `--font-size-base` | `1rem` (16px)     | `text-base` | Body text        |
| `--font-size-lg`   | `1.125rem` (18px) | `text-lg`   | Large body       |
| `--font-size-xl`   | `1.25rem` (20px)  | `text-xl`   | Subheading       |
| `--font-size-2xl`  | `1.5rem` (24px)   | `text-2xl`  | Heading 3        |
| `--font-size-3xl`  | `1.875rem` (30px) | `text-3xl`  | Heading 2        |
| `--font-size-4xl`  | `2.25rem` (36px)  | `text-4xl`  | Heading 1        |

### 3.3. Font Weight

| Token                    | Value | Tailwind        | Usage            |
| ------------------------ | ----- | --------------- | ---------------- |
| `--font-weight-normal`   | `400` | `font-normal`   | Body text        |
| `--font-weight-medium`   | `500` | `font-medium`   | Labels, emphasis |
| `--font-weight-semibold` | `600` | `font-semibold` | Subheadings      |
| `--font-weight-bold`     | `700` | `font-bold`     | Headings         |

### 3.4. Line Height

| Token                   | Value   | Tailwind          | Usage            |
| ----------------------- | ------- | ----------------- | ---------------- |
| `--line-height-none`    | `1`     | `leading-none`    | Display text     |
| `--line-height-tight`   | `1.25`  | `leading-tight`   | Headings         |
| `--line-height-snug`    | `1.375` | `leading-snug`    | Compact text     |
| `--line-height-normal`  | `1.5`   | `leading-normal`  | Body text        |
| `--line-height-relaxed` | `1.625` | `leading-relaxed` | Readable content |
| `--line-height-loose`   | `2`     | `leading-loose`   | Spacious text    |

---

## 4. Spacing Tokens

### 4.1. Base Spacing Scale

| Token           | Value            | Tailwind | Usage    |
| --------------- | ---------------- | -------- | -------- |
| `--spacing-0`   | `0`              | `0`      | None     |
| `--spacing-px`  | `1px`            | `px`     | Hairline |
| `--spacing-0.5` | `0.125rem` (2px) | `0.5`    | Micro    |
| `--spacing-1`   | `0.25rem` (4px)  | `1`      | XXS      |
| `--spacing-1.5` | `0.375rem` (6px) | `1.5`    | XS       |
| `--spacing-2`   | `0.5rem` (8px)   | `2`      | SM       |
| `--spacing-3`   | `0.75rem` (12px) | `3`      | MD       |
| `--spacing-4`   | `1rem` (16px)    | `4`      | Default  |
| `--spacing-5`   | `1.25rem` (20px) | `5`      | LG       |
| `--spacing-6`   | `1.5rem` (24px)  | `6`      | XL       |
| `--spacing-8`   | `2rem` (32px)    | `8`      | 2XL      |
| `--spacing-10`  | `2.5rem` (40px)  | `10`     | 3XL      |
| `--spacing-12`  | `3rem` (48px)    | `12`     | 4XL      |
| `--spacing-16`  | `4rem` (64px)    | `16`     | 5XL      |
| `--spacing-20`  | `5rem` (80px)    | `20`     | 6XL      |
| `--spacing-24`  | `6rem` (96px)    | `24`     | 7XL      |

### 4.2. Component-Specific Spacing

| Token                        | Value            | Usage                 |
| ---------------------------- | ---------------- | --------------------- |
| `--spacing-card-padding`     | `1.5rem` (24px)  | Card internal padding |
| `--spacing-modal-padding`    | `1.5rem` (24px)  | Modal content padding |
| `--spacing-section-gap`      | `2rem` (32px)    | Between sections      |
| `--spacing-form-gap`         | `1rem` (16px)    | Between form fields   |
| `--spacing-button-padding-x` | `1rem` (16px)    | Button horizontal     |
| `--spacing-button-padding-y` | `0.5rem` (8px)   | Button vertical       |
| `--spacing-input-padding-x`  | `0.75rem` (12px) | Input horizontal      |
| `--spacing-input-padding-y`  | `0.5rem` (8px)   | Input vertical        |

---

## 5. Size Tokens

### 5.1. Border Radius

| Token              | Value            | Tailwind       | Usage          |
| ------------------ | ---------------- | -------------- | -------------- |
| `--radius-none`    | `0`              | `rounded-none` | No rounding    |
| `--radius-sm`      | `0.125rem` (2px) | `rounded-sm`   | Subtle         |
| `--radius-default` | `0.25rem` (4px)  | `rounded`      | Default        |
| `--radius-md`      | `0.375rem` (6px) | `rounded-md`   | Medium         |
| `--radius-lg`      | `0.5rem` (8px)   | `rounded-lg`   | Large          |
| `--radius-xl`      | `0.75rem` (12px) | `rounded-xl`   | Extra large    |
| `--radius-2xl`     | `1rem` (16px)    | `rounded-2xl`  | Cards          |
| `--radius-full`    | `9999px`         | `rounded-full` | Pills, avatars |

### 5.2. Border Width

| Token              | Value | Tailwind   | Usage     |
| ------------------ | ----- | ---------- | --------- |
| `--border-0`       | `0`   | `border-0` | No border |
| `--border-default` | `1px` | `border`   | Default   |
| `--border-2`       | `2px` | `border-2` | Emphasis  |
| `--border-4`       | `4px` | `border-4` | Strong    |

### 5.3. Component Sizes

| Token                      | Value    | Usage             |
| -------------------------- | -------- | ----------------- |
| `--size-sidebar-width`     | `280px`  | Sidebar width     |
| `--size-sidebar-collapsed` | `64px`   | Collapsed sidebar |
| `--size-header-height`     | `64px`   | Header height     |
| `--size-modal-sm`          | `400px`  | Small modal       |
| `--size-modal-md`          | `560px`  | Medium modal      |
| `--size-modal-lg`          | `800px`  | Large modal       |
| `--size-modal-xl`          | `1024px` | Extra large modal |
| `--size-avatar-sm`         | `32px`   | Small avatar      |
| `--size-avatar-md`         | `40px`   | Medium avatar     |
| `--size-avatar-lg`         | `48px`   | Large avatar      |
| `--size-icon-sm`           | `16px`   | Small icon        |
| `--size-icon-md`           | `20px`   | Medium icon       |
| `--size-icon-lg`           | `24px`   | Large icon        |

---

## 6. Shadow Tokens

| Token              | Value                              | Tailwind       | Usage     |
| ------------------ | ---------------------------------- | -------------- | --------- |
| `--shadow-sm`      | `0 1px 2px rgba(0,0,0,0.05)`       | `shadow-sm`    | Subtle    |
| `--shadow-default` | `0 1px 3px rgba(0,0,0,0.1)`        | `shadow`       | Default   |
| `--shadow-md`      | `0 4px 6px rgba(0,0,0,0.1)`        | `shadow-md`    | Cards     |
| `--shadow-lg`      | `0 10px 15px rgba(0,0,0,0.1)`      | `shadow-lg`    | Dropdowns |
| `--shadow-xl`      | `0 20px 25px rgba(0,0,0,0.1)`      | `shadow-xl`    | Modals    |
| `--shadow-2xl`     | `0 25px 50px rgba(0,0,0,0.25)`     | `shadow-2xl`   | Overlays  |
| `--shadow-inner`   | `inset 0 2px 4px rgba(0,0,0,0.05)` | `shadow-inner` | Inset     |

---

## 7. Z-Index Tokens

| Token         | Value  | Tailwind | Usage               |
| ------------- | ------ | -------- | ------------------- |
| `--z-auto`    | `auto` | `z-auto` | Default             |
| `--z-0`       | `0`    | `z-0`    | Base layer          |
| `--z-10`      | `10`   | `z-10`   | Slightly elevated   |
| `--z-20`      | `20`   | `z-20`   | Dropdowns           |
| `--z-30`      | `30`   | `z-30`   | Fixed elements      |
| `--z-40`      | `40`   | `z-40`   | Sticky header       |
| `--z-50`      | `50`   | `z-50`   | Modal backdrop      |
| `--z-modal`   | `100`  | -        | Modal content       |
| `--z-popover` | `200`  | -        | Popovers            |
| `--z-tooltip` | `300`  | -        | Tooltips            |
| `--z-toast`   | `400`  | -        | Toast notifications |

---

## 8. Animation Tokens

### 8.1. Duration

| Token             | Value    | Usage     |
| ----------------- | -------- | --------- |
| `--duration-75`   | `75ms`   | Instant   |
| `--duration-100`  | `100ms`  | Fast      |
| `--duration-150`  | `150ms`  | Quick     |
| `--duration-200`  | `200ms`  | Default   |
| `--duration-300`  | `300ms`  | Smooth    |
| `--duration-500`  | `500ms`  | Slow      |
| `--duration-700`  | `700ms`  | Very slow |
| `--duration-1000` | `1000ms` | Dramatic  |

### 8.2. Easing

| Token           | Value                          | Usage          |
| --------------- | ------------------------------ | -------------- |
| `--ease-linear` | `linear`                       | Constant speed |
| `--ease-in`     | `cubic-bezier(0.4, 0, 1, 1)`   | Accelerating   |
| `--ease-out`    | `cubic-bezier(0, 0, 0.2, 1)`   | Decelerating   |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default        |

---

## 9. Breakpoint Tokens

| Token              | Value    | Usage            |
| ------------------ | -------- | ---------------- |
| `--breakpoint-sm`  | `640px`  | Mobile landscape |
| `--breakpoint-md`  | `768px`  | Tablet portrait  |
| `--breakpoint-lg`  | `1024px` | Tablet landscape |
| `--breakpoint-xl`  | `1280px` | Desktop          |
| `--breakpoint-2xl` | `1536px` | Large desktop    |

---

## 10. Tailwind Config

### Complete Token Implementation

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        sidebar: "280px",
        "sidebar-collapsed": "64px",
        header: "64px",
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        modal: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      zIndex: {
        modal: 100,
        popover: 200,
        tooltip: 300,
        toast: 400,
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

---

## 11. Usage Examples

### Component with Tokens

```tsx
// Button component using design tokens
const Button = ({ variant, size, children }) => {
  const baseStyles = `
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
    `;

  const variants = {
    primary: `
            bg-primary-600 text-white
            hover:bg-primary-700 
            focus:ring-primary-500
        `,
    secondary: `
            bg-gray-100 text-gray-700
            hover:bg-gray-200
            focus:ring-gray-500
        `,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size])}>
      {children}
    </button>
  );
};
```
