# Design Token Migration Guide

> **Status:** ✅ Completed  
> **Date:** 2025 Q1

## Overview

This document describes the migration from legacy `tm-*` color classes to the new design token system. This migration ensures consistency across the application and provides better maintainability.

## Migration Summary

### Before (Legacy Classes)

```css
/* Legacy color palette with tm- prefix */
tm-primary: #0b5ea7
tm-primary-hover: #094d8a
tm-accent: #48b9c7
tm-light: #f5f7fa
tm-dark: #1a1a2e
tm-secondary: #6c757d
```

### After (Design Tokens)

```css
/* Design token system with semantic naming */
primary-50: #eff6ff   /* Lightest tint */
primary-100: #dbeafe
primary-200: #bfdbfe
primary-300: #93c5fd
primary-400: #60a5fa
primary-500: #3b82f6   /* Accent color */
primary-600: #0b5ea7   /* Primary color */
primary-700: #094d8a   /* Primary hover */
primary-800: #1e40af
primary-900: #1e3a8a   /* Darkest shade */

gray-50: #f9fafb       /* Light backgrounds */
gray-500: #6b7280      /* Secondary text */
gray-900: #111827      /* Dark text/backgrounds */
```

## Color Mapping Reference

| Legacy Class       | New Design Token | Use Case                              |
| ------------------ | ---------------- | ------------------------------------- |
| `tm-primary`       | `primary-600`    | Primary brand color, buttons, links   |
| `tm-primary-hover` | `primary-700`    | Hover states for primary elements     |
| `tm-accent`        | `primary-500`    | Accent color, focus rings, highlights |
| `tm-light`         | `gray-50`        | Light backgrounds                     |
| `tm-dark`          | `gray-900`       | Dark text, dark backgrounds           |
| `tm-secondary`     | `gray-500`       | Secondary text, muted elements        |

### Opacity Variants

| Legacy Class    | New Design Token |
| --------------- | ---------------- |
| `tm-primary/5`  | `primary-50`     |
| `tm-primary/10` | `primary-50`     |
| `tm-primary/20` | `primary-100`    |
| `tm-primary/30` | `primary-600/30` |
| `tm-primary/40` | `primary-600/40` |
| `tm-primary/50` | `primary-600/50` |
| `tm-primary/70` | `primary-600/70` |

## Usage Examples

### Buttons

```tsx
// ❌ Before (Legacy)
className = "bg-tm-primary hover:bg-tm-primary-hover text-white";

// ✅ After (Design Tokens)
className = "bg-primary-600 hover:bg-primary-700 text-white";
```

### Focus States

```tsx
// ❌ Before (Legacy)
className = "focus:ring-tm-accent focus:border-tm-accent";

// ✅ After (Design Tokens)
className = "focus:ring-primary-500 focus:border-primary-500";
```

### Text Colors

```tsx
// ❌ Before (Legacy)
className = "text-tm-dark";
className = "text-tm-primary";
className = "text-tm-secondary";

// ✅ After (Design Tokens)
className = "text-gray-900";
className = "text-primary-600";
className = "text-gray-500";
```

### Background Colors

```tsx
// ❌ Before (Legacy)
className = "bg-tm-light";
className = "bg-tm-primary/10";

// ✅ After (Design Tokens)
className = "bg-gray-50";
className = "bg-primary-50";
```

### Active/Selected States

```tsx
// ❌ Before (Legacy)
className = "bg-white text-tm-primary shadow-sm";

// ✅ After (Design Tokens)
className = "bg-white text-primary-600 shadow-sm";
```

### Border Colors

```tsx
// ❌ Before (Legacy)
className = "border-tm-primary";
className = "border-tm-accent";

// ✅ After (Design Tokens)
className = "border-primary-600";
className = "border-primary-500";
```

## Files Migrated

### Core Components (`components/ui/`)

- ✅ Checkbox.tsx
- ✅ Modal.tsx
- ✅ CustomSelect.tsx
- ✅ DatePicker.tsx
- ✅ ErrorBoundary.tsx
- ✅ MaterialAllocationModal.tsx
- ✅ Tooltip.tsx
- ✅ TopLoadingBar.tsx
- ✅ PageSkeleton.tsx
- ✅ SignatureStamp.tsx
- ✅ NotificationBell.tsx
- ✅ TypeManagementModal.tsx
- ✅ ModelManagementModal.tsx
- ✅ InstallToCustomerModal.tsx
- ✅ FullPageLoader.tsx
- ✅ Letterhead.tsx
- ✅ CreatableSelect.tsx
- ✅ EmptyState.tsx
- ✅ CommandPalette.tsx

### Layout Components (`components/layout/`)

- ✅ Sidebar.tsx
- ✅ MainLayout.tsx
- ✅ FormPageLayout.tsx

### Providers (`providers/`)

- ✅ NotificationProvider.tsx

### Feature: Auth (`features/auth/`)

- ✅ LoginPage.tsx
- ✅ PermissionDeniedPage.tsx
- ✅ components/DemoAccounts.tsx

### Feature: Dashboard (`features/dashboard/`)

- ✅ DashboardPage.tsx
- ✅ components/DashboardCharts.tsx
- ✅ components/CategorySummaryWidget.tsx
- ✅ components/AssetMatrix.tsx
- ✅ components/ActionableItemsList.tsx
- ✅ components/stock/CriticalStockPanel.tsx

### Feature: Asset Registration (`features/assetRegistration/`)

- ✅ RegistrationPage.tsx
- ✅ components/BulkLabelModal.tsx
- ✅ components/RegistrationForm.tsx
- ✅ components/RegistrationFormSections.tsx

### Feature: Users (`features/users/`)

- ✅ UserFormPage.tsx
- ✅ UserDetailPage.tsx
- ✅ ManageAccountPage.tsx
- ✅ DivisionFormPage.tsx
- ✅ DivisionDetailPage.tsx
- ✅ AccountsPage.tsx
- ✅ components/UsersTable.tsx
- ✅ components/DivisionsTable.tsx
- ✅ components/PermissionManager.tsx

### Feature: Stock (`features/stock/`)

- ✅ StockOverviewPage.tsx
- ✅ components/StockTable.tsx
- ✅ components/AssetCard.tsx
- ✅ components/modals/AddProgressUpdateModal.tsx

### Feature: Requests (`features/requests/`)

- ✅ new/NewRequestDetailPage.tsx
- ✅ new/components/CommentThread.tsx
- ✅ new/components/ExportRequestModal.tsx
- ✅ new/components/RequestForm.tsx
- ✅ loan/LoanRequestPage.tsx
- ✅ loan/LoanRequestDetailPage.tsx

### Feature: Customers (`features/customers/`)

- ✅ form/CustomerForm.tsx
- ✅ detail/CustomerDetailPage.tsx
- ✅ installation/InstallationFormPage.tsx
- ✅ installation/InstallationDetailPage.tsx
- ✅ installation/components/InstallationForm.tsx
- ✅ installation/components/InstallationTable.tsx
- ✅ maintenance/MaintenanceDetailPage.tsx
- ✅ dismantle/DismantleFormPage.tsx
- ✅ dismantle/DismantleForm.tsx
- ✅ dismantle/DismantleDetailPage.tsx

### Feature: Categories (`features/categories/`)

- ✅ CategoryManagementPage.tsx

## Tailwind Configuration

The design tokens are configured in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',    // Accent
        600: '#0b5ea7',    // Primary
        700: '#094d8a',    // Primary Hover
        800: '#1e40af',
        900: '#1e3a8a',
      },
      // Semantic colors
      danger: { light: '#fef2f2', DEFAULT: '#ef4444', dark: '#b91c1c' },
      warning: { light: '#fffbeb', DEFAULT: '#f59e0b', dark: '#b45309' },
      success: { light: '#ecfdf5', DEFAULT: '#10b981', dark: '#047857' },
      info: { light: '#eff6ff', DEFAULT: '#3b82f6', dark: '#1e40af' },
    }
  }
}
```

## Best Practices for New Development

1. **Always use design tokens** - Never use legacy `tm-*` classes
2. **Semantic colors for states** - Use `danger`, `warning`, `success`, `info` for status indicators
3. **Consistent hover states** - Use `primary-700` for hover on `primary-600` elements
4. **Focus rings** - Use `primary-500` for focus rings (accent color)
5. **Text hierarchy** - Use `gray-900` for headings, `gray-500` for secondary text

## Verification

Run the following command to verify no legacy classes remain:

```bash
grep -r "tm-primary\|tm-accent\|tm-dark\|tm-secondary\|tm-light" frontend/src/
# Should return no matches
```

TypeScript check:

```bash
cd frontend && npx tsc --noEmit
# Should complete with no errors
```
