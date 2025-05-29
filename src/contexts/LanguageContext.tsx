import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.portfolio': 'Portfolio',
    'nav.contact': 'Contact',

    // Home
    'home.title': 'Nicolas Gruwe',
    'home.subtitle': 'WordPress Developer & Full Stack Expert',
    'home.description': 'Specialising in custom development. From custom theme and plugin development to complex integrations, I transform your digital vision into powerful, scalable experiences. With expertise in PHP, React and modern web technologies, I deliver solutions that go beyond traditional WordPress development.',
    'home.cta.work': 'Learn More',
    'home.cta.contact': 'Get in Touch',

    // About
    'about.title': 'Crafting Digital',
    'about.title.highlight': 'Experiences',
    'about.description': 'With over a decade of experience in WordPress development, I transform complex challenges into elegant, user-centric solutions.',
    'about.journey.title': 'Professional Journey',
    'about.journey.description': 'A timeline of my career progression and key milestones.',
    'about.expertise.title': 'Technical Expertise',
    'about.expertise.description': 'Hover over skills to see detailed proficiency levels.',
    'about.testimonials.title': 'Client Testimonials',
    'about.testimonials.description': 'What clients say about working with me.',
    'about.cta.title': 'Ready to Build Something Amazing?',
    'about.cta.description': "Let's collaborate to bring your vision to life. Whether you need a custom WordPress solution, web application, or digital transformation, I'm here to help.",
    'about.stats.tea': 'Cups of Tea',
    'about.stats.clients': 'Happy Clients',
    'about.stats.experience': 'Years Experience',
    'about.stats.success': 'Success Rate',
    'about.cta.features.tailored': 'Custom WordPress Solutions',
    'about.cta.features.agile': 'Agile Development Process',
    'about.cta.features.support': 'Ongoing Support & Maintenance',
    'about.cta.button': 'Start Your Project',
    'about.cta.note': "No commitment required - Let's discuss your vision",
    'about.cta.calendly': "Free 30min call",

    // Portfolio
    'portfolio.title': 'Portfolio - Freelance WordPress developer & custom plugins',
    'portfolio.filter.all': 'All',
    'portfolio.filter.departments': 'Departments',
    'portfolio.filter.visual': 'Visual',
    'portfolio.filter.website': 'Website',
    'portfolio.filter.application': 'Application',
    'portfolio.company.all': 'All Companies',
    'portfolio.company.freelance': 'Freelance',
    'portfolio.company.astek': 'Astek',
    'portfolio.company.bpce': 'BPCE',
    'portfolio.viewLive': 'View Live',
    'portfolio.viewCode': 'View Code',
    'portfolio.features': 'Key Features',
    'portfolio.technologies': 'Technologies Used',

    // Contact
    'contact.title': "Let's Create Something",
    'contact.title.highlight': 'Extraordinary',
    'contact.description': "Whether you need a custom WordPress theme, plugin development, or a complete web solution, I'm here to help turn your ideas into reality.",
    'contact.form.title': "Let's Talk",
    'contact.form.description': "Fill out the form below and I'll get back to you within 24 hours.",
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.project': 'Project Type',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Message',
    'contact.location': 'Remote, worldwide',

    // Email Success
    'email.success.title': 'Message Sent!',
    'email.success.description': "Thank you for reaching out. I'll get back to you as soon as possible.",

    // Legal
    'legal.title': 'Legal Notice',

    // Star Achievements
    'achievement.unlocked': 'Achievement Unlocked!',
    'achievement.star-explorer.title': 'Star Explorer',
    'achievement.star-explorer.description': 'Connected to 15 unique stars',
    'achievement.star-voyager.title': 'Star Voyager',
    'achievement.star-voyager.description': 'Connected to 30 unique stars',
    'achievement.star-commander.title': 'Star Commander',
    'achievement.star-commander.description': 'Connected to 50 unique stars',
    'achievement.star-admiral.title': 'Star Admiral',
    'achievement.star-admiral.description': 'Connected to 75 unique stars',
    'achievement.galactic-master.title': 'Galactic Master',
    'achievement.galactic-master.description': 'Connected to 100 unique stars',

    // Portfolio Achievements
    'achievement.portfolio-novice.title': 'Portfolio Novice',
    'achievement.portfolio-novice.description': 'Discovered your first project',
    'achievement.portfolio-explorer.title': 'Portfolio Explorer',
    'achievement.portfolio-explorer.description': 'Discovered 3 unique projects',
    'achievement.portfolio-enthusiast.title': 'Portfolio Enthusiast',
    'achievement.portfolio-enthusiast.description': 'Discovered 5 unique projects',
    'achievement.portfolio-connoisseur.title': 'Portfolio Connoisseur',
    'achievement.portfolio-connoisseur.description': 'Discovered 10 unique projects',
    'achievement.portfolio-master.title': 'Portfolio Master',
    'achievement.portfolio-master.description': 'Discovered 20 unique projects'
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.portfolio': 'Portfolio',
    'nav.contact': 'Contact',

    // Home
    'home.title': 'Nicolas Gruwe',
    'home.subtitle': 'Développeur WordPress & Expert Full Stack',
    'home.description': 'Spécialisé dans le développement sur mesure. Du développement de thèmes et plugins personnalisés aux intégrations complexes, je transforme votre vision digitale en expériences puissantes et évolutives. Avec une expertise en PHP, React et technologies web modernes, je livre des solutions qui dépassent le développement WordPress traditionnel.',
    'home.cta.work': 'En savoir plus',
    'home.cta.contact': 'Me contacter',

    // About
    'about.title': 'Création',
    'about.title.highlight': "d'Expériences Digitales",
    'about.description': "Avec plus de dix ans d'expérience en développement WordPress, je transforme des défis complexes en solutions élégantes centrées sur l'utilisateur.",
    'about.journey.title': 'Parcours Professionnel',
    'about.journey.description': 'Une chronologie de ma progression et de mes étapes clés.',
    'about.expertise.title': 'Expertise Technique',
    'about.expertise.description': 'Survolez les compétences pour voir les niveaux de maîtrise.',
    'about.testimonials.title': 'Témoignages Clients',
    'about.testimonials.description': 'Ce que disent mes clients de notre collaboration.',
    'about.cta.title': "Prêt à Créer Quelque Chose d'Incroyable ?",
    'about.cta.description': "Collaborons pour donner vie à votre vision. Que vous ayez besoin d'une solution WordPress personnalisée, d'une application web ou d'une transformation digitale, je suis là pour vous aider.",
    'about.stats.tea': 'Tasses de Thé',
    'about.stats.clients': 'Clients Satisfaits',
    'about.stats.experience': "Ans d'Expérience",
    'about.stats.success': 'Taux de Réussite',
    'about.cta.features.tailored': 'Solutions WordPress Sur Mesure',
    'about.cta.features.agile': 'Processus de développement agile',
    'about.cta.features.support': 'Support & Maintenance Continus',
    'about.cta.button': 'Démarrer Votre Projet',
    'about.cta.note': 'Sans engagement - Discutons de votre vision',
    'about.cta.calendly': "30min appel",

    // Portfolio
    'portfolio.title': 'Portfolio – Développeur WordPress freelance & plugins sur mesure',
    'portfolio.filter.all': 'Tous',
    'portfolio.filter.departments': 'Départements',
    'portfolio.filter.visual': 'Visuel',
    'portfolio.filter.website': 'Site Web',
    'portfolio.filter.application': 'Application',
    'portfolio.company.all': 'Toutes les Entreprises',
    'portfolio.company.freelance': 'Freelance',
    'portfolio.company.astek': 'Astek',
    'portfolio.company.bpce': 'BPCE',
    'portfolio.viewLive': 'Voir en Direct',
    'portfolio.viewCode': 'Voir le Code',
    'portfolio.features': 'Fonctionnalités Clés',
    'portfolio.technologies': 'Technologies Utilisées',

    // Contact
    'contact.title': 'Créons Quelque Chose',
    'contact.title.highlight': "d'Extraordinaire",
    'contact.description': "Que vous ayez besoin d'un thème WordPress personnalisé, du développement de plugins ou d'une solution web complète, je suis là pour vous aider à concrétiser vos idées.",
    'contact.form.title': 'Discutons',
    'contact.form.description': 'Remplissez le formulaire ci-dessous et je vous répondrai sous 24 heures.',
    'contact.form.name': 'Nom',
    'contact.form.email': 'Email',
    'contact.form.project': 'Type de projet',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Envoyer',
    'contact.location': 'À distance, mondial',

    // Email Success
    'email.success.title': 'Message Envoyé !',
    'email.success.description': 'Merci de m\'avoir contacté. Je vous répondrai dans les plus brefs délais.',

    // Legal
    'legal.title': 'Mentions Légales',

    // Star Achievements
    'achievement.unlocked': 'Succès Débloqué !',
    'achievement.star-explorer.title': 'Explorateur Stellaire',
    'achievement.star-explorer.description': 'Connecté à 15 étoiles uniques',
    'achievement.star-voyager.title': 'Voyageur Stellaire',
    'achievement.star-voyager.description': 'Connecté à 30 étoiles uniques',
    'achievement.star-commander.title': 'Commandant Stellaire',
    'achievement.star-commander.description': 'Connecté à 50 étoiles uniques',
    'achievement.star-admiral.title': 'Amiral Stellaire',
    'achievement.star-admiral.description': 'Connecté à 75 étoiles uniques',
    'achievement.galactic-master.title': 'Maître Galactique',
    'achievement.galactic-master.description': 'Connecté à 100 étoiles uniques',

    // Portfolio Achievements
    'achievement.portfolio-novice.title': 'Novice du Portfolio',
    'achievement.portfolio-novice.description': 'Découvert votre premier projet',
    'achievement.portfolio-explorer.title': 'Explorateur du Portfolio',
    'achievement.portfolio-explorer.description': 'Découvert 3 projets uniques',
    'achievement.portfolio-enthusiast.title': 'Enthousiaste du Portfolio',
    'achievement.portfolio-enthusiast.description': 'Découvert 5 projets uniques',
    'achievement.portfolio-connoisseur.title': 'Connaisseur du Portfolio',
    'achievement.portfolio-connoisseur.description': 'Découvert 10 projets uniques',
    'achievement.portfolio-master.title': 'Maître du Portfolio',
    'achievement.portfolio-master.description': 'Découvert 20 projets uniques'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};