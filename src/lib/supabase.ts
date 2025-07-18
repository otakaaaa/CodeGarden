import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log(supabaseUrl)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          data: Record<string, unknown>;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          data?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          data?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
          is_deleted?: boolean;
        };
      };
    };
  };
};