export type UserRole = "expert" | "entrepreneur" | "ngo";
export type ProfileStatus = "pending_review" | "approved" | "rejected";
export type OrganizationType = "startup" | "ngo";
export type BookingStatus = "requested" | "confirmed" | "completed" | "cancelled";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
}

export interface ExpertProfile {
  id: string;
  profile_id: string;
  headline: string;
  industries: string[];
  expertise_tags: string[];
  years_experience: number;
  former_companies: string[];
  linkedin_url: string | null;
  meeting_link: string | null;
  availability: Record<string, unknown> | null;
}

export interface SeekerProfile {
  id: string;
  profile_id: string;
  organization_name: string;
  organization_type: OrganizationType;
  website_url: string | null;
  stage: string | null;
  description: string | null;
}

export interface Booking {
  id: string;
  expert_id: string;
  seeker_id: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link: string | null;
  status: BookingStatus;
  topic: string;
  notes: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// Joined types for display
export interface ExpertWithProfile extends ExpertProfile {
  profiles: Profile;
}

export interface BookingWithDetails extends Booking {
  expert: ExpertProfile & { profiles: Profile };
  seeker: SeekerProfile & { profiles: Profile };
}
