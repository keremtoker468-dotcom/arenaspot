export type UserRole = "athlete" | "fan" | "gym" | "pt";
export type ConversationType = "sparring" | "job_offer" | "general";

export type Database = {
  public: {
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
          role: UserRole;
          fight_style: string | null;
          weight_class: string | null;
          record_w: number;
          record_l: number;
          record_d: number;
          gym_name: string | null;
          workplace: string | null;
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
          role?: UserRole;
          fight_style?: string | null;
          weight_class?: string | null;
          record_w?: number;
          record_l?: number;
          record_d?: number;
          gym_name?: string | null;
          workplace?: string | null;
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
          role?: UserRole;
          fight_style?: string | null;
          weight_class?: string | null;
          record_w?: number;
          record_l?: number;
          record_d?: number;
          gym_name?: string | null;
          workplace?: string | null;
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
          thumbnail_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          athlete_id: string;
          cloudflare_video_id: string;
          title: string;
          duration?: number | null;
          thumbnail_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          athlete_id?: string;
          cloudflare_video_id?: string;
          title?: string;
          duration?: number | null;
          thumbnail_url?: string | null;
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
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          participant_1: string;
          participant_2: string;
          type: ConversationType;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_1: string;
          participant_2: string;
          type?: ConversationType;
          created_at?: string;
        };
        Update: {
          id?: string;
          participant_1?: string;
          participant_2?: string;
          type?: ConversationType;
          created_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      conversation_type: ConversationType;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Video = Database["public"]["Tables"]["videos"]["Row"];
export type Follow = Database["public"]["Tables"]["follows"]["Row"];
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
