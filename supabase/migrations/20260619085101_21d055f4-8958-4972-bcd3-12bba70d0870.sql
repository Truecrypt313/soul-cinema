
-- Extend contact_leads with attribution and mini-CRM fields
ALTER TABLE public.contact_leads
  ADD COLUMN IF NOT EXISTS referrer_domain text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS conversion_page text,
  ADD COLUMN IF NOT EXISTS device_type text,
  ADD COLUMN IF NOT EXISTS interest_package text,
  ADD COLUMN IF NOT EXISTS follow_up_at timestamptz,
  ADD COLUMN IF NOT EXISTS lead_priority text DEFAULT 'normal';

-- Lead status history table
CREATE TABLE IF NOT EXISTS public.lead_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.contact_leads(id) ON DELETE CASCADE,
  old_status text,
  new_status text NOT NULL,
  changed_by uuid,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_status_history_lead_id_idx ON public.lead_status_history(lead_id, changed_at DESC);

GRANT SELECT, INSERT ON public.lead_status_history TO authenticated;
GRANT ALL ON public.lead_status_history TO service_role;

ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read lead status history" ON public.lead_status_history;
CREATE POLICY "Admins can read lead status history"
  ON public.lead_status_history FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert lead status history" ON public.lead_status_history;
CREATE POLICY "Admins can insert lead status history"
  ON public.lead_status_history FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger: log status changes automatically
CREATE OR REPLACE FUNCTION public.log_lead_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.lead_status_history (lead_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contact_leads_status_change ON public.contact_leads;
CREATE TRIGGER contact_leads_status_change
  AFTER UPDATE OF status ON public.contact_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.log_lead_status_change();
