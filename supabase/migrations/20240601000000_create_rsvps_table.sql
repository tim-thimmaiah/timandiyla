-- Create RSVP table
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  guests JSONB DEFAULT '[]'::jsonb,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow inserts for all users" ON public.rsvps
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Create policy to allow select for authenticated users only
CREATE POLICY "Allow select for authenticated users" ON public.rsvps
  FOR SELECT TO authenticated
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS rsvps_email_idx ON public.rsvps (email);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_rsvps_updated_at
BEFORE UPDATE ON public.rsvps
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create photos table for storing photo memories
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rsvp_id UUID REFERENCES public.rsvps(id),
  storage_path TEXT NOT NULL,
  note TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow inserts for all users" ON public.photos
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Create policy to allow select for all users
CREATE POLICY "Allow select for all users" ON public.photos
  FOR SELECT TO anon, authenticated
  USING (approved = true);

-- Create policy to allow select for authenticated users (including unapproved photos)
CREATE POLICY "Allow all select for authenticated users" ON public.photos
  FOR SELECT TO authenticated
  USING (true);

-- Create a trigger to automatically update the updated_at column for photos
CREATE TRIGGER update_photos_updated_at
BEFORE UPDATE ON public.photos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'photos' AND (storage.foldername(name))[1] = 'public');

CREATE POLICY "Allow authenticated read access" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'photos');

CREATE POLICY "Allow uploads from anyone" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow updates for authenticated users" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'photos'); 