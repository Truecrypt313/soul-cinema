
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.admin_exists() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC;

DROP POLICY "Anyone can submit a lead" ON public.contact_leads;
CREATE POLICY "Anyone can submit a lead"
  ON public.contact_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 200
    AND char_length(trim(email)) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(trim(message)) BETWEEN 1 AND 4000
    AND status = 'new'
  );
