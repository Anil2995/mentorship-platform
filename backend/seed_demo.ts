import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://flcmjihcchdlwuopdotn.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsY21qaWhjY2hkbHd1b3Bkb3RuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE2MTE5MiwiZXhwIjoyMDg5NzM3MTkyfQ.hTQ_uC1d90NgQYU7RGP6to3lVwVPoxdmKVE_zHzB904';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function seed() {
  console.log('Seeding Demo Mentor...');
  const { error: mentorErr } = await supabase.auth.admin.createUser({
    email: 'mentor@demo.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'MENTOR', full_name: 'John Mentor' }
  });

  if (mentorErr) {
    console.log('Failed to create mentor:', mentorErr.message);
  } else {
    console.log('Successfully created Mentor: mentor@demo.com');
  }

  console.log('Seeding Demo Student...');
  const { error: studentErr } = await supabase.auth.admin.createUser({
    email: 'student@demo.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'STUDENT', full_name: 'Jane Student' }
  });

  if (studentErr) {
    console.log('Failed to create student:', studentErr.message);
  } else {
    console.log('Successfully created Student: student@demo.com');
  }
}

seed();
