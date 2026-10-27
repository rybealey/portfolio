-- For the publishing API (src/pages/api/v1). Tokens, one per device. Only a
-- SHA-256 hash of each token is stored, so a copy of the database can't be
-- used to post. Create, list and revoke them with `npm run api:token`.
CREATE TABLE api_tokens (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  token_hash CHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP NULL,
  revoked_at TIMESTAMP NULL,
  UNIQUE KEY api_tokens_hash (token_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- A version per row for the API's edit-conflict check: every API edit raises
-- it by one, and an edit that names an older version is refused.
ALTER TABLE notes ADD COLUMN version INT UNSIGNED NOT NULL DEFAULT 1 AFTER id;
ALTER TABLE case_studies ADD COLUMN version INT UNSIGNED NOT NULL DEFAULT 1 AFTER id;
