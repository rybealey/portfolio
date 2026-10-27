-- Messages from the site's contact form (src/pages/api/contact.ts). Every
-- message is kept here whether or not email delivery is set up, so nothing
-- is lost; delivery through SMTP2Go updates its status. The sender's IP is
-- kept only as a salted hash, for rate limiting.
CREATE TABLE contact_messages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  topic ENUM('role', 'project', 'other') NULL,
  message TEXT NOT NULL,
  ip_hash CHAR(64) NOT NULL,
  status ENUM('received', 'sent', 'failed', 'spam') NOT NULL DEFAULT 'received',
  error VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY contact_messages_ip_time (ip_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
