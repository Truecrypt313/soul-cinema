DROP POLICY IF EXISTS "Public read portfolio media" ON storage.objects;

CREATE POLICY "Public read portfolio media"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-media');