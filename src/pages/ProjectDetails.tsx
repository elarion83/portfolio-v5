import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Project } from '../types';

export const ProjectDetails: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`https://portfolio.deussearch.fr/wp-json/wp/v2/portfolio/${projectId}`);
        if (!response.ok) {
          throw new Error('Project not found');
        }
        const data = await response.json();
        
        const formattedProject = {
          id: data.id.toString(),
          title: data.title.rendered.replace(/\s*\(\d{4}\)$/, ''),
          description: data.excerpt?.rendered || '',
          content: data.content.rendered,
          year: data.acf?.annee || 'N/A',
          imageUrl: data.acf?.image_background || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
          logoUrl: data.acf?.logo_url || '',
          isDarkLogo: data.acf?.logo_sombre === true,
          department: data.department_name || 'Other'
        };

        setProject(formattedProject);
        
        // Update document title
        document.title = `${formattedProject.title} | Portfolio - Nicolas Gruwe`;
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Project not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#261939]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-[#e28d1d] hover:text-[#e28d1d]/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#261939]"
    >
      <div className="relative">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-[40vh] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#261939]" />
        
        {project.logoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`absolute inset-0 ${project.isDarkLogo ? 'bg-white/60' : 'bg-black/60'}`} />
            <img
              src={project.logoUrl}
              alt={`${project.title} logo`}
              className="max-h-[38%] w-auto relative z-10 object-contain"
              style={{ maxWidth: '60%' }}
            />
          </div>
        )}
        
        <button
          onClick={() => navigate('/portfolio')}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-[#e28d1d] hover:text-[#e28d1d]/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Portfolio
        </Link>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <h1 
              className="text-3xl font-bold text-white"
              dangerouslySetInnerHTML={{ __html: project.title }}
            />
            <span className="px-3 py-1.5 bg-[#e28d1d] text-white rounded-full text-sm font-medium">
              {project.department}
            </span>
            <span className="px-3 py-1.5 bg-[#261939] text-white rounded-full text-sm font-medium border border-[#e28d1d]/30">
              {project.year}
            </span>
          </div>

          <div 
            className="prose prose-invert max-w-none portfolio-field prose-a:text-white prose-a:no-underline hover:prose-a:text-white/90 prose-li:text-white prose-li:bg-[#e28d1d] prose-li:px-3 prose-li:py-1 prose-li:rounded-full prose-li:inline-block prose-li:mr-2 prose-li:mb-2 prose-ul:list-none prose-ul:pl-0 prose-p:text-gray-300 prose-figure:mb-6 [&_figure_a]:bg-transparent [&_figure_a]:p-0 [&_.tags_a]:text-white"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </div>
      </div>
    </motion.div>
  );
};