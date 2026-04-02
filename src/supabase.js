import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qwyljqhqaffktexnhisl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3eWxqcWhxYWZma3RleG5oaXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzA1MzMsImV4cCI6MjA5MDcwNjUzM30.wS-YOUEZZzqZHVxJx6g96NqV4HFrJ5_hAur0N_Fwvl8'

export const supabase = createClient(supabaseUrl, supabaseKey)