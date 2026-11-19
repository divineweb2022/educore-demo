---
name: Next.js App Router conversion
description: A subtle routing conflict encountered when converting a starter project to Next.js App Router.
---

When converting a starter to the Next.js App Router, Next can reject the build if a leftover `src/pages` directory exists alongside the root `app` directory, even when `src/pages` contains no files.

**Why:** Next detects both routing roots from the filesystem and treats them as conflicting locations.

**How to apply:** When an App Router build reports that `pages` and `app` must be under the same folder, inspect for empty routing directories as well as files.
