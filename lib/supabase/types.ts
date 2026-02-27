export type Database = {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          looking_for_work: boolean;
          about: string | null;
          years_exp: number;
          project_count: number;
          client_count: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          looking_for_work?: boolean;
          about?: string | null;
          years_exp: number;
          project_count: number;
          client_count: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          looking_for_work?: boolean;
          about?: string | null;
          years_exp?: number;
          project_count?: number;
          client_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      stats: {
        Row: {
          id: string;
          value: string;
          label: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          value: string;
          label: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          value?: string;
          label?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          id: string;
          date_range: string;
          role: string;
          company: string;
          description: string;
          url: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          date_range: string;
          role: string;
          company: string;
          description: string;
          url?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          date_range?: string;
          role?: string;
          company?: string;
          description?: string;
          url?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          type: string;
          skill: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          type: string;
          skill: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          type?: string;
          skill?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          tag: string;
          title: string;
          description: string;
          image_url: string | null;
          gradient: string;
          url: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          tag: string;
          title: string;
          description: string;
          image_url?: string | null;
          gradient?: string;
          url?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          tag?: string;
          title?: string;
          description?: string;
          image_url?: string | null;
          gradient?: string;
          url?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          url: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          platform: string;
          url: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          platform?: string;
          url?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      work_history: {
        Row: {
          id: string;
          job_title: string;
          job_description: string;
          employer: string;
          start_date: string;
          end_date: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          job_title: string;
          job_description: string;
          employer: string;
          start_date: string;
          end_date?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          job_title?: string;
          job_description?: string;
          employer?: string;
          start_date?: string;
          end_date?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
  };
};

// Convenience row types
export type Profile = Database["public"]["Tables"]["profile"]["Row"];
export type Stat = Database["public"]["Tables"]["stats"]["Row"];
export type Experience = Database["public"]["Tables"]["experiences"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];
export type WorkHistory = Database["public"]["Tables"]["work_history"]["Row"];
