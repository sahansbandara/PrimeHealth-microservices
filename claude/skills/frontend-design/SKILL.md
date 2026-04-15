---
name: frontend-design
description: Apply exact design standards to any UI component automatically.
user-invocable: true
---

# Frontend Design Skill

> Auto-applies design system standards from `design.md` to all frontend code. Reference this skill whenever building UI components, pages, or styling elements.

## Color Palette — Dark Mode (Default)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0a0a0f` | Page background |
| `--color-bg-elevated` | `#12121a` | Cards, modals |
| `--color-surface` | `rgba(255,255,255,0.04)` | Glass backgrounds |
| `--color-primary` | `#1a1a2e` | Primary actions |
| `--color-secondary` | `#6c3483` | Secondary actions |
| `--color-accent` | `#3498db` | Links, highlights |
| `--color-success` | `#2ecc71` | Success/confirmations |
| `--color-warning` | `#f39c12` | Warnings |
| `--color-error` | `#e74c3c` | Errors, destructive |
| `--color-text` | `#ffffff` | Primary text |
| `--color-text-secondary` | `rgba(255,255,255,0.7)` | Secondary text |
| `--color-text-muted` | `rgba(255,255,255,0.4)` | Placeholders, disabled |
| `--color-border` | `rgba(255,255,255,0.08)` | Dividers, edges |

## Glassmorphism Implementation

Standard: `background: rgba(255,255,255,0.04); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;`
Hover: `transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.6);`

Use variants: `.glass-card--subtle` (lower contrast), `.glass-card--prominent` (higher), `.glass-card--overlay` (dark overlay)

## Typography with clamp()

- Hero: `clamp(2.25rem, 5vw, 4rem)` — 800 weight, line-height 1.1
- H1: `clamp(1.75rem, 4vw, 3rem)` — 700 weight, line-height 1.2
- H2: `clamp(1.375rem, 3vw, 2.25rem)` — 600 weight, line-height 1.3
- H3: `clamp(1.25rem, 2vw, 1.5rem)` — 600 weight, line-height 1.4
- Body: `clamp(0.9375rem, 1vw, 1rem)` — 400 weight, line-height 1.6
- Small: `clamp(0.8125rem, 0.9vw, 0.875rem)` — 400 weight, line-height 1.5

Font: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

## Spacing (4px Base)

Core: `--space-1: 4px | --space-2: 8px | --space-3: 12px | --space-4: 16px | --space-6: 24px | --space-8: 32px | --space-12: 48px | --space-16: 64px`

Container widths: `sm: 640px | md: 768px | lg: 1024px | xl: 1200px | 2xl: 1400px`

## Component Patterns

**Buttons:** min-height 44px, min-width 44px, padding var(--space-3) var(--space-6), border-radius var(--radius-md)
- Hover: scale(1.02), box-shadow glow
- Focus: 2px solid var(--color-accent) outline, 2px offset
- Active: scale(0.98)

**Forms:** min-height 44px inputs, labels above with var(--weight-medium), helper text below in muted color, error state with red border

**Navigation:** Desktop 64px fixed bar, mobile 56px, hamburger drawer, active state with underline + accent color

**Cards:** 24px padding, 16px radius, glass background, hover translate -4px + shadow upgrade

**Modals:** glass overlay (rgba(0,0,0,0.6) blur 40px), prominent glass content (max 600px), enter/exit scale + opacity animations

## Animation System

**Scroll Animations:** fade-in (opacity 0→1, translateY 20px→0, 600ms), fade-in-left/right (translateX ±20px), scale-in (0.95→1)

**Stagger Timing:** cards 100ms, lists 50ms, nav 75ms between items

**Transitions:** fast 150ms (color), normal 200ms (interactions), smooth 300ms (transforms), slow 500ms (page transitions), spring 300ms (bouncy)

## Responsive Breakpoints

Mobile default (375px) → Tablet (768px) → Desktop (1024px) → Wide (1280px) → Ultra-wide (1536px)

Grid: 1 col mobile, 2 col tablet, 3 col desktop, 4 col wide | Padding: 16px mobile, 24px tablet, 32px desktop, 48px wide

## Accessibility Requirements

- Touch targets: minimum 44x44px (all interactive elements)
- Focus states: 2px outline, 2px offset, use var(--color-accent)
- Color contrast: WCAG AA (4.5:1 text, 3:1 non-text)
- ARIA attributes: role, aria-live="polite", aria-label, aria-hidden
- Keyboard navigation: full tab order, ESC closes modals
- Reduced motion: @media (prefers-reduced-motion: reduce) — disable animations

## Image Optimization

Hero: WebP <200KB, 1920x1080 | Card: <80KB, 600x400 | Thumbnail: <30KB, 300x200
Always: width, height, alt text, lazy loading, srcset, WebP + JPEG fallback

## CSS Class Reference

`.glass-card` (standard), `.glass-card--subtle` (low contrast), `.glass-card--prominent` (high contrast)
`.btn` (base), `.btn-primary` (blue-purple gradient), `.btn-outline` (transparent with border)
`.form-field`, `.form-label`, `.form-input`, `.form-input--error`, `.form-error`
`.text-hero`, `.text-h1/h2/h3`, `.text-secondary`, `.text-muted`, `.text-accent`
`.container` (responsive max-width), `.section` (responsive padding)
`.animate-on-scroll` (scroll hook), `.sr-only` (screen readers only)
`.flex`, `.flex-col`, `.items-center`, `.justify-center`, `.justify-between`, `.gap-{2,4,6,8}`
`.grid`, `.grid-2`, `.grid-3` (responsive columns)
