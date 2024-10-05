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
      point_logs: {
        Row: {
          created_at: string | null
          id: string
          point_earned: number
          projects_id: string
          user_address: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          point_earned: number
          projects_id: string
          user_address: string
        }
        Update: {
          created_at?: string | null
          id?: string
          point_earned?: number
          projects_id?: string
          user_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_logs_projects_id_fkey"
            columns: ["projects_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          id: string
          token_address: string
          token_details: Json | null
          total_points_allocated: number | null
          user_address: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          token_address: string
          token_details?: Json | null
          total_points_allocated?: number | null
          user_address: string
        }
        Update: {
          created_at?: string | null
          id?: string
          token_address?: string
          token_details?: Json | null
          total_points_allocated?: number | null
          user_address?: string
        }
        Relationships: []
      }
      voice_logs: {
        Row: {
          created_at: string | null
          id: string
          is_played: boolean | null
          project_id: string
          user_address: string
          voice_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_played?: boolean | null
          project_id: string
          user_address: string
          voice_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_played?: boolean | null
          project_id?: string
          user_address?: string
          voice_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_tapper_in_projects:
        | {
            Args: {
              user_address_input: string
            }
            Returns: {
              project_id: string
              token_address: string
              token_details: Json
              total_points: number
            }[]
          }
        | {
            Args: {
              user_address_input: string
              limit_data: number
            }
            Returns: {
              project_id: string
              token_address: string
              token_details: Json
              total_points: number
            }[]
          }
      get_tapper_info: {
        Args: {
          user_address_input: string
        }
        Returns: {
          total_points: number
          limit_left: number
          voice_left: number
          extra_points: number
          total_limit_left: number
        }[]
      }
      get_voice_logs_by_project: {
        Args: {
          projects_id_input: string
          limit_data: number
        }
        Returns: {
          id: string
          project_id: string
          user_address: string
          voice_url: string
          is_played: boolean
          created_at: string
        }[]
      }
      get_voice_logs_by_user_address: {
        Args: {
          user_address_input: string
          limit_data: number
        }
        Returns: {
          id: string
          project_id: string
          user_address: string
          voice_url: string
          is_played: boolean
          created_at: string
        }[]
      }
      is_voice_played: {
        Args: {
          voice_id_input: string
        }
        Returns: boolean
      }
      leaderboard: {
        Args: {
          projects_id_input: string
          limit_data: number
        }
        Returns: {
          user_address: string
          total_points: number
        }[]
      }
      update_voice_played: {
        Args: {
          voice_id_input: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
