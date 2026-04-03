CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages in sessions they are part of
CREATE POLICY "Users can read their session messages" ON public.messages 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = messages.session_id 
      AND (s.mentor_id = auth.uid() OR s.student_id = auth.uid())
    )
  );

-- Users can insert messages in sessions they are part of
CREATE POLICY "Users can insert messages" ON public.messages 
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.sessions s 
      WHERE s.id = messages.session_id 
      AND (s.mentor_id = auth.uid() OR s.student_id = auth.uid())
    )
  );
