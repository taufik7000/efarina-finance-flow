
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          role: string
          department: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          role: string
          department: string
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          role?: string
          department?: string
          status?: string
        }
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          date: string
          description: string
          category: string
          amount: number
          type: 'income' | 'expense'
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          date: string
          description: string
          category: string
          amount: number
          type: 'income' | 'expense'
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          date?: string
          description?: string
          category?: string
          amount?: number
          type?: 'income' | 'expense'
          user_id?: string
        }
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
  }
}
