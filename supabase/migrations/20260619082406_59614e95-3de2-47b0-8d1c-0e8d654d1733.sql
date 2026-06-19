
-- ============ analytics_events ============
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  page_path TEXT,
  section_key TEXT,
  cta_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  visitor_hash TEXT,
  session_hash TEXT,
  device_type TEXT,
  viewport_bucket TEXT,
  browser_name TEXT,
  os_name TEXT,
  referrer_domain TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  theme TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX idx_analytics_events_event_name_created_at ON public.analytics_events (event_name, created_at DESC);
CREATE INDEX idx_analytics_events_visitor_created ON public.analytics_events (visitor_hash, created_at DESC);

GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read analytics events"
  ON public.analytics_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ analytics_settings (singleton) ============
CREATE TABLE public.analytics_settings (
  id INT PRIMARY KEY DEFAULT 1,
  analytics_enabled BOOLEAN NOT NULL DEFAULT true,
  track_page_views BOOLEAN NOT NULL DEFAULT true,
  track_cta_clicks BOOLEAN NOT NULL DEFAULT true,
  track_section_views BOOLEAN NOT NULL DEFAULT false,
  track_form_events BOOLEAN NOT NULL DEFAULT true,
  track_referrers BOOLEAN NOT NULL DEFAULT true,
  track_device BOOLEAN NOT NULL DEFAULT true,
  track_theme BOOLEAN NOT NULL DEFAULT true,
  retention_days INT NOT NULL DEFAULT 180,
  bot_filter_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT analytics_settings_singleton CHECK (id = 1)
);

GRANT SELECT, UPDATE ON public.analytics_settings TO authenticated;
GRANT ALL ON public.analytics_settings TO service_role;

ALTER TABLE public.analytics_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read analytics settings"
  ON public.analytics_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update analytics settings"
  ON public.analytics_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER analytics_settings_touch_updated_at
  BEFORE UPDATE ON public.analytics_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.analytics_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
