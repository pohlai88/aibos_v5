-- Create departments table (if not exists)
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

-- Create employee_master table
CREATE TABLE employee_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT UNIQUE,
  ic_number TEXT UNIQUE,
  passport_number TEXT UNIQUE,
  full_name TEXT NOT NULL,
  primary_email TEXT UNIQUE NOT NULL,
  recovery_email TEXT,
  has_recovery_email BOOLEAN NOT NULL DEFAULT false,
  supabase_uid UUID UNIQUE, -- Link to Supabase Auth user.id
  user_type TEXT NOT NULL DEFAULT 'candidate',
  role TEXT,
  status TEXT DEFAULT 'active',
  department_id UUID REFERENCES departments(id),
  position TEXT,
  date_joined DATE,
  date_left DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for employee_master
DROP TRIGGER IF EXISTS trg_set_updated_at ON employee_master;
CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON employee_master
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Staging table for CSV import
CREATE TABLE IF NOT EXISTS employee_import_staging (
  employee_id TEXT,
  ic_number TEXT,
  passport_number TEXT,
  full_name TEXT,
  primary_email TEXT,
  recovery_email TEXT,
  has_recovery_email BOOLEAN,
  supabase_uid UUID,
  user_type TEXT,
  role TEXT,
  status TEXT,
  department_id UUID,
  position TEXT,
  date_joined DATE,
  date_left DATE
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_employee_master_user_type ON employee_master(user_type);
CREATE INDEX IF NOT EXISTS idx_employee_master_status ON employee_master(status);
CREATE INDEX IF NOT EXISTS idx_employee_master_department_id ON employee_master(department_id);

-- Upsert/soft-delete logic (example for migration)
-- 1. Upsert (insert new or update existing by employee_id)
INSERT INTO employee_master (
  employee_id, ic_number, passport_number, full_name, primary_email, recovery_email, has_recovery_email, supabase_uid, user_type, role, status, department_id, position, date_joined, date_left
)
SELECT
  s.employee_id, s.ic_number, s.passport_number, s.full_name, s.primary_email, s.recovery_email, s.has_recovery_email, s.supabase_uid, s.user_type, s.role, s.status, s.department_id, s.position, s.date_joined, s.date_left
FROM employee_import_staging s
ON CONFLICT (employee_id) DO UPDATE SET
  ic_number = EXCLUDED.ic_number,
  passport_number = EXCLUDED.passport_number,
  full_name = EXCLUDED.full_name,
  primary_email = EXCLUDED.primary_email,
  recovery_email = EXCLUDED.recovery_email,
  has_recovery_email = EXCLUDED.has_recovery_email,
  supabase_uid = EXCLUDED.supabase_uid,
  user_type = EXCLUDED.user_type,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  department_id = EXCLUDED.department_id,
  position = EXCLUDED.position,
  date_joined = EXCLUDED.date_joined,
  date_left = EXCLUDED.date_left;

-- 2. Soft-delete: mark as inactive any employee_master rows not present in the latest import
UPDATE employee_master em
SET status = 'inactive'
WHERE NOT EXISTS (
  SELECT 1 FROM employee_import_staging s WHERE s.employee_id = em.employee_id
) AND em.status = 'active'; 