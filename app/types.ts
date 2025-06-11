export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  year: string;
  imageUrl: string;
  logoUrl?: string;
  isDarkLogo?: boolean;
  department: string;
  mainTechnology?: string;
  projectUrl?: string;
  pageSpeed?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

export type FilterType = 'all' | 'visual' | 'website' | 'application';

export interface Comment {
  id: number;
  author_name: string;
  author_email: string;
  content: {
    rendered: string;
  };
  date: string;
  status: string;
}

export interface CommentFormData {
  author_name: string;
  author_email: string;
  content: string;
}

export interface BlogPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  slug: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
} 