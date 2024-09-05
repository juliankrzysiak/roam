export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      days: {
        Row: {
          created_at: string;
          date: string;
          id: string;
          order_places: string[];
          start_time: string;
          timezone: string;
          trip_id: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          id?: string;
          order_places?: string[];
          start_time?: string;
          timezone: string;
          trip_id: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          id?: string;
          order_places?: string[];
          start_time?: string;
          timezone?: string;
          trip_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "days_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      places: {
        Row: {
          address: string | null;
          created_at: string;
          day_id: string;
          id: string;
          lat: number;
          lng: number;
          name: string;
          notes: string;
          place_duration: number;
          place_id: string;
          sharing: boolean;
          trip_duration: number;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          day_id: string;
          id?: string;
          lat: number;
          lng: number;
          name: string;
          notes?: string;
          place_duration?: number;
          place_id: string;
          sharing?: boolean;
          trip_duration?: number;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          day_id?: string;
          id?: string;
          lat?: number;
          lng?: number;
          name?: string;
          notes?: string;
          place_duration?: number;
          place_id?: string;
          sharing?: boolean;
          trip_duration?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_places_day_id_fkey";
            columns: ["day_id"];
            isOneToOne: false;
            referencedRelation: "days";
            referencedColumns: ["id"];
          },
        ];
      };
      trips: {
        Row: {
          created_at: string;
          current_date: string;
          id: string;
          name: string;
          sharing: boolean;
          sharing_id: string | null;
          timezone: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          current_date: string;
          id?: string;
          name: string;
          sharing?: boolean;
          sharing_id?: string | null;
          timezone: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          current_date?: string;
          id?: string;
          name?: string;
          sharing?: boolean;
          sharing_id?: string | null;
          timezone?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_dates_with_places: {
        Args: {
          tripid: string;
        };
        Returns: string[];
      };
      get_days_with_places:
        | {
            Args: Record<PropertyKey, never>;
            Returns: string[];
          }
        | {
            Args: {
              tripid: string;
            };
            Returns: string[];
          };
      get_places: {
        Args: {
          day: string;
        };
        Returns: {
          address: string | null;
          created_at: string;
          day_id: string;
          id: string;
          lat: number;
          lng: number;
          name: string;
          notes: string;
          place_duration: number;
          place_id: string;
          sharing: boolean;
          trip_duration: number;
        }[];
      };
      move_places: {
        Args: {
          day1: string;
          day2: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

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
  : never;
