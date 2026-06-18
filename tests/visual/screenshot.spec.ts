import { test, expect, Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const RESULTS_DIR = 'visual-results';
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173';

mkdirSync(RESULTS_DIR, { recursive: true });

type ViewportPreset = {
  name: 'desktop' | 'mobile';
  width: number;
  height: number;
  isMobile?: boolean;
};

const viewports: ViewportPreset[] = [