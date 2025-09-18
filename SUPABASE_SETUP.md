# Supabase Integration Setup

This dashboard is now connected to Supabase for real-time data. Follow these steps to complete the setup:

## 1. Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## 2. Database Table

Make sure your Supabase database has a table with the following schema:

```sql
CREATE TABLE calls (
  id bigint PRIMARY KEY,
  manager_name text,
  quality_of_call int,
  time_call int, -- duration in minutes
  script_match int, -- percentage
  errors int,
  rating int, -- 1-10 scale
  created_at timestamptz DEFAULT now()
);
```

## 3. Table Name

Update the table name in the following files if your table is not named `calls`:

- `src/hooks/useCalls.ts` (line 15 and 35)
- `src/hooks/useManagers.ts` (line 12)

Replace `'calls'` with your actual table name.

## 4. Row Level Security (RLS)

If you have RLS enabled, make sure to create appropriate policies for reading data:

```sql
-- Allow reading all calls (adjust as needed for your security requirements)
CREATE POLICY "Allow read access to calls" ON calls
  FOR SELECT USING (true);
```

## 5. Test the Integration

1. Start the development server: `npm run dev`
2. Check the browser console for any connection errors
3. Verify that data loads correctly in the dashboard

## Features

- ✅ Real-time data fetching from Supabase
- ✅ Manager filtering
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive KPI calculations
- ✅ Dynamic charts based on real data
- ✅ Proper data formatting (duration, dates, etc.)

The dashboard will automatically update when you add new data to your Supabase table.
