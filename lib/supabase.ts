
/**
 * SUPABASE CONFIGURATION
 * To use a real database:
 * 1. Create a project at supabase.com
 * 2. Add SUPABASE_URL and SUPABASE_ANON_KEY to your Vercel Environment Variables.
 */

export const SUPABASE_CONFIG = {
  url: (window as any).process?.env?.SUPABASE_URL || '',
  key: (window as any).process?.env?.SUPABASE_ANON_KEY || '',
};

export const isDatabaseConfigured = () => {
  return SUPABASE_CONFIG.url.length > 0 && SUPABASE_CONFIG.key.length > 0;
};
