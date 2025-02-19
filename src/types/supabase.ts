export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      days: {
        Row: {
          created_at: string
          date: string
          id: string
          order_places: string[]
          start_time: string
          timezone: string
          total_distance: number
          total_duration: number
          trip_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          order_places?: string[]
          start_time?: string
          timezone: string
          total_distance?: number
          total_duration?: number
          trip_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          order_places?: string[]
          start_time?: string
          timezone?: string
          total_distance?: number
          total_duration?: number
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "days_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          address: string | null
          created_at: string
          day_id: string
          id: string
          is_travel_manual: boolean
          lat: number
          lng: number
          name: string
          notes: string
          place_duration: number
          place_id: string
          routing_profile: Database["public"]["Enums"]["routing_profile"]
          travel_distance: number | null
          travel_duration: number | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          day_id: string
          id?: string
          is_travel_manual?: boolean
          lat: number
          lng: number
          name: string
          notes?: string
          place_duration?: number
          place_id: string
          routing_profile?: Database["public"]["Enums"]["routing_profile"]
          travel_distance?: number | null
          travel_duration?: number | null
        }
        Update: {
          address?: string | null
          created_at?: string
          day_id?: string
          id?: string
          is_travel_manual?: boolean
          lat?: number
          lng?: number
          name?: string
          notes?: string
          place_duration?: number
          place_id?: string
          routing_profile?: Database["public"]["Enums"]["routing_profile"]
          travel_distance?: number | null
          travel_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_places_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "days"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string
          current_date: string
          id: string
          is_sharing: boolean
          name: string
          sharing_id: string | null
          timezone: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_date: string
          id?: string
          is_sharing?: boolean
          name: string
          sharing_id?: string | null
          timezone: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_date?: string
          id?: string
          is_sharing?: boolean
          name?: string
          sharing_id?: string | null
          timezone?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_dates_with_places: {
        Args: {
          tripid: string
        }
        Returns: string[]
      }
      get_days_with_places:
        | {
            Args: Record<PropertyKey, never>
            Returns: string[]
          }
        | {
            Args: {
              tripid: string
            }
            Returns: string[]
          }
      get_places: {
        Args: {
          day: string
        }
        Returns: {
          address: string | null
          created_at: string
          day_id: string
          id: string
          is_travel_manual: boolean
          lat: number
          lng: number
          name: string
          notes: string
          place_duration: number
          place_id: string
          routing_profile: Database["public"]["Enums"]["routing_profile"]
          travel_distance: number | null
          travel_duration: number | null
        }[]
      }
      move_places: {
        Args: {
          day1: string
          day2: string
        }
        Returns: undefined
      }
    }
    Enums: {
      routing_profile: "driving" | "walking" | "cycling"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
