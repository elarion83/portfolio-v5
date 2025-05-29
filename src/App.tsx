import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageSwitch } from './components/LanguageSwitch';
import { ImageLightbox } from './components/ImageLightbox';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Portfolio } from './pages/Portfolio';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';

// Title updater component
const TitleUpdater = () => {
  const location = useLocation();
  
  useEffect(() => {
    const titles = {
      '/': 'Nicolas Gruwe | Full Stack Developer & Creative Technologist',
      '/about': 'About Nicolas Gruwe | 10+ Years of Development Excellence',
      '/portfolio': 'Portfolio | Innovative Web Solutions by Nicolas Gruwe',
      '/contact': 'Contact Nicolas Gruwe | Let\'s Build Something Extraordinary',
      '/blog': 'Blog | Insights & Updates from Nicolas Gruwe'
    };
    
    const descriptions = {
      '/': 'Transform your digital vision into reality with Nicolas Gruwe. Expert Full Stack Developer specializing in innovative web solutions and user-centric design.',
      '/about': 'Discover how Nicolas Gruwe\'s decade of experience in full stack development can benefit your project. Learn about his expertise and approach.',
      '/portfolio': 'Explore Nicolas Gruwe\'s portfolio of successful web projects. See how his expertise can help bring your digital vision to life.',
      '/contact': 'Ready to start your next digital project? Get in touch with Nicolas Gruwe for innovative web solutions that drive results.',
      '/blog': 'Read the latest insights, tutorials, and updates from Nicolas Gruwe on web development, technology, and digital innovation.'
    };

    // Update title and meta description
    const baseTitle = titles[location.pathname as keyof typeof titles];
    document.title = baseTitle || titles['/'];
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptions[location.pathname as keyof typeof descriptions] || descriptions['/']);
    }

    // Update OG and Twitter meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (ogTitle) ogTitle.setAttribute('content', baseTitle || titles['/']);
    if (twitterTitle) twitterTitle.setAttribute('content', baseTitle || titles['/']);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (ogDescription) ogDescription.setAttribute('content', descriptions[location.pathname as keyof typeof descriptions] || descriptions['/']);
    if (twitterDescription) twitterDescription.setAttribute('content', descriptions[location.pathname as keyof typeof descriptions] || descriptions['/']);

    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      const baseUrl = 'https://nicolas-gruwe.fr';
      let canonicalUrl = baseUrl;

      // Handle special cases for blog posts and portfolio items
      if (location.pathname.startsWith('/blog/')) {
        canonicalUrl = `${baseUrl}${location.pathname}`;
      } else if (location.pathname.startsWith('/portfolio/')) {
        canonicalUrl = `${baseUrl}${location.pathname}`;
      } else if (location.pathname !== '/') {
        canonicalUrl = `${baseUrl}${location.pathname}`;
      }

      canonicalLink.setAttribute('href', canonicalUrl);
    }
  }, [location]);

  return null;
};

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:projectId" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <TitleUpdater />
        <div className="relative overflow-x-hidden w-full">
          <LanguageSwitch />
          <Navigation />
          <main className="content-container">
            <AppRoutes />
          </main>
          <ImageLightbox />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;