-- The job application tracker behind /tracker (src/pages/tracker) and its
-- API (src/pages/api/v1/applications). One row per role researched or
-- applied to. The slug is the row's id from the tracker's earlier home, a
-- Claude artifact database, so imported rows keep their names.
CREATE TABLE applications (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  slug VARCHAR(200) NOT NULL,
  company VARCHAR(200) NOT NULL,
  role VARCHAR(300) NOT NULL,
  location VARCHAR(300) NULL,
  pay VARCHAR(300) NULL,
  experience TEXT NULL,
  tier TINYINT UNSIGNED NULL,
  `rank` INT UNSIGNED NULL,
  status ENUM('Shortlisted', 'Needs you', 'Approved', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn', 'Skipped') NOT NULL DEFAULT 'Shortlisted',
  url VARCHAR(2048) NULL,
  why TEXT NULL,
  notes MEDIUMTEXT NULL,
  applied_on DATE NULL,
  ats VARCHAR(200) NULL,
  found VARCHAR(300) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY applications_slug (slug),
  KEY applications_status (status),
  KEY applications_applied_on (applied_on)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Small named documents the tracker's automations keep, such as the mail
-- check's progress (key 'mailcheck'). Versioned like the rows above.
CREATE TABLE tracker_state (
  `key` VARCHAR(100) NOT NULL PRIMARY KEY,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  value LONGTEXT NOT NULL CHECK (JSON_VALID(value)),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Passcode tries at /tracker/unlock, for rate limiting. The IP is kept only
-- as a salted hash, as for contact_messages.
CREATE TABLE tracker_unlock_attempts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ip_hash CHAR(64) NOT NULL,
  ok TINYINT(1) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY tracker_unlock_attempts_ip_time (ip_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
