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

  const checkAchievement = (count: number) => {
    const nextAchievement = PORTFOLIO_ACHIEVEMENTS
      .filter(a => count >= a.threshold && !achievedRef.current.has(a.id))
      .sort((a, b) => b.threshold - a.threshold)[0];

    if (nextAchievement) {
      achievedRef.current.add(nextAchievement.id);
      setAchievement(nextAchievement);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/portfolio?per_page=50');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        
        const formattedProjects = data.map((item: any) => ({
          id: item.id.toString(),
          title: item.title.rendered.replace(/\s*\(\d{4}\)$/, ''),
          slug: item.title.rendered
            .toLowerCase()
            .replace(/\s*\(\d{4}\)$/, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
          description: item.excerpt?.rendered || '',
          content: item.content.rendered,
          year: item.acf?.annee || 'N/A',
          imageUrl: item.acf?.image_background || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
          logoUrl: item.acf?.logo_url || '',
          isDarkLogo: item.acf?.logo_sombre === true,
          department: item.department_name || 'Other',
          mainTechnology: item.acf?.socle_technique || '',
          projectUrl: item.acf?.url_projet || '',
          pageSpeed: item.acf?.informations_pagespeed ? {
            performance: parseInt(item.acf.informations_pagespeed.performance) || 'n.a',
            accessibility: parseInt(item.acf.informations_pagespeed.accessibilite) || 'n.a',
            bestPractices: parseInt(item.acf.informations_pagespeed.bonnes) || 'n.a',
            seo: parseInt(item.acf.informations_pagespeed.seo) || 'n.a'
          } : null
        }));

        const sortedProjects = formattedProjects.sort((a, b) => {
          if (a.year === 'N/A') return 1;
          if (b.year === 'N/A') return -1;
          
          const yearA = parseInt(a.year.split(' ')[0]);
          const yearB = parseInt(b.year.split(' ')[0]);
          
          return yearB - yearA;
        });

        const uniqueDepartments = Array.from(
          new Set(
            sortedProjects
              .map(p => p.department)
              .filter(Boolean)
          )
        ).sort();

        setDepartments(uniqueDepartments);
        setProjects(sortedProjects);

        if (projectId) {
          const project = sortedProjects.find(p => p.slug === projectId);
          if (project) {
            setSelectedProject(project);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(language === 'fr' ? 'Erreur lors du chargement des projets' : 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [projectId, language]);

  useEffect(() => {
    if (selectedProject) {
      document.title = `${selectedProject.title} | Portfolio - Nicolas Gruwe`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', selectedProject.description.replace(/<[^>]*>/g, ''));
      }

      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');

      if (ogTitle) ogTitle.setAttribute('content', `${selectedProject.title} | Portfolio - Nicolas Gruwe`);
      if (ogDescription) ogDescription.setAttribute('content', selectedProject.description.replace(/<[^>]*>/g, ''));
      if (ogImage) ogImage.setAttribute('content', selectedProject.imageUrl);
      if (ogUrl) ogUrl.setAttribute('content', `https://nicolas-gruwe.fr/portfolio/${selectedProject.slug}`);

      const twitterTitle = document.querySelector('meta[property="twitter:title"]');
      const twitterDescription = document.querySelector('meta[property="twitter:description"]');
      const twitterImage = document.querySelector('meta[property="twitter:image"]');

      if (twitterTitle) twitterTitle.setAttribute('content', `${selectedProject.title} | Portfolio - Nicolas Gruwe`);
      if (twitterDescription) twitterDescription.setAttribute('content', selectedProject.description.replace(/<[^>]*>/g, ''));
      if (twitterImage) twitterImage.setAttribute('content', selectedProject.imageUrl);
    } else {
      document.title = 'Portfolio | Nicolas Gruwe';
      
      const metaTags = {
        'meta[name="description"]': 'Transform your digital vision into reality with Nicolas Gruwe. Expert Full Stack Developer specializing in innovative web solutions, user-centric design, and scalable applications.',
        'meta[property="og:title"]': 'Nicolas Gruwe | Transforming Ideas into Digital Reality',
        'meta[property="og:description"]': 'Expert Full Stack Developer with 10+ years of experience. Specializing in creating innovative, user-centric digital solutions that drive business growth.',
        'meta[property="og:image"]': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
        'meta[property="og:url"]': 'https://nicolas-gruwe/portfolio',
        'meta[property="twitter:title"]': 'Nicolas Gruwe | Creative Full Stack Developer',
        'meta[property="twitter:description"]': 'Transforming complex challenges into elegant solutions. Full Stack Developer specializing in modern web technologies and creative problem-solving.',
        'meta[property="twitter:image"]': '/img/portfolio.webp'
      };

      Object.entries(metaTags).forEach(([selector, value]) => {
        const element = document.querySelector(selector);
        if (element) element.setAttribute('content', value);
      });
    }
  }, [selectedProject]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    if (!viewedProjectsRef.current.has(project.id)) {
      viewedProjectsRef.current.add(project.id);
      checkAchievement(viewedProjectsRef.current.size);
    }
    window.history.pushState(null, '', `/portfolio/${project.slug}`);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    window.history.pushState(null, '', '/portfolio');
  };

  useEffect(() => {
    const handlePopState = () => {
      const projectSlug = location.pathname.split('/').pop();
      if (projectSlug && projectSlug !== 'portfolio') {
        const project = projects.find(p => p.slug === projectSlug);
        if (project) {
          setSelectedProject(project);
        }
      } else {
        setSelectedProject(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [projects, location]);

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (!selectedProject) return;

    const projectUrl = `https://nicolas-gruwe.fr/portfolio/${selectedProject.slug}`;
    const text = `Check out ${selectedProject.title} by Nicolas Gruwe`;

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(projectUrl)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const filteredProjects = projects.filter(project => 
    companyFilter === 'all' || project.department === companyFilter
  );

  const getDepartmentCount = (department: string) => {
    return projects.filter(project => 
      department === 'all' ? true : project.department === department
    ).length;
  };

  const renderCountBadge = (count: number, isActive: boolean) => (
    <span className={`hexagon-shape px-2 py-0.5 text-sm ${
      isActive
        ? 'bg-white/20 text-white'
        : 'bg-[#e28d1d]/20 text-[#e28d1d]'
    }`}>
      {count}
    </span>
  );

  const renderPageSpeedMetric = (value: number, label: string) => (
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-12 mb-1">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="#261939"
            strokeWidth="4"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={value >= 90 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444'}
            strokeWidth="4"
            strokeDasharray="126"
            initial={{ strokeDashoffset: 126 }}
            animate={{ strokeDashoffset: 126 - (value * 1.26) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <motion.span 
          className="absolute inset-0 flex items-center justify-center text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay: 0.2
            }}
          >
            {value}
          </motion.span>
        </motion.span>
      </div>
      <motion.span 
        className="text-xs text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {label}
      </motion.span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center bg-no-repeat p-8"
      style={{ 
        backgroundImage: 'url(/img/portfolio.webp)',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(38, 25, 57, 0.95)'
      }}>
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-8 title-neon"
        >
          Portfolio
        </motion.h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        <div className="md:hidden mb-4">
          <motion.button
            onClick={() => setIsCompanyFilterOpen(!isCompanyFilterOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#261939] text-[#e28d1d] rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-4 h-4" />
            {companyFilter === 'all' ? t('portfolio.filter.all') : companyFilter}
          </motion.button>
        </div>

        <AnimatePresence>
          {isCompanyFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-x-0 top-16 z-50 bg-[#261939] p-4 md:hidden"
            >
              <div className="flex flex-col gap-2">
                <motion.button
                  key="all"
                  onClick={() => {
                    setCompanyFilter('all');
                    setIsCompanyFilterOpen(false);
                  }}
                  className={`px-4 py-2 rounded-full text-left flex justify-between items-center ${
                    companyFilter === 'all'
                      ? 'bg-[#e28d1d] text-white'
                      : 'text-gray-300'
                  }`}
                  whileHover={{ x: 10 }}
                >
                  <span>{t('portfolio.filter.all')}</span>
                  {renderCountBadge(getDepartmentCount('all'), companyFilter === 'all')}
                </motion.button>
                {departments.map((dept) => (
                  <motion.button
                    key={dept}
                    onClick={() => {
                      setCompanyFilter(dept);
                      setIsCompanyFilterOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full text-left flex justify-between items-center ${
                      companyFilter === dept
                        ? 'bg-[#e28d1d] text-white'
                        : 'text-gray-300'
                    }`}
                    whileHover={{ x: 10 }}
                  >
                    <span>{dept}</span>
                    {renderCountBadge(getDepartmentCount(dept), companyFilter === dept)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden md:flex flex-wrap gap-4 mb-8">
          <motion.button
            key="all"
            onClick={() => setCompanyFilter('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 ${
              companyFilter === 'all'
                ? 'bg-[#e28d1d] text-white'
                : 'bg-[#261939] text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-4 h-4" />
            <span>{t('portfolio.filter.all')}</span>
            {renderCountBadge(getDepartmentCount('all'), companyFilter === 'all')}
          </motion.button>
          {departments.map((dept) => (
            <motion.button
              key={dept}
              onClick={() => setCompanyFilter(dept)}
              className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 ${
                companyFilter === dept
                  ? 'bg-[#e28d1d] text-white'
                  : 'bg-[#261939] text-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
              <span>{dept}</span>
              {renderCountBadge(getDepartmentCount(dept), companyFilter === dept)}
            </motion.button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                onClick={() => handleProjectClick(project)}
                className="group relative overflow-hidden rounded-lg cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
              >
                {renderTechBadge(project)}
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-64 object-cover transform transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#261939] via-[#261939]/60 to-transparent">
                  {project.logoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center -mt-15 portfolio_logo">
                      <div className={`absolute inset-0 ${project.isDarkLogo ? 'bg-white/60' : 'bg-black/60'}`} />
                      <img
                        src={project.logoUrl}
                        alt={`${project.title} logo`}
                        className="max-h-[32%] w-auto relative z-10 object-contain"
                        style={{ maxWidth: '50%' }}
                      />
                    </div>
                  )}
                  <div className="absolute bottom-0 p-6 z-20">
                    <h2 
                      className="text-2xl md:text-3xl font-bold text-white mb-3 text-shadow-[0_4px_8px_rgba(0,0,0,0.95)]"
                      dangerouslySetInnerHTML={{ __html: project.title }}
                    />
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-[#e28d1d] text-white rounded-full text-sm font-medium inline-flex items-center">
                        <Briefcase className="w-4 h-4 mr-1.5" />
                        {project.department}
                      </span>
                      {renderYearBadge(project.year)}
                    </div>
                    <div 
                      className="text-gray-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#261939]/95 flex items-center justify-center p-4 z-50"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#261939] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-t-xl"
                  />
                  {selectedProject.logoUrl && (
                    <div className={`absolute inset-0 flex items-center justify-center ${selectedProject.isDarkLogo ? 'light-theme' : 'dark-theme'}`}>
                      <div className={selectedProject.isDarkLogo ? 'absolute inset-0 bg-white/60' : 'absolute inset-0 bg-black/60'} />
                      <img
                        src={selectedProject.logoUrl}
                        alt={`${selectedProject.title} logo`}
                        className="max-h-[38%] w-auto relative z-10 object-contain"
                        style={{ maxWidth: '60%' }}
                      />
                    </div>
                  )}
                  {renderTechBadge(selectedProject, true)}
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                  <div className="absolute top-4 left-4 bg-[#261939] text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg border border-white/10">
                    <Calendar className="w-5 h-5" />
                    {selectedProject.year}
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare('facebook');
                      }}
                      className="p-2 bg-[#261939] text-white rounded-full hover:text-[#e28d1d] transition-colors border border-white/10"
                      title="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare('twitter');
                      }}
                      className="p-2 bg-[#261939] text-white rounded-full hover:text-[#e28d1d] transition-colors border border-white/10"
                      title="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare('linkedin');
                      }}
                      className="p-2 bg-[#261939] text-white rounded-full hover:text-[#e28d1d] transition-colors border border-white/10"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 
                      className="text-3xl font-bold text-white"
                      dangerouslySetInnerHTML={{ __html: selectedProject.title }}
                    />
                    <div className="flex gap-2 flex-wrap">
                      {selectedProject.projectUrl && (
                        <a
                          href={selectedProject.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#e28d1d] text-white rounded-full text-sm font-medium inline-flex items-center gap-1.5 hover:bg-[#e28d1d]/80 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {language === 'fr' ? 'Voir le site' : 'View website'}
                        </a>
                      )}
                    </div>
                  </div>

                  {selectedProject.pageSpeed && selectedProject.pageSpeed.performance != 'n.a' && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mt-3 mb-3 flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-[#e28d1d]" />
                        PageSpeed Insights (Au jour de livraison)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/5 p-4 rounded-lg">
                        {renderPageSpeedMetric(selectedProject.pageSpeed.performance, 'Performance')}
                        {renderPageSpeedMetric(selectedProject.pageSpeed.accessibility, 'Accessibility')}
                        {renderPageSpeedMetric(selectedProject.pageSpeed.bestPractices, 'Best Practices')}
                        {renderPageSpeedMetric(selectedProject.pageSpeed.seo, 'SEO')}
                      </div>
                    </div>
                  )}

                  <div 
                    className="prose prose-invert max-w-none portfolio-field prose-a:text-white prose-a:no-underline hover:prose-a:text-white/90 prose-li:text-white prose-li:bg-[#e28d1d] prose-li:px-3 prose-li:py-1 prose-li:rounded-full prose-li:inline-block prose-li:mr-2 prose-li:mb-2 prose-ul:list-none prose-ul:pl-0 prose-p:text-gray-300 prose-figure:mb-6 [&_figure_a]:bg-transparent [&_figure_a]:p-0 [&_.tags_a]:text-white"
                    dangerouslySetInnerHTML={{ __html: selectedProject.content }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AchievementPopup
        achievementId={achievement?.id || ''}
        isVisible={!!achievement}
        onClose={() => setAchievement(null)}
        level={achievement?.level || 1}
        icon={<Folder className="w-5 h-5 text-white" />}
      />
    </div>
  );
};