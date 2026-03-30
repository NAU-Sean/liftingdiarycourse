# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do NOT create custom UI components (buttons, inputs, cards, modals, etc.)
- Do NOT use any other component library (MUI, Chakra, Radix directly, etc.)
- Every UI element must come from shadcn/ui

If a needed component does not exist in the project yet, add it via the CLI:

```bash
npx shadcn@latest add <component-name>
```

Components are installed to `src/components/ui/` — do not modify these generated files.

## Date Formatting

All dates must be formatted using `date-fns`. Use ordinal day + abbreviated month + full year.

**Format:** `do MMM yyyy`

**Examples:**
- 1st Sep 2025
- 2nd Aug 2025
- 3rd Jan 2026
- 4th Jun 2024

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy");
```
