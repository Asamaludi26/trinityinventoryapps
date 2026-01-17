# Accessibility (A11y) Checklist

Panduan dan checklist aksesibilitas untuk memastikan aplikasi Trinity Asset Flow dapat digunakan oleh semua pengguna, termasuk pengguna dengan disabilitas.

---

## 1. Standar & Guidelines

### 1.1. Target Compliance

| Standard        | Level          | Status    |
| --------------- | -------------- | --------- |
| **WCAG 2.1**    | Level AA       | 🎯 Target |
| **Section 508** | Compliance     | 🎯 Target |
| **ARIA 1.2**    | Best Practices | 🎯 Target |

### 1.2. Prinsip POUR

| Prinsip            | Deskripsi                            | Contoh                       |
| ------------------ | ------------------------------------ | ---------------------------- |
| **Perceivable**    | Konten dapat dipersepsi              | Alt text, kontras warna      |
| **Operable**       | Interface dapat dioperasikan         | Keyboard navigation          |
| **Understandable** | Konten mudah dipahami                | Bahasa jelas, error messages |
| **Robust**         | Kompatibel dengan berbagai teknologi | Semantic HTML, ARIA          |

---

## 2. Semantic HTML

### 2.1. Struktur Dokumen

```tsx
// ✅ DO: Proper document structure
<>
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      {/* navigation items */}
    </nav>
  </header>

  <main role="main" id="main-content">
    <h1>Page Title</h1>
    <section aria-labelledby="section-title">
      <h2 id="section-title">Section Title</h2>
      {/* section content */}
    </section>
  </main>

  <aside role="complementary" aria-label="Sidebar">
    {/* sidebar content */}
  </aside>

  <footer role="contentinfo">{/* footer content */}</footer>
</>
```

### 2.2. Heading Hierarchy

```tsx
// ✅ DO: Proper heading hierarchy
<main>
    <h1>Asset Management</h1>           {/* One h1 per page */}

    <section>
        <h2>Active Assets</h2>          {/* Main sections */}
        <article>
            <h3>Asset Details</h3>      {/* Subsections */}
            <h4>Specifications</h4>     {/* Sub-subsections */}
        </article>
    </section>

    <section>
        <h2>Asset History</h2>
    </section>
</main>

// ❌ DON'T: Skip heading levels
<h1>Title</h1>
<h3>Skipped h2!</h3>  {/* Wrong! */}
<h5>More skipping!</h5>  {/* Wrong! */}
```

### 2.3. Form Elements

```tsx
// ✅ DO: Properly labeled forms
<form>
    <div className="form-group">
        <label htmlFor="asset-name">
            Asset Name
            <span className="required" aria-label="required">*</span>
        </label>
        <input
            id="asset-name"
            name="assetName"
            type="text"
            required
            aria-required="true"
            aria-describedby="asset-name-hint asset-name-error"
        />
        <span id="asset-name-hint" className="hint">
            Enter a unique name for the asset
        </span>
        {error && (
            <span id="asset-name-error" className="error" role="alert">
                {error}
            </span>
        )}
    </div>
</form>

// ❌ DON'T: Placeholder as label
<input placeholder="Enter name" />  {/* No visible label! */}
```

---

## 3. Keyboard Navigation

### 3.1. Focus Management

```tsx
// ✅ Focus visible styling
.focus-visible:focus {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
}

// Never remove focus outline without alternative
// ❌ DON'T
button:focus { outline: none; }

// ✅ DO
button:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}
```

### 3.2. Tab Order

```tsx
// ✅ Natural tab order
<div>
    <button>First</button>      {/* tabIndex: 0 (default) */}
    <button>Second</button>     {/* tabIndex: 0 (default) */}
    <button>Third</button>      {/* tabIndex: 0 (default) */}
</div>

// ✅ Skip to main content link
<a href="#main-content" className="skip-link">
    Skip to main content
</a>

// CSS for skip link
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px;
    z-index: 100;
}

.skip-link:focus {
    top: 0;
}
```

### 3.3. Keyboard Interactions

| Component     | Key              | Action           |
| ------------- | ---------------- | ---------------- |
| **Button**    | `Enter`, `Space` | Activate         |
| **Link**      | `Enter`          | Navigate         |
| **Checkbox**  | `Space`          | Toggle           |
| **Radio**     | `Arrow keys`     | Navigate options |
| **Select**    | `Arrow keys`     | Navigate options |
| **Modal**     | `Escape`         | Close            |
| **Menu**      | `Arrow keys`     | Navigate items   |
| **Tab Panel** | `Arrow keys`     | Switch tabs      |
| **Accordion** | `Enter`, `Space` | Toggle section   |

### 3.4. Focus Trap for Modals

```tsx
import { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;

      // Focus first focusable element
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      (focusable?.[0] as HTMLElement)?.focus();
    } else {
      // Restore focus when closing
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (e.key === "Tab") {
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable?.[0] as HTMLElement;
      const last = focusable?.[focusable.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      onKeyDown={handleKeyDown}
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
};
```

---

## 4. Color & Contrast

### 4.1. Contrast Requirements

| Text Type                        | Minimum Ratio | WCAG Level |
| -------------------------------- | ------------- | ---------- |
| Normal text (< 18px)             | 4.5:1         | AA         |
| Large text (≥ 18px bold, ≥ 24px) | 3:1           | AA         |
| UI Components & Graphics         | 3:1           | AA         |
| Enhanced (Normal text)           | 7:1           | AAA        |

### 4.2. Color Palette with Contrast Ratios

```scss
// Background: #ffffff (white)
// These colors meet WCAG AA contrast requirements

:root {
  // Text colors
  --text-primary: #111827; /* 16.54:1 on white */
  --text-secondary: #4b5563; /* 7.34:1 on white */
  --text-muted: #6b7280; /* 5.54:1 on white */

  // Status colors (on white background)
  --color-success: #166534; /* 7.23:1 ✓ */
  --color-warning: #854d0e; /* 5.92:1 ✓ */
  --color-error: #dc2626; /* 4.58:1 ✓ */
  --color-info: #1d4ed8; /* 5.67:1 ✓ */

  // Interactive elements
  --color-primary: #2563eb; /* 4.54:1 ✓ */
  --color-primary-hover: #1d4ed8; /* 5.67:1 ✓ */
}
```

### 4.3. Don't Rely on Color Alone

```tsx
// ❌ DON'T: Color-only indication
<span className="text-red-500">Error occurred</span>
<span className="text-green-500">Success</span>

// ✅ DO: Color + Icon + Text
<span className="text-red-500 flex items-center gap-2">
    <XCircleIcon aria-hidden="true" />
    <span>Error: Invalid email format</span>
</span>

<span className="text-green-500 flex items-center gap-2">
    <CheckCircleIcon aria-hidden="true" />
    <span>Success: Asset created</span>
</span>

// ✅ DO: Status badges with icons
const StatusBadge = ({ status }: { status: AssetStatus }) => {
    const config = {
        active: { icon: CheckCircle, color: 'green', label: 'Active' },
        inactive: { icon: MinusCircle, color: 'gray', label: 'Inactive' },
        maintenance: { icon: Wrench, color: 'yellow', label: 'Maintenance' },
        disposed: { icon: XCircle, color: 'red', label: 'Disposed' },
    };

    const { icon: Icon, color, label } = config[status];

    return (
        <span className={`badge badge-${color}`}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
        </span>
    );
};
```

---

## 5. ARIA Attributes

### 5.1. Common ARIA Patterns

#### Buttons

```tsx
// Icon-only button
<button aria-label="Delete asset" title="Delete">
    <TrashIcon aria-hidden="true" />
</button>

// Toggle button
<button
    aria-pressed={isExpanded}
    onClick={() => setIsExpanded(!isExpanded)}
>
    {isExpanded ? 'Collapse' : 'Expand'}
</button>

// Loading button
<button disabled={isLoading} aria-busy={isLoading}>
    {isLoading ? (
        <>
            <Spinner aria-hidden="true" />
            <span>Saving...</span>
        </>
    ) : (
        'Save'
    )}
</button>
```

#### Navigation

```tsx
// Breadcrumb
<nav aria-label="Breadcrumb">
    <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/assets">Assets</a></li>
        <li aria-current="page">Asset Details</li>
    </ol>
</nav>

// Pagination
<nav aria-label="Pagination">
    <button aria-label="Go to previous page" disabled={page === 1}>
        Previous
    </button>
    <span aria-current="page">Page {page} of {totalPages}</span>
    <button aria-label="Go to next page" disabled={page === totalPages}>
        Next
    </button>
</nav>
```

#### Tables

```tsx
<table>
  <caption>Asset Inventory List</caption>
  <thead>
    <tr>
      <th scope="col">Asset ID</th>
      <th scope="col">Name</th>
      <th scope="col">Category</th>
      <th scope="col">
        <button
          onClick={handleSort}
          aria-sort={sortDir === "asc" ? "ascending" : "descending"}
        >
          Status
          <SortIcon aria-hidden="true" />
        </button>
      </th>
      <th scope="col">
        <span className="sr-only">Actions</span>
      </th>
    </tr>
  </thead>
  <tbody>
    {assets.map((asset) => (
      <tr key={asset.id}>
        <th scope="row">{asset.id}</th>
        <td>{asset.name}</td>
        <td>{asset.category}</td>
        <td>{asset.status}</td>
        <td>
          <button aria-label={`Edit ${asset.name}`}>Edit</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

#### Live Regions

```tsx
// Toast notifications
<div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="toast"
>
    {message}
</div>

// Error alerts
<div
    role="alert"
    aria-live="assertive"
    className="error-banner"
>
    {errorMessage}
</div>

// Loading indicator
<div aria-live="polite" aria-busy={isLoading}>
    {isLoading ? 'Loading data...' : 'Data loaded'}
</div>
```

### 5.2. ARIA Roles Reference

| Role          | Use Case                          | Example               |
| ------------- | --------------------------------- | --------------------- |
| `alert`       | Important, time-sensitive message | Error notifications   |
| `alertdialog` | Alert requiring confirmation      | Delete confirmation   |
| `button`      | Clickable element (non-button)    | `<div role="button">` |
| `dialog`      | Modal or dialog box               | Modal windows         |
| `menu`        | Menu of choices                   | Dropdown menus        |
| `menuitem`    | Item in a menu                    | Menu options          |
| `progressbar` | Progress indicator                | Upload progress       |
| `search`      | Search region                     | Search form           |
| `status`      | Status message                    | "3 items selected"    |
| `tab`         | Tab in tablist                    | Tab navigation        |
| `tabpanel`    | Panel for tab                     | Tab content           |
| `tooltip`     | Tooltip content                   | Help tooltips         |

---

## 6. Form Accessibility

### 6.1. Form Validation

```tsx
const AssetForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby={
        Object.keys(errors).length > 0 ? "form-errors" : undefined
      }
      noValidate
    >
      {/* Form-level error summary */}
      {Object.keys(errors).length > 0 && (
        <div id="form-errors" role="alert" className="error-summary">
          <h2>Please fix the following errors:</h2>
          <ul>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <a href={`#${field}`}>{error}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-field">
        <label htmlFor="name">
          Asset Name <span aria-label="required">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <span id="name-error" className="error" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Asset"}
      </button>
    </form>
  );
};
```

### 6.2. Custom Form Controls

```tsx
// Custom Select/Dropdown
const CustomSelect = ({
  label,
  options,
  value,
  onChange,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen) {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
        break;
      case "Escape":
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
    }
  };

  return (
    <div className="custom-select">
      <label id="select-label">{label}</label>
      <button
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        {options.find((o) => o.value === value)?.label || "Select..."}
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-labelledby="select-label"
          aria-activedescendant={`option-${focusedIndex}`}
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`option-${index}`}
              role="option"
              aria-selected={value === option.value}
              className={focusedIndex === index ? "focused" : ""}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

---

## 7. Screen Reader Considerations

### 7.1. Hidden Content

```tsx
// Visually hidden but accessible to screen readers
<span className="sr-only">
    This text is hidden visually but read by screen readers
</span>

// CSS for sr-only
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

// Hide from screen readers only
<span aria-hidden="true">
    Decorative content, not read by screen readers
</span>
```

### 7.2. Announce Dynamic Changes

```tsx
// Announce filtered results
const AssetList = ({ assets, filter }: Props) => {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setAnnouncement(`Showing ${assets.length} assets matching "${filter}"`);
  }, [assets.length, filter]);

  return (
    <>
      {/* Live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <ul>
        {assets.map((asset) => (
          <li key={asset.id}>{asset.name}</li>
        ))}
      </ul>
    </>
  );
};
```

---

## 8. Media Accessibility

### 8.1. Images

```tsx
// Informative images
<img
    src={asset.photo}
    alt="Cisco Switch Catalyst 2960 - front panel view showing 24 ethernet ports"
/>

// Decorative images
<img src={decorativeBorder.png} alt="" role="presentation" />

// Complex images with detailed description
<figure>
    <img
        src={networkDiagram.png}
        alt="Network topology diagram"
        aria-describedby="diagram-description"
    />
    <figcaption id="diagram-description">
        Network diagram showing 3 switches connected to a central router.
        Switch A connects to the main server room, Switch B to the admin building,
        and Switch C to the warehouse.
    </figcaption>
</figure>
```

### 8.2. Icons

```tsx
// Decorative icons (with text label)
<button>
    <PlusIcon aria-hidden="true" />
    <span>Add Asset</span>
</button>

// Meaningful icons (standalone)
<button aria-label="Add new asset">
    <PlusIcon aria-hidden="true" />
</button>

// Icon with different meaning than visual
<span title="Verified" aria-label="This asset has been verified">
    <CheckIcon aria-hidden="true" />
</span>
```

---

## 9. Testing Checklist

### 9.1. Automated Testing

| Tool                       | What It Checks                     |
| -------------------------- | ---------------------------------- |
| **axe-core**               | WCAG violations, best practices    |
| **Lighthouse**             | Accessibility score, common issues |
| **eslint-plugin-jsx-a11y** | JSX accessibility issues           |
| **pa11y**                  | WCAG 2.1 compliance                |

```bash
# Install testing tools
npm install --save-dev @axe-core/react eslint-plugin-jsx-a11y

# Run accessibility audit
npx lighthouse http://localhost:3000 --only-categories=accessibility
```

### 9.2. Manual Testing Checklist

#### Keyboard Testing

- [ ] Can navigate all interactive elements with Tab
- [ ] Focus indicator visible on all elements
- [ ] Tab order is logical
- [ ] Can activate buttons with Enter/Space
- [ ] Can close modals with Escape
- [ ] Can navigate dropdowns with Arrow keys
- [ ] Skip link present and working

#### Screen Reader Testing

- [ ] Page title is announced
- [ ] Headings are properly structured
- [ ] Form labels are announced
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced
- [ ] Images have appropriate alt text
- [ ] Tables are navigable

#### Visual Testing

- [ ] Text is readable at 200% zoom
- [ ] No information lost at narrow widths
- [ ] Color contrast meets requirements
- [ ] Color is not the only indicator
- [ ] Focus indicators are visible
- [ ] Touch targets are at least 44x44px

### 9.3. Screen Reader Testing Setup

| Platform | Screen Reader | Browser         |
| -------- | ------------- | --------------- |
| Windows  | NVDA (free)   | Firefox, Chrome |
| Windows  | JAWS          | Chrome, Edge    |
| macOS    | VoiceOver     | Safari          |
| iOS      | VoiceOver     | Safari          |
| Android  | TalkBack      | Chrome          |

---

## 10. Quick Reference

### 10.1. ARIA States Quick Reference

```tsx
// Required field
aria-required="true"

// Invalid field
aria-invalid="true"

// Disabled
aria-disabled="true"  // or use disabled attribute

// Expanded/Collapsed
aria-expanded="true|false"

// Selected
aria-selected="true"

// Checked
aria-checked="true|false|mixed"

// Current item
aria-current="page|step|location|date|time|true"

// Busy/Loading
aria-busy="true"

// Hidden
aria-hidden="true"
```

### 10.2. Do's and Don'ts Summary

| ✅ DO                         | ❌ DON'T                     |
| ----------------------------- | ---------------------------- |
| Use semantic HTML             | Use `<div>` for everything   |
| Provide text alternatives     | Skip alt text                |
| Ensure keyboard access        | Require mouse only           |
| Use sufficient color contrast | Use low-contrast colors      |
| Label form inputs             | Use placeholder as label     |
| Announce dynamic changes      | Silently update content      |
| Test with real users          | Rely only on automated tools |
