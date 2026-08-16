export type Lang = "id" | "en" | "zh";

export type Localized = Record<Lang, string>;

export const L = (id: string, en: string, zh: string): Localized => ({ id, en, zh });

export const tr = (value: Localized | string | undefined, lang: Lang): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || value.id || "";
};

export type ServiceCategory = "hair" | "nails" | "facial" | "spa" | "beauty";

export interface Service {
  id: string;
  name: Localized;
  description: Localized;
  category: ServiceCategory;
  price: number;
  discountPrice?: number;
  duration: number;
  image: string;
  enabled: boolean;
  featured: boolean;
  popular: boolean;
  order: number;
}

export interface Package {
  id: string;
  name: Localized;
  description: Localized;
  items: Localized[];
  price: number;
  discountPrice?: number;
  image: string;
  popular: boolean;
  enabled: boolean;
  order: number;
}

export interface Treatment {
  id: string;
  name: Localized;
  description: Localized;
  image: string;
  duration: number;
  price: number;
  enabled: boolean;
  order: number;
}

export interface Employee {
  id: string;
  name: string;
  position: Localized;
  specialty: Localized;
  bio: Localized;
  experience: number;
  services: string[];
  languages: string[];
  instagram: string;
  availability: Localized;
  photo: string;
  enabled: boolean;
  featured: boolean;
  order: number;
}

export type GalleryCategory =
  | "salon"
  | "hair"
  | "nails"
  | "facial"
  | "spa"
  | "team"
  | "interior"
  | "results";

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: Localized;
  category: GalleryCategory;
  enabled: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  rating: number;
  review: Localized;
  service: string;
  date: string;
  featured: boolean;
  enabled: boolean;
  order: number;
}

export interface Promotion {
  id: string;
  title: Localized;
  description: Localized;
  image: string;
  originalPrice?: number;
  discountPrice?: number;
  startDate: string;
  endDate: string;
  cta: Localized;
  enabled: boolean;
}

export interface DayHours {
  closed: boolean;
  periods: { open: string; close: string }[];
}

export interface Holiday {
  id: string;
  date: string;
  label: string;
  closed: boolean;
  open?: string;
  close?: string;
}

export interface OpeningHours {
  days: DayHours[]; // 0 = Sunday
  holidays: Holiday[];
}

export interface BusinessProfile {
  name: string;
  tagline: Localized;
  logoText: string;
  coverImage: string;
  heroImage: string;
  heroHeadline: Localized;
  heroSubline: Localized;
  aboutTitle: Localized;
  aboutDescription: Localized;
  aboutStory: Localized;
  aboutPhilosophy: Localized;
  aboutImage: string;
  aboutImageSecondary: string;
  experienceYears: number;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  website: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
}

export interface ThemeSettings {
  preset: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  radius: string;
  fontDisplay: string;
  buttonStyle: "pill" | "square" | "soft";
}

export interface SiteContent {
  profile: BusinessProfile;
  theme: ThemeSettings;
  hours: OpeningHours;
  services: Service[];
  packages: Package[];
  treatments: Treatment[];
  employees: Employee[];
  gallery: GalleryPhoto[];
  testimonials: Testimonial[];
  promotions: Promotion[];
}
