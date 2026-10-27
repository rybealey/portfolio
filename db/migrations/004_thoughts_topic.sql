-- Adds Thoughts, a Writing topic for personal notes that aren't about work.
-- The topic's label, band and blurb live in src/lib/notes.ts.
ALTER TABLE notes
  MODIFY topic ENUM('billing', 'web', 'support', 'build', 'thoughts') NOT NULL;
