# PrimeHealth Design System

> This is the single source of truth for all visual design in PrimeHealth.
> Every UI component, frontend page, and CSS class must use the tokens defined here.
> Read `claude/skills/frontend-design/SKILL.md` for the complete implementation guide.

---

## Color Palette

### Brand Theme (Healthcare Dark Mode)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#060f1e` | Page background |
| `--color-bg-elevated` | `#0d1a2e` | Cards, modals, panels |
| `--color-surface` | `rgba(255,255,255,0.04)` | Glass card backgrounds |
| `--color-primary` | `#1e6fd9` | Primary CTA, booking buttons |
| `--color-primary-hover` | `#2980e8` | Primary button hover |
| `--color-secondary` | `#0ea5a0` | Secondary actions, tags |
| `--color-accent` | `#38bdf8` | Links, highlights, focus rings |
| `--color-success` | `#22c55e` | Confirmed, paid, success |
| `--color-warning` | `#f59e0b` | Pending, queue status |
| `--color-error` | `#ef4444` | Errors, cancelled, failed |
| `--color-refunded` | `#a78bfa` | Refunded payment status |
| `--color-text` | `#f0f4f8` | Primary text |
| `--color-text-secondary` | `rgba(240,244,248,0.7)` | Secondary, subtitles |
| `--color-text-muted` | `rgba(240,244,248,0.4)` | Placeholders, timestamps |
| `--color-border` | `rgba(255,255,255,0.08)` | Dividers, card borders |
| `--color-border-focus` | `rgba(56,189,248,0.5)` | Input focus state |

### Gradient Tokens

```css
--gradient-primary: linear-gradient(135deg, #1e6fd9 0%, #0ea5a0 100%);
--gradient-hero: linear-gradient(160deg, #060f1e 0%, #0d1a2e 40%, #0f2540 100%);
--gradient-card: linear-gradient(145deg, rgba(30,111,217,0.1) 0%, rgba(14,165,160,0.05) 100%);
--gradient-success: linear-gradient(135deg, #22c55e 0%, #0ea5a0 100%);
--gradient-error: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
```

---

## Status Badge Colors

Map appointment and payment statuses to visual treatments:

| Status (appointment) | Color Token | Background |
|---------------------|-------------|------------|
| `PENDING` | `--color-warning` | `rgba(245,158,11,0.15)` |
| `CONFIRMED` | `--color-success` | `rgba(34,197,94,0.15)` |
| `CANCELLED` | `--color-error` | `rgba(239,68,68,0.15)` |
| `COMPLETED` | `--color-accent` | `rgba(56,189,248,0.15)` |

| Status (payment) | Color Token | Background |
|-----------------|-------------|------------|
| `PENDING` | `--color-warning` | `rgba(245,158,11,0.15)` |
| `SUCCESS` | `--color-success` | `rgba(34,197,94,0.15)` |
| `FAILED` | `--color-error` | `rgba(239,68,68,0.15)` |
| `REFUNDED` | `--color-refunded` | `rgba(167,139,250,0.15)` |

---

## Typography

### Font Stack

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
```

### Type Scale

| Level | `font-size` (clamp) | Weight | Line-height |
|-------|---------------------|--------|-------------|
| Hero | `clamp(2.25rem, 5vw, 4rem)` | 800 | 1.1 |
| H1 | `clamp(1.75rem, 4vw, 3rem)` | 700 | 1.2 |
| H2 | `clamp(1.375rem, 3vw, 2.25rem)` | 600 | 1.3 |
| H3 | `clamp(1.125rem, 2vw, 1.5rem)` | 600 | 1.4 |
| Body | `clamp(0.9375rem, 1vw, 1rem)` | 400 | 1.6 |
| Small | `clamp(0.8125rem, 0.9vw, 0.875rem)` | 400 | 1.5 |
| Mono / Label | `0.75rem` | 500 | 1.4 |

### Font Classes

```css
.text-hero  { font-size: var(--text-hero); font-weight: 800; }
.text-h1    { font-size: var(--text-h1); font-weight: 700; }
.text-h2    { font-size: var(--text-h2); font-weight: 600; }
.text-h3    { font-size: var(--text-h3); font-weight: 600; }
.text-body  { font-size: var(--text-body); font-weight: 400; }
.text-small { font-size: var(--text-small); font-weight: 400; }
.text-accent     { color: var(--color-accent); }
.text-secondary  { color: var(--color-text-secondary); }
.text-muted      { color: var(--color-text-muted); }
```

---

## Spacing (4px Base Grid)

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1200px;
--container-2xl: 1400px;
```

---

## Border Radius

```css
--radius-sm: 6px;     /* Badges, tags, small buttons */
--radius-md: 10px;    /* Inputs, small cards */
--radius-lg: 16px;    /* Cards, panels, modals */
--radius-xl: 24px;    /* Hero sections, feature cards  */
--radius-full: 9999px; /* Pills, avatars */
```

---

## Glassmorphism

### Standard Recipe
```css
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}
```

### Variants

```css
/* Subtle — info panels, sidebars */
.glass-card--subtle {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
}

/* Prominent — main CTAs, featured content */
.glass-card--prominent {
  background: rgba(30,111,217,0.08);
  border: 1px solid rgba(30,111,217,0.2);
}

/* Success state — confirmed appointments */
.glass-card--success {
  background: rgba(34,197,94,0.08);
  border: 1px solid rgba(34,197,94,0.2);
}

/* Warning state — pending appointments */
.glass-card--warning {
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.2);
}

/* Overlay — modal backdrops */
.glass-overlay {
  background: rgba(6,15,30,0.7);
  backdrop-filter: blur(40px);
}
```

### Hover State

```css
.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.12);
  transition: all 300ms ease;
}
```

---

## Buttons

### Base Rules
- Minimum height: `44px` (touch target)
- Minimum width: `44px`
- Padding: `var(--space-3) var(--space-6)` (12px 24px)
- Transition: `all 200ms ease`

### Button Variants

```css
/* Primary — booking, payment confirm */
.btn-primary {
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
}
.btn-primary:hover  { transform: scale(1.02); box-shadow: 0 8px 24px rgba(30,111,217,0.4); }
.btn-primary:active { transform: scale(0.98); }
.btn-primary:focus  { outline: 2px solid var(--color-accent); outline-offset: 2px; }

/* Outline — secondary actions, cancel */
.btn-outline {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
}
.btn-outline:hover { background: rgba(56,189,248,0.1); }

/* Danger — destructive actions */
.btn-danger {
  background: var(--gradient-error);
  color: white;
  border-radius: var(--radius-md);
}

/* Disabled state (all variants) */
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
```

---

## Forms

### Input Fields

```css
.form-input {
  min-height: 44px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-family: var(--font-primary);
  padding: var(--space-3) var(--space-4);
  transition: border-color 200ms;
  width: 100%;
}
.form-input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(56,189,248,0.1);
}
.form-input::placeholder { color: var(--color-text-muted); }
.form-input--error { border-color: var(--color-error); }
```

### Form Layout

```
.form-group       → vertical stack (label + input + error)
.form-label       → font-weight 500, margin-bottom space-2
.form-input       → full-width input
.form-error       → color-error, font-size small, margin-top space-1
```

---

## Animation System

### Scroll-triggered Animations

```css
/* Entry animations — add to elements */
.fade-in          { opacity 0→1, translateY 20px→0, 600ms ease-out }
.fade-in-left     { opacity 0→1, translateX -20px→0, 600ms ease-out }
.fade-in-right    { opacity 0→1, translateX 20px→0, 600ms ease-out }
.scale-in         { opacity 0→1, scale 0.95→1, 600ms ease-out }

/* Skeleton loading */
.skeleton         { background: linear-gradient(90deg, glass-surface, lighter, glass-surface) }
```

### Stagger Timing

```
Cards in grid:         100ms between each
List items:             50ms between each
Navigation items:       75ms between each
```

### Transition Standards

```css
--transition-fast:   150ms ease;     /* color, opacity */
--transition-normal: 200ms ease;     /* interactions */
--transition-smooth: 300ms ease;     /* transforms */
--transition-slow:   500ms ease;     /* page transitions */
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Breakpoints

```css
/* Mobile-first (default: 375px) */
@media (min-width: 640px)  { /* Small — compact mobile */ }
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Wide */ }
@media (min-width: 1536px) { /* Ultra-wide */ }
```

### Grid Columns

| Screen | Columns | Gap |
|--------|---------|-----|
| Mobile (375px) | 1 | `var(--space-4)` |
| Tablet (768px) | 2 | `var(--space-6)` |
| Desktop (1024px) | 3 | `var(--space-6)` |
| Wide (1280px) | 4 | `var(--space-8)` |

### Section Padding

```css
/* Mobile */ padding: var(--space-12) var(--space-4);
/* Tablet */ padding: var(--space-16) var(--space-6);
/* Desktop */ padding: var(--space-20) var(--space-8);
```

---

## Navigation

- Desktop: `64px` fixed top bar, glass background
- Mobile: `56px` bar + slide-in drawer
- Active link: `color: var(--color-accent)` + bottom border or left indicator
- Avatar/user area: aligned right on desktop, in drawer on mobile

---

## Cards — Healthcare Context

### Appointment Card
```
Status badge (top-right)     PENDING / CONFIRMED / CANCELLED / COMPLETED
Doctor name + specialty
Date + time
Queue number (if queued)
Action buttons:  [View Details] [Cancel] [Pay Now]
```

### Payment Card
```
Order ID (mono font)
Amount in LKR (bold, large)
Status badge                 PENDING / SUCCESS / FAILED / REFUNDED
Date + method
Action buttons:  [View Invoice] [Download PDF]
```

---

## Loading States

Always implement all four states:

```
Loading:  Skeleton pulses (not spinner per default)
Empty:    Illustration + helpful text + CTA button
Error:    Error icon + message + Retry button
Success:  Checkmark animation + success message
```

---

## CSS Custom Property Baseline

All custom properties defined in `:root` in the main CSS file:

```css
:root {
  /* Colors */
  --color-bg: #060f1e;
  --color-bg-elevated: #0d1a2e;
  /* ... all tokens from palette above ... */

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --text-hero: clamp(2.25rem, 5vw, 4rem);
  /* ... */

  /* Spacing */
  --space-1: 4px;
  /* ... */

  /* Radii */
  --radius-sm: 6px;
  /* ... */

  /* Transitions */
  --transition-fast: 150ms ease;
  /* ... */
}
```

---

## Accessibility Requirements

- All interactive elements: minimum `44px × 44px` touch target
- Focus states: `2px solid var(--color-accent)` outline, `2px` offset
- Color contrast: WCAG AA minimum (4.5:1 text, 3:1 large text)
- ARIA: `aria-label` on icon-only buttons, `aria-live="polite"` on status updates
- Keyboard: full tab order, ESC closes modals + drawers
- Images: `alt` text required, `loading="lazy"`, `width` + `height` specified
- Reduced motion: disable all animations when `prefers-reduced-motion: reduce`

---

## Image Optimization

| Type | Max Size | Dimensions | Format |
|------|----------|------------|--------|
| Hero | < 200KB | 1920×1080 | WebP + JPEG fallback |
| Card | < 80KB | 600×400 | WebP |
| Thumbnail | < 30KB | 300×200 | WebP |
| Icon | < 5KB | — | SVG |
