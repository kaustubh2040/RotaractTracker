import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads a file to Supabase Storage
 * @param file The file object from input
 * @param bucket The bucket name (default: actra_assets)
 * @param path The folder path inside the bucket
 */
export const uploadFile = async (file: File, folder: string): Promise<string | null> => {
  if (!supabase) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('actra_assets')
    .upload(filePath, file);

  if (error) {
    console.error('Upload error:', error.message);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('actra_assets')
    .getPublicUrl(filePath);

  return publicUrl;
};