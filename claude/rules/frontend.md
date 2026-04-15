---
description: Frontend rules for PrimeHealth UI
---

## Structure
- Use Vanilla HTML, CSS, JS.

## Styling
- Glassmorphism design system. 
- Use token system for text and colors.
- Dark mode primary setup (`bg-dark`, `text-light`).
- Primary brand color: `#0a9396` (teal).

## State Management
- Handle API request promises with Loading UI overlays or button spinners.
- Handle failure states with clear toast messages.
- Always include auth headers on `fetch` calls to `/api/`.
