-- ============================================
-- CONTACT SUBMISSIONS STATUS UPDATE
-- ============================================

-- Add new columns for enhanced message management
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new',
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Create status enum check
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_message_status'
  ) THEN
    ALTER TABLE contact_submissions
      ADD CONSTRAINT valid_message_status 
      CHECK (status IN ('new', 'read', 'contacted', 'in_progress', 'resolved', 'archived'));
  END IF;
END $$;

-- Update existing records: set status based on is_read
UPDATE contact_submissions 
SET status = CASE WHEN is_read THEN 'read' ELSE 'new' END
WHERE status IS NULL;

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Add RLS policy for updates
CREATE POLICY IF NOT EXISTS "Adminler mesajları güncelleyebilir"
  ON contact_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add RLS policy for deletes
CREATE POLICY IF NOT EXISTS "Adminler mesajları silebilir"
  ON contact_submissions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
