# Agent Guidelines for Nommia Project

This document helps LLMs understand the project structure, conventions, and intent when working on the Nommia family week planner application.

## Project Overview

Nommia is a SvelteKit application designed to help families plan their week efficiently through meal planning, task management, grocery lists, and contact management.

## Core Principles

1. **Family-Centric Design**: All features revolve around family collaboration
2. **Simplicity**: Intuitive interface that reduces cognitive load
3. **Real-time Collaboration**: Changes sync across family members
4. **Extensibility**: Modular architecture allows for easy feature additions

## Architecture Overview

### Frontend (SvelteKit)
- Located in `/src/routes`
- Components in `/src/lib/components`
- Forms and schemas in `/src/lib/forms`
- Layouts and shared components in `/src/lib`

### Backend
- API routes in `/src/routes/*/+server.ts`
- Database layer in `/src/lib/server/db`
- Authentication in `/src/lib/auth.ts` and `/src/lib/auth-client.ts`
- Database schema in `/src/lib/server/db/schema`

### Key Directories
- `/src/routes/planner` - Main application functionality
- `/src/routes/auth` - Authentication routes
- `/src/lib/server/db/api` - Database API functions
- `/src/lib/components/ui` - Reusable UI components

## Database Schema Conventions

### Tables
- `family_plan` - Stores family group information
- `member` - Junction table linking users to family plans
- `user` - Authentication user data (from Better Auth)
- `meals` - Meal planning data
- `tasks` - Task management (planned)
- Standard auth tables: accounts, sessions, verifications, passkeys

### Naming Conventions
- Tables use snake_case
- Primary keys: `id` (text UUID for family_plan, integer for member)
- Foreign keys reference table names (e.g., `family` references `family_plan.id`)
- Timestamps: `createdAt` and `updatedAt` (camelCase in TypeScript)

## Development Guidelines

### State Management
- Use Svelte stores for shared state
- Form data managed with Zod schemas
- Server data fetched via `+page.server.ts` and `load` functions

### Styling
- Tailwind CSS for utility-first styling
- Component-based styling with Svelte scoping
- Consistent spacing and typography system

### Authentication
- Better Auth handles user authentication
- Protected routes checked via `+layout.server.ts`
- User data available through `locals.user`

### API Patterns
- RESTful conventions where applicable
- Server actions for form submissions
- JSON responses for data fetching

## Feature-Specific Guidelines

### Meal Planning
- Meals associated with specific dates
- Recipes can include ingredients, instructions, icons
- Calendar-based UI for weekly view

### Task Management (Planned)
- Tasks assigned to family members
- Due dates and completion tracking
- Recurring task support

### Grocery List (Planned)
- Auto-generated from meal plan ingredients
- Manual additions supported
- Categorization by store sections

### Address Book (Planned)
- Contact information storage
- Emergency details
- Shared access within family group

## Collaboration Patterns
- Real-time updates via database changes
- Optimistic UI updates where appropriate
- Conflict resolution strategies for simultaneous edits

## Testing Approach
- Unit tests for utilities and components
- Integration tests for API endpoints
- End-to-end tests for critical user flows

## Performance Considerations
- Database indexing on foreign keys and query fields
- Pagination for large datasets
- Memoization for expensive computations
- Lazy loading for non-critical components

## Security Practices
- Input validation with Zod
- Parameterized queries to prevent SQL injection
- Row-level security concepts (application-level)
- Secure session handling via Better Auth

## Internationalization
- Using @inlang/paraglide-sveltekit
- Translation files in `src/paraglide`
- Components should use `$t()` function for translations

## Common Issues to Avoid
- Direct DOM manipulation (use Svelte bindings instead)
- Overly complex nested components
- Blocking the main thread with heavy computations
- Forgetting to handle loading and error states
- Not cleaning up event listeners or subscriptions

## Contributing
1. Follow existing code style and patterns
2. Write clear, descriptive commit messages
3. Update documentation when changing APIs
4. Add tests for new functionality
5. Ensure accessibility considerations are met

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
