import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  full_name: string
  phone_number: string
  pin: string
  profile_image?: string
  driver_license?: string
  insurance_image?: string
  insurance_start?: string
  insurance_end?: string
  car_number: string
  is_verified: boolean
  role: 'user' | 'admin'
  created_at: string
}

export interface Claim {
  id: string
  user_id: string
  title: string
  description: string
  date: string
  accident_images: string[]
  police_report?: string
  insurance_receipt?: string
  status: 'Pending' | 'In Progress' | 'Resolved'
  progress: number
  created_at: string
  users?: User
}

export interface ClaimUpdate {
  id: string
  claim_id: string
  updated_by: string
  new_status?: string
  new_progress?: number
  note?: string
  created_at: string
}

export interface Post {
  id: string
  title: string
  content: string
  media?: string
  created_by: string
  created_at: string
  users?: User
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  users?: User
}