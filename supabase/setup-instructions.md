# Supabase Setup Instructions (Manual Method)

Since the Supabase CLI installation had issues, here's how to set up your database manually:

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Wait for the project to be ready (usually 1-2 minutes)
4. Note your project URL and anon key from Settings → API

## 2. Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click **Run** to execute the script

This will create:
- Users table with sample users
- Transactions table with sample transactions  
- Approvals table with sample approvals
- All necessary indexes

## 3. Update Your Credentials

1. Edit `src/utils/supabase.js`
2. Replace the placeholder values:
   ```javascript
   const supabaseUrl = 'https://your-project-id.supabase.co';
   const supabaseKey = 'your-anon-key-here';
   ```

## 4. Test Your Dashboard

1. Open `src/modules/dashboard/dashboard.html` in your browser
2. You should see real data from your Supabase database:
   - Revenue calculated from transactions
   - User counts and transaction data
   - Live chart with monthly revenue
   - Recent transactions table

## Alternative: Use Supabase CLI Later

If you want to use the CLI later:
1. Download from: https://github.com/supabase/cli/releases
2. Extract and add to your PATH
3. Run `supabase init` in your project
4. Use `supabase db push` for future migrations

## Troubleshooting

- **Connection errors**: Double-check your URL and anon key
- **No data**: Make sure you ran the schema.sql script
- **CORS issues**: Check your Supabase project settings

Your dashboard should work perfectly with this manual setup! 