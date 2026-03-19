-- Social activity feed with likes and comments
CREATE TABLE feed_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(30) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feed_events_user ON feed_events(user_id, created_at DESC);
CREATE INDEX idx_feed_events_created ON feed_events(created_at DESC);

CREATE TABLE feed_likes (
    feed_event_id UUID NOT NULL REFERENCES feed_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (feed_event_id, user_id)
);

CREATE TABLE feed_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feed_event_id UUID NOT NULL REFERENCES feed_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feed_comments ON feed_comments(feed_event_id, created_at);
