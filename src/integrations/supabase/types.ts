export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          browser_name: string | null
          created_at: string
          cta_id: string | null
          device_type: string | null
          event_name: string
          id: string
          metadata: Json
          os_name: string | null
          page_path: string | null
          referrer_domain: string | null
          section_key: string | null
          session_hash: string | null
          theme: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          viewport_bucket: string | null
          visitor_hash: string | null
        }
        Insert: {
          browser_name?: string | null
          created_at?: string
          cta_id?: string | null
          device_type?: string | null
          event_name: string
          id?: string
          metadata?: Json
          os_name?: string | null
          page_path?: string | null
          referrer_domain?: string | null
          section_key?: string | null
          session_hash?: string | null
          theme?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          viewport_bucket?: string | null
          visitor_hash?: string | null
        }
        Update: {
          browser_name?: string | null
          created_at?: string
          cta_id?: string | null
          device_type?: string | null
          event_name?: string
          id?: string
          metadata?: Json
          os_name?: string | null
          page_path?: string | null
          referrer_domain?: string | null
          section_key?: string | null
          session_hash?: string | null
          theme?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          viewport_bucket?: string | null
          visitor_hash?: string | null
        }
        Relationships: []
      }
      analytics_settings: {
        Row: {
          analytics_enabled: boolean
          bot_filter_enabled: boolean
          id: number
          retention_days: number
          track_cta_clicks: boolean
          track_device: boolean
          track_form_events: boolean
          track_page_views: boolean
          track_referrers: boolean
          track_section_views: boolean
          track_theme: boolean
          updated_at: string
        }
        Insert: {
          analytics_enabled?: boolean
          bot_filter_enabled?: boolean
          id?: number
          retention_days?: number
          track_cta_clicks?: boolean
          track_device?: boolean
          track_form_events?: boolean
          track_page_views?: boolean
          track_referrers?: boolean
          track_section_views?: boolean
          track_theme?: boolean
          updated_at?: string
        }
        Update: {
          analytics_enabled?: boolean
          bot_filter_enabled?: boolean
          id?: number
          retention_days?: number
          track_cta_clicks?: boolean
          track_device?: boolean
          track_form_events?: boolean
          track_page_views?: boolean
          track_referrers?: boolean
          track_section_views?: boolean
          track_theme?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      audience_items: {
        Row: {
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          sort_order?: number
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      contact_leads: {
        Row: {
          budget: string | null
          company: string | null
          conversion_page: string | null
          created_at: string
          device_type: string | null
          email: string
          follow_up_at: string | null
          id: string
          interest_package: string | null
          internal_notes: string | null
          landing_page: string | null
          lead_priority: string | null
          message: string
          name: string
          phone: string | null
          product_type: string | null
          product_url: string | null
          project_goal: string | null
          referrer_domain: string | null
          status: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          budget?: string | null
          company?: string | null
          conversion_page?: string | null
          created_at?: string
          device_type?: string | null
          email: string
          follow_up_at?: string | null
          id?: string
          interest_package?: string | null
          internal_notes?: string | null
          landing_page?: string | null
          lead_priority?: string | null
          message: string
          name: string
          phone?: string | null
          product_type?: string | null
          product_url?: string | null
          project_goal?: string | null
          referrer_domain?: string | null
          status?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          budget?: string | null
          company?: string | null
          conversion_page?: string | null
          created_at?: string
          device_type?: string | null
          email?: string
          follow_up_at?: string | null
          id?: string
          interest_package?: string | null
          internal_notes?: string | null
          landing_page?: string | null
          lead_priority?: string | null
          message?: string
          name?: string
          phone?: string | null
          product_type?: string | null
          product_url?: string | null
          project_goal?: string | null
          referrer_domain?: string | null
          status?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      lead_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          lead_id: string
          new_status: string
          old_status: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          lead_id: string
          new_status: string
          old_status?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          lead_id?: string
          new_status?: string
          old_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_status_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "contact_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          featured: boolean
          format_badge: string | null
          id: string
          platform: string | null
          project_goal: string | null
          published: boolean
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          format_badge?: string | null
          id?: string
          platform?: string | null
          project_goal?: string | null
          published?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          format_badge?: string | null
          id?: string
          platform?: string | null
          project_goal?: string | null
          published?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      pricing_packages: {
        Row: {
          created_at: string
          cta_label: string | null
          description: string | null
          features: Json
          highlighted: boolean
          id: string
          name: string
          price_label: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          description?: string | null
          features?: Json
          highlighted?: boolean
          id?: string
          name: string
          price_label: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          description?: string | null
          features?: Json
          highlighted?: boolean
          id?: string
          name?: string
          price_label?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      process_steps: {
        Row: {
          created_at: string
          description: string | null
          id: string
          sort_order: number
          step_number: string | null
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          step_number?: string | null
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          step_number?: string | null
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      reasons: {
        Row: {
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          sort_order?: number
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          sort_order: number
          tagline: string | null
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          sort_order?: number
          tagline?: string | null
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          sort_order?: number
          tagline?: string | null
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          id: string
          name: string
          quote: string
          rating: number
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          name: string
          quote: string
          rating?: number
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          name?: string
          quote?: string
          rating?: number
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
      claim_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
