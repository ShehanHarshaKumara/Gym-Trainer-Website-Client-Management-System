export type TrainerProfile = {
  id: number
  full_name: string
  title: string
  headline?: string | null
  bio: string
  experience: string
  mission?: string | null
  certifications: string[]
  skills: string[]
  phone?: string | null
  whatsapp_number?: string | null
  whatsapp_url?: string | null
  email?: string | null
  address?: string | null
  social_links: Record<string, string>
  map_embed_url?: string | null
  profile_image?: string | null
  profile_image_url?: string | null
}

export type TrainingPackage = {
  id: number
  name: string
  slug: string
  description: string
  duration: string
  sessions?: number | null
  price: string | number
  features: string[]
  benefits: string[]
  suitable_for?: string | null
  training_type?: string | null
  whatsapp_message?: string | null
  whatsapp_url?: string | null
  image?: string | null
  image_url?: string | null
  status: 'active' | 'inactive'
  sort_order: number
}

export type ClientRecord = {
  id: number
  name: string
  age?: number | null
  gender?: string | null
  phone?: string | null
  email?: string | null
  goal: string
  selected_package_id?: number | null
  joined_date: string
  notes?: string | null
  progress_notes?: string | null
  selected_package?: Pick<TrainingPackage, 'id' | 'name' | 'price'> | null
}

export type TransformationRecord = {
  id: number
  client_id?: number | null
  client?: Pick<ClientRecord, 'id' | 'name'> | null
  title: string
  before_image?: string | null
  before_image_url?: string | null
  after_image?: string | null
  after_image_url?: string | null
  duration: string
  weight_change?: string | null
  goals_achieved?: string | null
  result_description: string
  success_story?: string | null
  status: 'published' | 'draft'
  featured: boolean
}

export type FeedbackRecord = {
  id: number
  client_name: string
  rating: number
  message: string
  photo?: string | null
  photo_url?: string | null
  status: 'pending' | 'approved' | 'rejected'
  is_featured: boolean
  approved_at?: string | null
  created_at?: string
}

export type ContactMessageRecord = {
  id: number
  name: string
  phone?: string | null
  email?: string | null
  message: string
  status: 'new' | 'read' | 'archived'
  created_at?: string
}

export type DashboardPayload = {
  stats: {
    packages: number
    clients: number
    inquiries: number
    reviews: number
    pending_feedback: number
    transformations: number
  }
  recent_feedback: FeedbackRecord[]
  recent_messages: ContactMessageRecord[]
  recent_clients: ClientRecord[]
}

export type SitePayload = {
  trainer_profile: TrainerProfile | null
  packages: TrainingPackage[]
  transformations: TransformationRecord[]
  feedback: FeedbackRecord[]
  stats: {
    packages: number
    clients: number
    transformations: number
    reviews: number
  }
}

export type AdminUser = {
  id: number
  name: string
  email: string
  role: string
}
