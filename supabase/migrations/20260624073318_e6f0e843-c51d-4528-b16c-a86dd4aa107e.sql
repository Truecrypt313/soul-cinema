
CREATE TABLE public.creative_styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  image_url text,
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.creative_styles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.creative_styles TO authenticated;
GRANT ALL ON public.creative_styles TO service_role;
ALTER TABLE public.creative_styles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible creative_styles" ON public.creative_styles FOR SELECT USING (visible = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage creative_styles" ON public.creative_styles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_creative_styles_updated BEFORE UPDATE ON public.creative_styles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
