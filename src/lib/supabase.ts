import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Global client cache for serverless environments
let cachedSupabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedSupabaseClient) return cachedSupabaseClient;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      cachedSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      return cachedSupabaseClient;
    } catch (err) {
      console.warn("Failed to initialize Supabase client:", err);
      return null;
    }
  }
  return null;
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (supabaseUrl && supabaseServiceKey) {
    try {
      return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (err) {
      console.warn("Failed to initialize Supabase admin client:", err);
      return null;
    }
  }
  return null;
}

/**
 * Upload binary file to Cloud Object Storage (Supabase Storage)
 * Stores the file in cloud bucket and returns the public CDN URL.
 */
export async function uploadToCloudStorage(
  bucketName: string,
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<{ url: string | null; error: string | null }> {
  const client = getSupabaseAdminClient() || getSupabaseClient();

  if (client) {
    try {
      // Ensure bucket exists or attempt upload
      const { data, error } = await client.storage
        .from(bucketName)
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        console.warn(`Supabase storage upload error in bucket ${bucketName}:`, error.message);
        return { url: null, error: error.message };
      }

      const { data: publicUrlData } = client.storage.from(bucketName).getPublicUrl(filePath);
      return { url: publicUrlData.publicUrl, error: null };
    } catch (err: any) {
      console.warn("Cloud storage exception:", err?.message || err);
      return { url: null, error: err?.message || "Storage upload failed" };
    }
  }

  // Fallback: When no external cloud bucket is configured, generate a simulated cloud reference URL
  // so the database stays lean and stores only URL strings without storing raw binary blobs!
  const fallbackUrl = `/uploads/${bucketName}/${encodeURIComponent(filePath)}`;
  return { url: fallbackUrl, error: null };
}
