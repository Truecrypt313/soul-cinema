
CREATE POLICY "Admins upload portfolio media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update portfolio media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete portfolio media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins read portfolio media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(),'admin'));
