ALTER TABLE rules ADD COLUMN IF NOT EXISTS published_snapshot JSONB;
UPDATE rules SET published_snapshot = jsonb_build_object(
  'slug', slug, 'name', name, 'priority', priority, 'enabled', enabled,
  'isFallback', is_fallback, 'expression', expression, 'content', content
) WHERE published_at IS NOT NULL AND published_snapshot IS NULL;
