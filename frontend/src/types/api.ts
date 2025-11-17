export type Role = "admin" | "editor";

export interface User {
  id: number;
  name: string;
  email: string;
  role?: Role;
  created_at?: string;
  updated_at?: string;
}

export interface Menu {
  id: number;
  title: string;
  slug?: string;
  url?: string;
  parent_id?: number | null;
  order?: number;
  is_external?: boolean;
}

export interface Hero {
  id: number;
  title?: string;
  tagline?: string;
  banner_path?: string;
  meta?: any;
}

export interface About {
  id: number;
  mission?: string;
  vision?: string;
  history?: string;
  images?: string[];
}

export interface Notice {
  id: number;
  title: string;
  description?: string;
  publish_date?: string;
  attachment_path?: string;
  created_at?: string;
}

export interface Program {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  fees?: number;
}

export interface Gallery {
  id: number;
  title?: string;
  image_path: string;
  alt?: string;
}

export interface Teacher {
  id: number;
  name: string;
  designation?: string;
  phone?: string;
  email?: string;
  profile_path?: string;
  short_bio?: string;
}

export type Settings = Record<string, any>;
