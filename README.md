# PIPELINE - Fantasy Sports Platform

PIPELINE is a modern, full-stack fantasy sports platform built with Next.js and Supabase. It provides a complete environment for users (Challengers) to join contests and for administrators to manage the platform's users, contests, and matches.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** [Supabase Auth](https://supabase.com/auth)
- **ORM/Data Fetching:** Direct SQL-like queries via `supabase-js`
- **Schema Validation:** [Zod](https://zod.dev/)

---

## Project Structure

The project follows a standard Next.js App Router structure with some key directories:

- **`/app`**: Contains all the routes and layouts for the application.
  - **`/app/admin`**: The main hub for all administrative functionality. Access is restricted to users with the `admin` role.
  - **`/app/dashboard`**: The main dashboard for authenticated regular users (Challengers).
  - **`/app/auth`**: Authentication-related pages like Login and Signup.
  - **`/api`**: Contains any legacy API routes. New functionality should prefer Server Actions.
- **`/components`**: Contains all shared React components.
  - **`/components/admin`**: Components used exclusively within the admin section.
  - **`/components/ui`**: Core UI components from shadcn/ui.
- **`/lib`**: Contains core application logic, utilities, and Supabase client initializers.
  - **`/lib/data`**: The centralized location for all data-fetching functions.
    - **`public.ts`**: Functions for fetching data that is publicly accessible and governed by RLS.
    - **`admin.ts`**: Functions for fetching data that requires admin privileges, using the service role key to bypass RLS.
  - **`/lib/supabase`**: Initializes the Supabase clients for both server-side rendering (`server.ts`) and admin actions (`admin.ts`).
- **`/scripts`**: Contains all SQL migration and seeding scripts. The `009-rebuild-database.sql` script is the master script for resetting the database.

---

## Core Concepts

### 1. Authentication & Role-Based Access Control (RBAC)

- Authentication is handled by Supabase Auth.
- User roles (`admin`, `challenger`) are stored in the `app_metadata` field of the `auth.users` table. This is the single source of truth for authorization.
- The root layout for the admin section (`/app/admin/layout.tsx`) acts as a security gateway, checking the user's role from their session data and redirecting non-admins.

### 2. Data Fetching

- All database queries are centralized in the `/lib/data` directory, separated into `public.ts` and `admin.ts` modules.
- Data is fetched on the server within Server Components and passed down to client components as props.
- All data-fetching functions follow an error-first return pattern, returning an object `{ data, error }` to allow for graceful error handling in the UI.

### 3. Server Actions

- All data mutations (create, update, delete) are handled using Next.js Server Actions.
- Server Actions are defined in `actions.ts` files, co-located with the features they serve (e.g., `/app/admin/actions.ts`).
- Server-side validation is performed in the actions using Zod. Client-side forms (`/components/admin/*-form.tsx`) use `useActionState` to interact with these actions, providing a seamless experience with pending states and error feedback.

---

## Database Management

The database schema is managed via SQL scripts in the `/scripts` directory.

To reset the database to a clean state, you can execute the `009-rebuild-database.sql` script directly in the Supabase SQL Editor. This script will:
1. Drop all existing gameplay tables.
2. Re-create all tables with their correct schema.
3. Seed the database with initial dummy data for matches and players.
4. Set up the user role management system (triggers and functions).

---

## Getting Started

To run the project locally, follow these steps:

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Set up environment variables:**
    - Create a file named `.env.local` in the root of the project.
    - Add your Supabase project URL and keys to this file:
      ```
      NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
      SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
      ```
4.  **Set up the database:**
    - Go to the Supabase SQL Editor for your project.
    - Copy the entire content of `scripts/009-rebuild-database.sql` and run it.
5.  **Run the development server:**
    ```bash
    pnpm dev
    ```

The application should now be running at `http://localhost:3000`.