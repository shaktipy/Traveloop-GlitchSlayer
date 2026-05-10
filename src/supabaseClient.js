import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vmvhmdfyxqagdxaliqsj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdmhtZGZ5eHFhZ2R4YWxpcXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTc3OTgsImV4cCI6MjA5MzkzMzc5OH0.qd2tvLOA2clpxb1DlTWbAAzAqBCGnW8uhHyC63yhMKM'

export const supabase = createClient(supabaseUrl, supabaseKey)