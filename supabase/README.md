# Supabase Setup for AIBOS v5

This folder contains Supabase configuration, SQL migrations, and setup instructions.

## Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key

### 2. Run Database Schema
1. Go to your Supabase dashboard → SQL Editor
2. Copy and paste the contents of `schema.sql`
3. Run the script to create tables and sample data

### 3. Configure Environment Variables
Create a `.env` file in your project root:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Update Supabase Client
Edit `src/utils/supabase.js` with your actual project credentials:
```javascript
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-anon-key-here';
```

## Database Schema

### Tables Created
- **users**: User accounts with email and name
- **transactions**: Financial transactions with amounts, types, and status
- **approvals**: Approval workflow for transactions

### Sample Data
The schema includes sample data for testing:
- 4 sample users
- 8 sample transactions (mix of income/expense, approved/pending)
- 8 sample approvals

## Testing the Dashboard

1. After setup, open `src/modules/dashboard/dashboard.html`
2. The dashboard should display:
   - Real revenue calculated from approved income transactions
   - Active user count (users with recent transactions)
   - Total transaction count
   - Pending approvals count
   - Live chart with monthly revenue data
   - Recent transactions table

## Troubleshooting

- **Connection errors**: Check your Supabase URL and anon key
- **No data showing**: Ensure you've run the schema.sql script
- **CORS errors**: Check your Supabase project settings

See `MISTAKES_AND_SOLUTIONS.md` for more troubleshooting tips. 