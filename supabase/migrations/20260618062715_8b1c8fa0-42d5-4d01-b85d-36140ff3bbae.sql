
-- Generic updated_at trigger already exists as public.touch_updated_at()

-- 1) services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text,
  title text NOT NULL,
  tagline text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible services" ON public.services FOR SELECT USING (visible = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 2) process_steps
CREATE TABLE public.process_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number text,
  title text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.process_steps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.process_steps TO authenticated;
GRANT ALL ON public.process_steps TO service_role;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible steps" ON public.process_steps FOR SELECT USING (visible = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage steps" ON public.process_steps FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_steps_updated BEFORE UPDATE ON public.process_steps FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3) reasons
CREATE TABLE public.reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text,
  title text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reasons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reasons TO authenticated;
GRANT ALL ON public.reasons TO service_role;
ALTER TABLE public.reasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible reasons" ON public.reasons FOR SELECT USING (visible = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage reasons" ON public.reasons FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_reasons_updated BEFORE UPDATE ON public.reasons FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 4) audience_items
CREATE TABLE public.audience_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text,
  title text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audience_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audience_items TO authenticated;
GRANT ALL ON public.audience_items TO service_role;
ALTER TABLE public.audience_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible audience" ON public.audience_items FOR SELECT USING (visible = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage audience" ON public.audience_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_audience_updated BEFORE UPDATE ON public.audience_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 5) pricing_packages
CREATE TABLE public.pricing_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price_label text NOT NULL,
  description text,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta_label text,
  highlighted boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pricing_packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing_packages TO authenticated;
GRANT ALL ON public.pricing_packages TO service_role;
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible packages" ON public.pricing_packages FOR SELECT USING (visible = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage packages" ON public.pricing_packages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_packages_updated BEFORE UPDATE ON public.pricing_packages FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 6) faq_items
CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faq_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faq_items TO authenticated;
GRANT ALL ON public.faq_items TO service_role;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible faq" ON public.faq_items FOR SELECT USING (visible = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage faq" ON public.faq_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_faq_updated BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 7) testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  avatar_url text,
  quote text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  visible boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible testimonials" ON public.testimonials FOR SELECT USING (visible = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed: services
INSERT INTO public.services (icon_name, title, tagline, description, sort_order) VALUES
('Film','Produktvideos','Hochwertig in Szene gesetzt','Kinoreife Produktvideos für Shops, Landingpages und Markenauftritte.',10),
('Megaphone','Social Ads','Performance-Creatives','Hook-getriebene Video-Ads für Meta, TikTok und YouTube.',20),
('Layers','Launch Creatives','Für Produkt-Launches','Kampagnen-Creatives mit mehreren Hooks und Formaten für A/B-Tests.',30),
('Smartphone','SaaS & App Videos','Digitale Produkte sichtbar machen','Erklär- und Promo-Videos für Apps, Tools und Software.',40),
('ShoppingBag','E-Commerce Reels','Conversion im Fokus','Short-Form-Videos für Produktseiten, Shops und Marken-Feeds.',50),
('Package','Content Pakete','Kontinuierlicher Output','Monatliche Pakete für Marken, die regelmäßig neuen Video-Content brauchen.',60);

-- Seed: process_steps
INSERT INTO public.process_steps (step_number, title, description, sort_order) VALUES
('01','Analyse','Wir prüfen Produkt, Zielgruppe und Plattform und definieren das Ziel des Videos.',10),
('02','Konzept','Hook, Storyboard und Format werden auf den Einsatzkanal abgestimmt.',20),
('03','Produktion','Aus Produktbildern, vorhandenem Material oder einem Produktlink entsteht das Video.',30),
('04','Schnitt & Sound','Cut, Sounddesign, Musik und Branding werden finalisiert.',40),
('05','Lieferung','Sie erhalten fertige Dateien für Social Media, Ads, Landingpages oder Shops.',50);

-- Seed: reasons
INSERT INTO public.reasons (icon_name, title, description, sort_order) VALUES
('Target','Produktverständnis','Wir analysieren Produkt, Zielgruppe und Plattform, bevor ein Creative entsteht.',10),
('Sparkles','Ad-orientierte Konzepte','Jedes Video wird mit Hook, Format und Einsatzkanal entwickelt.',20),
('Zap','Schneller Start','Produktbilder, vorhandenes Material oder ein Produktlink reichen für die erste Einschätzung aus.',30),
('Smartphone','Für Social Media gemacht','Videos werden für mobile Formate, kurze Aufmerksamkeitsspannen und klare Botschaften entwickelt.',40),
('Layers','Mehrere Varianten möglich','Auf Wunsch entstehen verschiedene Hooks, Formate und Versionen für Kampagnen und Tests.',50),
('PackageCheck','Klare Lieferung','Sie erhalten fertige Dateien für Social Media, Ads, Landingpages oder Shops.',60);

-- Seed: audience_items
INSERT INTO public.audience_items (icon_name, title, description, sort_order) VALUES
('ShoppingCart','E-Commerce Shops','Für Shopify-, WooCommerce- und Amazon-Brands.',10),
('Package','Physische Produkte','Beauty, Food, Fashion, Lifestyle und Consumer Goods.',20),
('Cloud','Digitale Produkte','Online-Kurse, Downloads, Memberships, Templates.',30),
('Smartphone','SaaS & Apps','Tools, Plattformen und Mobile Apps.',40),
('Rocket','Produktlaunches','Neue Produkte, Drops und Kampagnen.',50),
('Megaphone','Social Ads','Performance-Creatives für Meta, TikTok, YouTube.',60),
('Building2','Marken & Startups','Wachstumsorientierte Brands mit Anspruch.',70);

-- Seed: pricing_packages
INSERT INTO public.pricing_packages (name, price_label, description, features, cta_label, highlighted, sort_order) VALUES
('Starter','ab 790 €','Erstes Produktvideo oder Social Ad','["1 Produktvideo / Ad","Hook & Konzept","Lieferung als MP4","1 Korrekturschleife"]','Projekt anfragen', false, 10),
('Professional','ab 1.890 €','Kampagnen-Paket mit mehreren Varianten','["3 Video-Varianten","Mehrere Hooks","Plattform-Cuts (9:16, 1:1, 16:9)","2 Korrekturschleifen","Sounddesign & Musik"]','Projekt anfragen', true, 20),
('Brand Suite','auf Anfrage','Laufender Content für Marken','["Monatliche Produktion","Content-Strategie","Skalierbare Hooks","Priority Support","Eigener Ansprechpartner"]','Gespräch anfragen', false, 30);

-- Seed: faq_items
INSERT INTO public.faq_items (question, answer, sort_order) VALUES
('Was brauche ich für ein Projekt?','Produktbilder, vorhandenes Material oder ein Produktlink reichen für eine erste Einschätzung. Alles weitere klären wir gemeinsam.',10),
('Wie lange dauert ein Video?','Ein einzelnes Video typischerweise 1–2 Wochen, Kampagnen-Pakete entsprechend länger. Wir nennen dir vorab einen konkreten Zeitplan.',20),
('Für welche Plattformen produziert ihr?','Meta (Instagram, Facebook), TikTok, YouTube Shorts, Shop-Seiten, Landingpages und Brand-Channels.',30),
('Macht ihr auch laufenden Content?','Ja, mit dem Brand-Suite-Paket übernehmen wir die kontinuierliche Produktion neuer Creatives.',40),
('Was kostet ein Video?','Einstiegspreise findest du in unseren Paketen. Den finalen Preis nennen wir nach einem kurzen Briefing.',50);

-- Seed: site_settings
INSERT INTO public.site_settings (key, value) VALUES
('hero_video_url', '"https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm"'::jsonb),
('hero_badge', '"Ad Studio für Produktvideos & Social Ads"'::jsonb),
('hero_headline', '"Dein Produkt. Kinoreif in Szene gesetzt."'::jsonb),
('hero_subline', '"Wir entwickeln Produktvideos und Social Ads für digitale und physische Produkte – aus Produktbildern, vorhandenem Material oder einem Produktlink."'::jsonb),
('hero_secondary_line', '"Für Shops, Brands, digitale Produkte und Kampagnen, die online sichtbar werden sollen."'::jsonb),
('hero_bullets', '["Produktbilder oder Produktlink reichen aus","Für digitale & physische Produkte","Für Social Ads, Shops & Landingpages","Konzept, Produktion & Lieferung aus einer Hand"]'::jsonb),
('primary_cta_label', '"Projekt anfragen"'::jsonb),
('secondary_cta_label', '"Portfolio ansehen"'::jsonb),
('contact_email', '"hallo@soulcinema.de"'::jsonb),
('whatsapp_number', '""'::jsonb),
('calendly_url', '""'::jsonb),
('seo_title', '"Soul Cinema — Produktvideos, Werbevideos & Social Ads"'::jsonb),
('seo_description', '"Soul Cinema ist ein Ad Studio für Produktvideos, Werbevideos und Social Ads – für digitale und physische Produkte."'::jsonb),
('og_title', '"Soul Cinema — Produktvideos & Social Ads"'::jsonb),
('og_description', '"Kinoreife Produktvideos und Social Ads für Marken, Shops und digitale Produkte."'::jsonb),
('og_image_url', '"https://www.soulcinema.de/og-image.jpg"'::jsonb),
('footer_text', '"Soul Cinema — Ad Studio für Produktvideos & Social Ads."'::jsonb),
('admin_setup_code', '"SOULCINEMA-SETUP"'::jsonb)
ON CONFLICT (key) DO NOTHING;
