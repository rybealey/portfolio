-- Content for ryanbealey.com: case studies, Writing notes, link previews and
-- the images both use. MariaDB 10.11, utf8mb4. Bodies are Markdown, rendered
-- by the site at request time.

-- Images stored once by content hash: link preview images and note images.
CREATE TABLE media (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  sha256 CHAR(64) NOT NULL,
  content_type VARCHAR(64) NOT NULL,
  width SMALLINT UNSIGNED NULL,
  height SMALLINT UNSIGNED NULL,
  bytes MEDIUMBLOB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY media_sha256 (sha256)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE case_studies (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL,
  sort_order SMALLINT UNSIGNED NOT NULL,
  label VARCHAR(40) NOT NULL,
  title VARCHAR(200) NOT NULL,
  summary VARCHAR(500) NOT NULL,
  role VARCHAR(120) NOT NULL,
  timeframe VARCHAR(80) NOT NULL,
  stack JSON NOT NULL CHECK (JSON_VALID(stack)),
  status ENUM('shipped', 'live', 'phased', 'prototype', 'in-progress') NOT NULL,
  accent ENUM('billing', 'web', 'fin') NOT NULL,
  metrics JSON NOT NULL CHECK (JSON_VALID(metrics)),
  body MEDIUMTEXT NOT NULL,
  published TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY case_studies_slug (slug),
  KEY case_studies_published_order (published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per shared URL, fetched once. url_hash keys long URLs.
CREATE TABLE link_previews (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(2048) NOT NULL,
  url_hash CHAR(64) AS (SHA2(url, 256)) PERSISTENT,
  status ENUM('ok', 'failed') NOT NULL,
  host VARCHAR(255) NOT NULL,
  site_name VARCHAR(255) NULL,
  title VARCHAR(500) NULL,
  description TEXT NULL,
  kind ENUM('large', 'summary', 'video') NOT NULL DEFAULT 'large',
  image_media_id INT UNSIGNED NULL,
  fetched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY link_previews_url_hash (url_hash),
  CONSTRAINT link_previews_image FOREIGN KEY (image_media_id) REFERENCES media (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Microblog notes. The slug is the permalink and starts with the date.
-- A note carries at most one attachment: a link, a case study or an image.
CREATE TABLE notes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(160) NOT NULL,
  published_on DATE NOT NULL,
  topic ENUM('billing', 'web', 'support', 'build') NOT NULL,
  body TEXT NOT NULL,
  pinned TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  link_url VARCHAR(2048) NULL,
  link_url_hash CHAR(64) AS (SHA2(link_url, 256)) PERSISTENT,
  case_study_id INT UNSIGNED NULL,
  image_media_id INT UNSIGNED NULL,
  image_alt VARCHAR(300) NULL,
  image_caption VARCHAR(300) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY notes_slug (slug),
  KEY notes_status_date (status, published_on),
  KEY notes_link (link_url_hash),
  -- RESTRICT, not SET NULL: MariaDB won't CHECK a column a cascade can change,
  -- and a case study a note points to shouldn't vanish from under it anyway.
  CONSTRAINT notes_case_study FOREIGN KEY (case_study_id) REFERENCES case_studies (id) ON DELETE RESTRICT,
  CONSTRAINT notes_image FOREIGN KEY (image_media_id) REFERENCES media (id) ON DELETE RESTRICT,
  CONSTRAINT notes_one_attachment CHECK ((link_url IS NOT NULL) + (case_study_id IS NOT NULL) + (image_media_id IS NOT NULL) <= 1),
  CONSTRAINT notes_image_alt CHECK (image_media_id IS NULL OR image_alt IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
