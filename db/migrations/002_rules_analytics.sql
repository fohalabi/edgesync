CREATE TABLE IF NOT EXISTS rules (
  id UUID PRIMARY KEY, slug VARCHAR(120) NOT NULL UNIQUE, name VARCHAR(160) NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0, enabled BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_fallback BOOLEAN NOT NULL DEFAULT FALSE, expression JSONB NOT NULL, content JSONB NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), published_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS rule_versions (
  id BIGSERIAL PRIMARY KEY, rule_id UUID NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
  version INTEGER NOT NULL, snapshot JSONB NOT NULL, created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE (rule_id, version)
);
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY, event_type VARCHAR(40) NOT NULL CHECK (event_type IN ('impression', 'conversion')),
  visitor_id VARCHAR(80) NOT NULL, rule_id VARCHAR(120), variant_id VARCHAR(160), goal VARCHAR(120),
  country VARCHAR(8), device VARCHAR(20), language VARCHAR(16), referrer VARCHAR(30), network VARCHAR(30),
  latency_ms INTEGER, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS rules_published_priority_idx ON rules (priority DESC) WHERE status = 'published' AND enabled = TRUE;
CREATE INDEX IF NOT EXISTS rule_versions_rule_idx ON rule_versions (rule_id, version DESC);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events (created_at DESC);
CREATE INDEX IF NOT EXISTS events_rule_created_idx ON events (rule_id, created_at DESC);
CREATE INDEX IF NOT EXISTS events_visitor_created_idx ON events (visitor_id, created_at DESC);
