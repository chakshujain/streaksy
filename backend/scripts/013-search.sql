ALTER TABLE problems ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(slug, '')), 'B')
    ) STORED;
CREATE INDEX IF NOT EXISTS idx_problems_search ON problems USING GIN(search_vector);
