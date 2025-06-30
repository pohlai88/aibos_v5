# Employee Management Module

A complete CRUD (Create, Read, Update, Delete) system for managing employee records in your AI-BOS application.

## Features

### ✅ **Employee List** (`/employees`)
- View all employees with search and filtering
- Status badges (Active, Inactive, Pre-boarding, Left Company)
- User type badges (Employee, Candidate, Contractor, Vendor)
- Soft delete functionality (deactivate instead of hard delete)
- Responsive design with Apple-style UI

### ✅ **Add Employee** (`/employees/new`)
- Comprehensive form with all employee fields
- **Dual Email Logic**: Recovery email required for employees
- **Identity Validation**: IC number or passport number required
- Real-time form validation
- Department selection dropdown

### ✅ **Edit Employee** (`/employees/[id]/edit`)
- Pre-populated form with existing data
- Same validation as create form
- Update any employee field
- Maintains data integrity

### ✅ **Database Setup** (`/employees/setup`)
- Create sample departments
- Create sample employees for testing
- Clear all data (for development)

## Database Schema

### `employee_master` Table
```sql
- id (UUID, Primary Key)
- employee_id (TEXT, Unique)
- ic_number (TEXT, Unique)
- passport_number (TEXT, Unique)
- full_name (TEXT, Required)
- primary_email (TEXT, Unique, Required)
- recovery_email (TEXT)
- has_recovery_email (BOOLEAN)
- supabase_uid (UUID, Unique) -- Links to Supabase Auth
- user_type (TEXT, Required) -- employee, candidate, contractor, vendor
- role (TEXT)
- status (TEXT) -- active, inactive, pre-boarding, left-company
- department_id (UUID) -- Foreign key to departments
- position (TEXT)
- date_joined (DATE)
- date_left (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP) -- Auto-updated by trigger
```

### `departments` Table
```sql
- id (UUID, Primary Key)
- name (TEXT, Unique, Required)
```

## Business Rules

### 🔐 **Dual Email Logic**
- **Employees**: Must have both primary AND recovery email
- **Others**: Can have just primary email
- Recovery email must be different from primary email

### 🆔 **Identity Management**
- Either IC number OR passport number is required
- Both can be unique (partial uniqueness enforced)

### 🗑️ **Soft Delete**
- No hard deletes allowed
- Use status field: `active`, `inactive`, `pre-boarding`, `left-company`
- Records are preserved for audit trails

### 🔄 **Data Integrity**
- Auto-updated `updated_at` timestamp
- Foreign key constraints to departments
- Unique constraints on emails and IDs

## Getting Started

### 1. **Run the SQL**
First, execute the employee master SQL in your Supabase database:
```sql
-- Copy and paste the content from supabase/001_employee_master.sql
-- into your Supabase SQL Editor and run it
```

### 2. **Set up Environment Variables**
Make sure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. **Initialize Sample Data**
1. Go to `/employees/setup`
2. Click "Create Sample Departments"
3. Click "Create Sample Employees"

### 4. **Start Using**
1. Navigate to `/employees` to see the employee list
2. Click "Add Employee" to create new records
3. Click "Edit" on any employee to modify

## API Integration

### Fetch Employees
```typescript
const { data, error } = await supabase
  .from('employee_master')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false })
```

### Create Employee
```typescript
const { error } = await supabase
  .from('employee_master')
  .insert({
    full_name: 'John Doe',
    primary_email: 'john@company.com',
    recovery_email: 'john@gmail.com',
    user_type: 'employee',
    status: 'active'
  })
```

### Update Employee
```typescript
const { error } = await supabase
  .from('employee_master')
  .update({ status: 'inactive' })
  .eq('id', employeeId)
```

## Supabase Auth Integration

The `supabase_uid` field links employees to Supabase Auth users:

```typescript
// Get current user's employee record
const { data: sessionData } = await supabase.auth.getSession()
const supabase_uid = sessionData?.session?.user?.id

const { data: employee } = await supabase
  .from('employee_master')
  .select('*')
  .eq('supabase_uid', supabase_uid)
  .single()
```

## Security Considerations

### Row Level Security (RLS)
Enable RLS policies in Supabase for production:

```sql
-- Example RLS policy
CREATE POLICY "Users can view their own employee record" ON employee_master
  FOR SELECT USING (auth.uid() = supabase_uid);

CREATE POLICY "HR can manage all employees" ON employee_master
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM employee_master 
      WHERE supabase_uid = auth.uid() 
      AND user_type = 'employee' 
      AND role LIKE '%HR%'
    )
  );
```

### Validation
- Frontend validation for required fields
- Email format validation
- Business rule enforcement (dual email, identity)
- Backend constraints in database

## Future Enhancements

- [ ] Bulk import from CSV
- [ ] Employee photo uploads
- [ ] Advanced search and filtering
- [ ] Employee hierarchy/org chart
- [ ] Performance reviews integration
- [ ] Leave management
- [ ] Payroll integration
- [ ] Document management
- [ ] Audit logging
- [ ] Email notifications

## Troubleshooting

### Common Issues

1. **"relation does not exist" error**
   - Run the SQL from `supabase/001_employee_master.sql` first

2. **Foreign key constraint errors**
   - Create departments before creating employees

3. **Unique constraint violations**
   - Check for duplicate emails or IDs
   - IC/passport numbers must be unique

4. **Recovery email validation errors**
   - Employees must have recovery email
   - Recovery email must differ from primary email

### Development Tips

- Use `/employees/setup` to quickly populate test data
- Check browser console for detailed error messages
- Verify Supabase connection in `lib/supabaseClient.ts`
- Test with different user types and statuses 