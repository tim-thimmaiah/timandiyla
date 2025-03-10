# Environment Variables Setup Guide

To properly configure your NextJS app with Supabase and Prisma, you need to set up the following environment variables in your `.env` file:

## Required Environment Variables

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Prisma Database Configuration
DATABASE_URL=your_postgresql_connection_string
```

## How to Get These Values

1. **Supabase Configuration**:
   - Create a project at [https://supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy the URL and anon/public key

2. **Prisma Database Configuration**:
   - You can use the same PostgreSQL database URL from Supabase
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` and `[YOUR-PROJECT-REF]` with your actual values

## Next Steps

1. Create a `.env` file in the root of your project
2. Add the above variables with your actual values
3. Run `npx prisma db push` to sync your Prisma schema with your database
4. Run `npm run dev` to start your development server
