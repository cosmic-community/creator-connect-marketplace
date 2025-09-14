// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// User Account interface
export interface UserAccount extends CosmicObject {
  type: 'user-accounts';
  metadata: {
    email: string;
    password_hash: string;
    account_type: {
      key: 'product-creator' | 'content-creator';
      value: 'Product Creator' | 'Content Creator';
    };
    profile_reference: string;
    email_verified: boolean;
    email_verification_token: string;
    password_reset_token: string;
    last_login: string;
  };
}

// Category interface
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    category_name: string;
    description?: string;
    category_icon?: string;
    category_type: {
      key: 'industry' | 'content';
      value: 'Industry Category' | 'Content Category';
    };
  };
}

// Content Creator interface
export interface ContentCreator extends CosmicObject {
  type: 'content-creators';
  metadata: {
    creator_name: string;
    email: string;
    bio: string;
    profile_photo?: {
      url: string;
      imgix_url: string;
    };
    content_categories?: Category[];
    platform_specialties?: string[];
    follower_count_range?: {
      key: 'micro' | 'mid-tier' | 'macro' | 'mega';
      value: string;
    };
    rate_range?: {
      key: 'budget' | 'mid-range' | 'premium' | 'enterprise';
      value: string;
    };
    services_offered?: string[];
    portfolio_images?: {
      url: string;
      imgix_url: string;
    }[];
    social_media_links?: Record<string, string>;
    website_url?: string;
    location?: string;
    account_status: {
      key: 'pending' | 'verified' | 'suspended';
      value: 'Pending Verification' | 'Verified' | 'Suspended';
    };
    available_for_work: boolean;
    tags?: string;
  };
}

// Product Creator interface
export interface ProductCreator extends CosmicObject {
  type: 'product-creators';
  metadata: {
    company_name: string;
    contact_person: string;
    email: string;
    company_description: string;
    website_url?: string;
    industry_category?: Category;
    looking_for?: string[];
    budget_range?: {
      key: 'under-1k' | '1k-5k' | '5k-10k' | '10k-25k' | '25k-plus';
      value: string;
    };
    project_type?: {
      key: 'product-launch' | 'brand-awareness' | 'content-series' | 'review-campaign' | 'ongoing-partnership';
      value: string;
    };
    company_logo?: {
      url: string;
      imgix_url: string;
    };
    phone_number?: string;
    location?: string;
    account_status: {
      key: 'pending' | 'verified' | 'suspended';
      value: 'Pending Verification' | 'Verified' | 'Suspended';
    };
    tags?: string;
  };
}

// Message interface
export interface Message extends CosmicObject {
  type: 'messages';
  metadata: {
    from_product_creator?: ProductCreator;
    to_content_creator?: ContentCreator;
    subject: string;
    message_content: string;
    message_status: {
      key: 'sent' | 'read' | 'replied';
      value: 'Sent' | 'Read' | 'Replied';
    };
    email_sent: boolean;
    reply_to_message?: Message;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
}

// Type literals for dropdown values
export type AccountType = 'product-creator' | 'content-creator';
export type AccountStatus = 'pending' | 'verified' | 'suspended';
export type MessageStatus = 'sent' | 'read' | 'replied';
export type CategoryType = 'industry' | 'content';

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  accountType: AccountType;
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  accountType: AccountType;
  profileReference?: string;
}

// Form data types
export interface ContactFormData {
  subject: string;
  message: string;
  fromId: string;
  toId: string;
}

// Search and filter types
export interface SearchFilters {
  keyword?: string;
  category?: string;
  budgetRange?: string;
  followerRange?: string;
  services?: string[];
  platforms?: string[];
  location?: string;
  available?: boolean;
}