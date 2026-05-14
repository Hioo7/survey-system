<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Architecture & Standards

This project follows a strict Feature-Based Modular Architecture designed for high maintainability and loose coupling. All contributors must adhere to these structural conventions.

## 1. The Tech Stack

The application is built on the following core technologies:

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (Utility-first approach)
- **Validation:** Zod (Schema-first validation for all data boundaries)
- **Database ORM:** Prisma (Type-safe database access)
- **Database:** PostgreSQL
- **Logic Pattern:** Server-first approach using Server Actions for data mutations.

## 2. Global Folder Responsibilities

The `src/` directory is partitioned into specific layers to separate concerns:

- `app/`: The Routing Layer. Contains only layouts and page entry points. Keep files here thin; they should delegate logic to the features layer.
- `components/`: The Design System Layer. Contains generic, reusable UI atoms (buttons, inputs, modals) that have no knowledge of business logic.
- `features/`: The Business Logic Layer. The core of the application. Everything related to a specific domain (e.g., users, billing, products) is encapsulated here.
- `lib/`: The Configuration Layer. Contains third-party SDK initializations, singleton instances (like the Prisma client), and global utility constants.
- `hooks/`: The State & Lifecycle Layer. Contains shared, reusable React hooks that are not tied to a specific feature.
- `services/`: The Global Data Layer. Contains data fetching logic or integrations that are shared across multiple features.

## 3. Modular Feature Structure

Each directory within `src/features/` should follow a consistent sub-structure to ensure pieces are swappable:

- **Schemas:** Definitions for data shapes and validation rules. These serve as the single source of truth for both the server and the client.
- **Services:** Direct database interactions and raw queries. This is the only place where the ORM should be heavily utilized for business-specific data fetching.
- **Actions:** The orchestration layer. These functions handle the transition between the UI and the database, managing validation, authorization, and cache revalidation.
- **Components:** UI elements that are specific to the feature and rely on that feature's logic or state.

## 4. Guiding Principles

- **Separation of Concerns:** UI components should not write directly to the database. They call Actions, which call Services.
- **Swappability:** Code should be written so that a feature folder can be moved or replaced with minimal impact on the rest of the system.
- **Validation at the Edge:** All data entering the system—whether from a form, a URL, or an external API—must be validated against a schema before processing.

# UI Development Rules

Every UI feature must follow this mandatory workflow — no exceptions.

## Step 1: Design Before Code (Required)

Before writing a single line of implementation code, you MUST plan the UI/UX. This means:

1. Define the user flows and interactions for the feature.
2. Describe the layout, component hierarchy, and visual structure.
3. Identify all states: loading, empty, error, success, and edge cases.
4. Invoke the `frontend-design` skill to produce a complete UI/UX plan and high-quality implementation. Do not skip this step or substitute it with ad-hoc component writing.

**The `frontend-design` skill is the mandatory entry point for all UI work.**

## Step 2: Implementation Standards

Once the design plan is produced via the `frontend-design` skill, implementation must follow these non-negotiable standards:

- **Responsive by default:** Every component and layout must work correctly at all breakpoints. Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) from the start — retrofitting responsiveness is not acceptable.
- **Mobile-native first:** Design and build for mobile screens first, then scale up to larger viewports. Touch targets must be adequately sized (minimum 44×44px), and interactions must feel native on touch devices.
- **No desktop-only assumptions:** Never assume a mouse, hover state, or wide viewport as the default experience.

## Step 3: Quality Checklist Before Marking UI Complete

Before considering any UI feature done, verify:

- [ ] Renders and functions correctly on mobile (320px–480px)
- [ ] Renders and functions correctly on tablet (768px–1024px)
- [ ] Renders and functions correctly on desktop (1280px+)
- [ ] All interactive states (hover, focus, active, disabled) are implemented
- [ ] Loading and error states are handled and displayed
- [ ] No layout overflow or horizontal scroll on any viewport
