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
          name: string;
          type: string;
          excerpt: string;
          description: string;
          slug: string;
          status: string;
          date_completed: string;
          role: string;
          timeline: string;
          tools: string;
          team: number;
          cover_image: string | null;
          gallery_images: string[];
          website: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          excerpt: string;
          description?: string;
          slug: string;
          status?: string;
          date_completed: string;
          role: string;
          timeline: string;
          tools: string;
          team?: number;
          cover_image?: string | null;
          gallery_images?: string[];
          website?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          excerpt?: string;
          description?: string;
          slug?: string;
          status?: string;
          date_completed?: string;
          role?: string;
          timeline?: string;
          tools?: string;
          team?: number;
          cover_image?: string | null;
          gallery_images?: string[];
          website?: string | null;
          sort_order?: number;
          created_at?: string;
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
      socials: {
        Row: {
          id: string;
          platform: string;
          url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          url?: string;
          sort_order?: number;
          created_at?: string;
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
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type WorkHistory = Database["public"]["Tables"]["work_history"]["Row"];
export type Social = Database["public"]["Tables"]["socials"]["Row"];
