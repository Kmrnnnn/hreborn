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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          recommendation_type: string
          resource_ids: string[] | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recommendation_type: string
          resource_ids?: string[] | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recommendation_type?: string
          resource_ids?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          calories_burned: number | null
          distance_km: number | null
          duration_minutes: number
          exercise_name: string
          exercise_type: string
          id: string
          logged_at: string
          notes: string | null
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          distance_km?: number | null
          duration_minutes: number
          exercise_name: string
          exercise_type: string
          id?: string
          logged_at?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          distance_km?: number | null
          duration_minutes?: number
          exercise_name?: string
          exercise_type?: string
          id?: string
          logged_at?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_records: {
        Row: {
          body_fat_percentage: number | null
          calories_burned: number | null
          calories_consumed: number | null
          created_at: string
          id: string
          notes: string | null
          record_date: string
          sleep_hours: number | null
          steps: number | null
          user_id: string
          water_intake_ml: number | null
          weight_kg: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          calories_burned?: number | null
          calories_consumed?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          record_date?: string
          sleep_hours?: number | null
          steps?: number | null
          user_id: string
          water_intake_ml?: number | null
          weight_kg?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          calories_burned?: number | null
          calories_consumed?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          record_date?: string
          sleep_hours?: number | null
          steps?: number | null
          user_id?: string
          water_intake_ml?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      health_resources: {
        Row: {
          address: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          phone: string | null
          rating: number | null
          review_count: number | null
          tags: string[] | null
          website: string | null
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          tags?: string[] | null
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          tags?: string[] | null
          website?: string | null
        }
        Relationships: []
      }
      meal_logs: {
        Row: {
          calories: number | null
          carbs_g: number | null
          fat_g: number | null
          id: string
          logged_at: string
          meal_name: string
          meal_type: string | null
          notes: string | null
          protein_g: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          id?: string
          logged_at?: string
          meal_name: string
          meal_type?: string | null
          notes?: string | null
          protein_g?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          id?: string
          logged_at?: string
          meal_name?: string
          meal_type?: string | null
          notes?: string | null
          protein_g?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          current_weight_kg: number | null
          dietary_preference: string | null
          full_name: string | null
          gender: string | null
          health_goal: string | null
          height_cm: number | null
          id: string
          target_weight_kg: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_level?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          current_weight_kg?: number | null
          dietary_preference?: string | null
          full_name?: string | null
          gender?: string | null
          health_goal?: string | null
          height_cm?: number | null
          id?: string
          target_weight_kg?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_level?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          current_weight_kg?: number | null
          dietary_preference?: string | null
          full_name?: string | null
          gender?: string | null
          health_goal?: string | null
          height_cm?: number | null
          id?: string
          target_weight_kg?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "health_resources"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
