import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Filter, Briefcase, Calendar, Share2, Facebook, Twitter, 
  Linkedin, Folder, ExternalLink, Gauge, Code
} from 'lucide-react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import type { Project } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { AchievementPopup } from '../components/AchievementPopup';

interface Achievement {
  id: string;
  threshold: number;
  level: number;
}

const PORTFOLIO_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'portfolio-novice',
    threshold: 1,
    level: 1
  },
  {
    id: 'portfolio-explorer',
    threshold: 3,
    level: 2
  },
  {
    id: 'portfolio-enthusiast',
    threshold: 5,
    level: 3
  },
  {
    id: 'portfolio-connoisseur',
    threshold: 10,
    level: 4
  },
  {
    id: 'portfolio-master',
    threshold: 20,
    level: 5
  }
];

const renderYearBadge = (year: string) => (
  <span className="px-2 py-1 bg-[#261939] text-white rounded-full text-xs font-medium inline-flex items-center border border-white/10">
    <Calendar className="w-3 h-3 mr-1" />
    {year}
  </span>
);

const renderTechBadge = (project: Project, isSelected: boolean = false) => {
  if (!project.mainTechnology) return null;

  return (
    <div className={`absolute ${isSelected ? 'bottom-4' : 'top-4'} left-4 z-30`}>
      <div className="px-3 py-1.5 bg-[#261939]/80 backdrop-blur-sm text-gray-300 tech-badge-clip flex items-center gap-1.5 hover:border-[#e28d1d]/30 transition-colors shadow-[0_0_5px_rgba(59,130,246,0.5),0_0_10px_rgba(59,130,246,0.3)]">
        <Code className="w-3.5 h-3.5 text-[#e28d1d] tech-badge-icon" />
        <span className="text-xs font-medium">{project.mainTechnology}</span>
      </div>
    </div>
  );
};

export const Portfolio: React.FC = () => {
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCompanyFilterOpen, setIsCompanyFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const viewedProjectsRef = useRef(new Set<string>());
  const achievedRef = useRef(new Set<string>());
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();
  const { t, language } = useLanguage();

  useEffect(() => {
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      const baseUrl = 'https://nicolas-gruwe.fr/portfolio';
      const url = projectId ? `${baseUrl}/${projectId}` : baseUrl;
      canonicalLink.setAttribute('href', url);
    }
  }, [projectId]);

  useEffect(() => {
    // Only update meta tags if no specific project is selected
    if (!selectedProject) {
      const title = language === 'fr' 
        ? 'Projets Web Réalisés – WordPress, React, VueJS'
        : 'Completed Web Projects – WordPress, React, VueJS';
      
      const description = language === 'fr'
        ? 'Projets développés en freelance, en entreprise ou en side project : sites WordPress, interfaces JS modernes et performantes.'
        : 'Projects developed freelance, professionally or as side projects: WordPress sites, modern and performant JS interfaces.';
      
      const ogTitle = language === 'fr'
        ? 'Mes Réalisations Web – Projets Freelance & Perso'
        : 'My Web Projects – Freelance & Personal Work';
      
      const ogDescription = language === 'fr'
        ? 'Parcourez des projets menés avec rigueur : développement sur mesure en WordPress, React, VueJS.'
        : 'Browse rigorously executed projects: custom development in WordPress, React, and VueJS.';

      document.title = title;
      
      const metaTags = {
        'meta[name="description"]': description,
        'meta[property="og:title"]': ogTitle,
        'meta[property="og:description"]': ogDescription,
        'meta[property="twitter:title"]': ogTitle,
        'meta[property="twitter:description"]': ogDescription,
        'link[rel="canonical"]': 'https://nicolas-gruwe.fr/portfolio'
      };

      Object.entries(metaTags).forEach(([selector, content]) => {
        const element = document.querySelector(selector);
        if (element) {
          if (selector === 'link[rel="canonical"]') {
            element.setAttribute('href', content);
          } else {
            element.setAttribute('content', content);
          }
        }
      });
    }
  }, [language, selectedProject]);

  // Rest of the component remains unchanged
  return (
    // Existing JSX remains unchanged
  );
};