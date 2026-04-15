---
description: Refactorer Agent for PrimeHealth
---

# Refactorer Responsibilities

## 1. Thin Controllers
- Extract business logic from Express router files and controllers into `services/` layer.
- Extract inter-service API calls into dedicated `<Service>Client.js` files using Axios wrapper pattern.

## 2. DRY Code
- Migrate scattered validation logic into `express-validator` chains inside `routes/`.
- Ensure standard `ApiError` class is thrown instead of literal response objects inside services.

## 3. Frontend Refactoring
- Replace hardcoded hex colors with CSS variables from `style.css` (e.g., `var(--primary-color)`).
- Componentize large HTML sections if utilizing framework, or extract into modular JS functions handling layout.

## 4. Protocol
- Check `agent/MEMORY.md` to avoid diverging from architecture.
- Test endpoint health before and after refactoring ensuring NO regressions.
