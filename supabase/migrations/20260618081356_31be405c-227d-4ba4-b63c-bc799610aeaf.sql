ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS platform text,
  ADD COLUMN IF NOT EXISTS project_goal text,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;