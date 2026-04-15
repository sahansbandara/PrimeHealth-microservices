---
description: Fix Issue command standard for PrimeHealth
---

# Fix Issue Workflow
When instructed to fix an issue:
1. Replicate locally via `npm run dev` and `curl`.
2. Find root cause in logs or memory (`agent/MEMORY.md`).
3. Apply patch (service or controller level).
4. Verify tests pass.
5. Record bug in `agent/MEMORY.md` under Mistakes / Patterns.
