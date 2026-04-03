-- Create Sessions Table
CREATE TABLE public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT CHECK (status IN ('SCHEDULED', 'ACTIVE', 'COMPLETED')) DEFAULT 'SCHEDULED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Mentors can create and view their sessions
CREATE POLICY "Mentors can insert sessions" ON public.sessions 
  FOR INSERT WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Users can view their sessions" ON public.sessions 
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = student_id);

-- Students can update sessions to join them
CREATE POLICY "Students can join sessions" ON public.sessions 
  FOR UPDATE USING (auth.uid() = student_id OR student_id IS NULL);
