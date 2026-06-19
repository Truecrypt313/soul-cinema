
CREATE TABLE public.lead_notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.contact_leads(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'new_lead_email',
  recipient_email text,
  status text NOT NULL,
  provider text NOT NULL DEFAULT 'strato_smtp',
  error_message text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.lead_notification_logs TO authenticated;
GRANT ALL  ON public.lead_notification_logs TO service_role;

ALTER TABLE public.lead_notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read notification logs"
  ON public.lead_notification_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX lead_notification_logs_lead_id_idx ON public.lead_notification_logs(lead_id);
CREATE INDEX lead_notification_logs_created_at_idx ON public.lead_notification_logs(created_at DESC);
