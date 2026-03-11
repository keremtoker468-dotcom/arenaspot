export type Database = {
  public: {
    PostgrestVersion: "12";
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          age: number | null;
          weight_class: string | null;
          fight_style: string | null;
          record_w: number;
          record_l: number;
          record_d: number;
          is_verified: boolean;
          followers_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          age?: number | null;
          weight_class?: string | null;
          fight_style?: string | null;
          record_w?: number;
          record_l?: number;
          record_d?: number;
          is_verified?: boolean;
          followers_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          age?: number | null;
          weight_class?: string | null;
          fight_style?: string | null;
          record_w?: number;
          record_l?: number;
          record_d?: number;
          is_verified?: boolean;
          followers_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      videos: {
        Row: {
          id: string;
          athlete_id: string;
          cloudflare_video_id: string;
          title: string;
          duration: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          athlete_id: string;
          cloudflare_video_id: string;
          title: string;
          duration?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          athlete_id?: string;
          cloudflare_video_id?: string;
          title?: string;
          duration?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "videos_athlete_id_fkey";
            columns: ["athlete_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follows_following_id_fkey";
            columns: ["following_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Video = Database["public"]["Tables"]["videos"]["Row"];
export type Follow = Database["public"]["Tables"]["follows"]["Row"];
