export interface Episode {
  id: string;
  title: string;
  season: number;
  episodeNumber: number;
  description?: string;
  videoUrl: string;
  duration?: string;
  thumbnailUrl?: string;
}

export interface Movie {
  id: string;
  type: 'movie' | 'series';
  title: string;
  description: string;
  genre: string[];
  duration: string; // Movie duration or avg episode duration
  rating: number;
  year: number;
  imageUrl: string;
  videoUrl?: string; // Optional for series (uses episodes instead)
  cast: string[];
  director: string;
  episodes?: Episode[];
}

export interface SiteConfig {
  siteName: string;
  siteLogoUrl: string; // URL for the logo image
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}