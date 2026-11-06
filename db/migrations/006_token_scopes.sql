-- What each API token may do. Existing device tokens keep publishing only;
-- the job tracker's API needs a token created with --scope tracker.
ALTER TABLE api_tokens ADD COLUMN scopes SET('publish', 'tracker') NOT NULL DEFAULT 'publish' AFTER token_hash;
