CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY, name VARCHAR(160) NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','running','paused','completed')),
  target_rule_id UUID NOT NULL REFERENCES rules(id) ON DELETE CASCADE, goal VARCHAR(120) NOT NULL DEFAULT 'dashboard-cta',
  traffic INTEGER NOT NULL DEFAULT 100 CHECK (traffic BETWEEN 1 AND 100), audience JSONB NOT NULL,
  winner_variant_id UUID, created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), started_at TIMESTAMPTZ, completed_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS experiment_variants (
  id UUID PRIMARY KEY, experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL, variant_key VARCHAR(80) NOT NULL, weight INTEGER NOT NULL CHECK (weight BETWEEN 1 AND 100),
  content JSONB NOT NULL DEFAULT '{}'::jsonb, UNIQUE (experiment_id, variant_key)
);
ALTER TABLE experiments DROP CONSTRAINT IF EXISTS experiments_winner_variant_id_fkey;
ALTER TABLE experiments ADD CONSTRAINT experiments_winner_variant_id_fkey FOREIGN KEY (winner_variant_id) REFERENCES experiment_variants(id) ON DELETE SET NULL;
CREATE TABLE IF NOT EXISTS experiment_assignments (
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE, visitor_id VARCHAR(80) NOT NULL,
  variant_id UUID NOT NULL REFERENCES experiment_variants(id) ON DELETE CASCADE, assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (experiment_id, visitor_id)
);
ALTER TABLE events ADD COLUMN IF NOT EXISTS experiment_id UUID REFERENCES experiments(id) ON DELETE SET NULL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS experiment_variant VARCHAR(80);
CREATE INDEX IF NOT EXISTS experiments_status_idx ON experiments (status);
CREATE INDEX IF NOT EXISTS events_experiment_idx ON events (experiment_id, experiment_variant, created_at DESC);
