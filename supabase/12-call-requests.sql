-- Call Requests Table
-- Kullanıcıların "Sizi Arayalım" talepleri

CREATE TABLE IF NOT EXISTS call_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  preferred_time VARCHAR(100), -- "Sabah", "Öğleden sonra", "Akşam" gibi
  note TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, called, no_answer, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  called_at TIMESTAMPTZ,
  called_by UUID REFERENCES auth.users(id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_call_requests_status ON call_requests(status);
CREATE INDEX IF NOT EXISTS idx_call_requests_created_at ON call_requests(created_at DESC);

-- RLS Policies
ALTER TABLE call_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Anyone can create call requests" ON call_requests
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can view
CREATE POLICY "Authenticated users can view call requests" ON call_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update call requests" ON call_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_call_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER call_requests_updated_at
  BEFORE UPDATE ON call_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_call_requests_updated_at();
