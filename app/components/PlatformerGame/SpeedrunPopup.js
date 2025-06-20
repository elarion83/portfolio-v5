"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './GameInitPopup';
import { Trophy, Clock, Target, Award, RotateCcw, ArrowLeft, Share2, Download } from 'lucide-react';

const SpeedrunPopup = ({ isVisible, finalTime, collectedProjects, totalProjects, formatTime, onRestart, onBackToSite, difficultyConfig }) => {
  const [showContent, setShowContent] = useState(false);
  const [bestTimes, setBestTimes] = useState([]);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [currentRank, setCurrentRank] = useState(null);
  const [currentTimeId, setCurrentTimeId] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (isVisible) {
      console.log('🎯 SpeedrunPopup ouverte');
      console.log('📊 finalTime reçu:', finalTime);
      console.log('📊 Type de finalTime:', typeof finalTime);
      console.log('📊 formatTime(finalTime):', formatTime(finalTime));
      
      setShowContent(false);
      
      // Délai pour l'animation d'entrée
      setTimeout(() => {
        setShowContent(true);
      }, 300);

      // Charger les meilleurs temps depuis localStorage
      loadBestTimes();
    }
  }, [isVisible, finalTime]);

  const loadBestTimes = () => {
    // Ne pas sauvegarder les temps en mode Histoire
    if (difficultyConfig?.key === 'discovery') {
      setBestTimes([]);
      setIsNewRecord(false);
      setCurrentRank(null);
      return;
    }

    try {
      const saved = localStorage.getItem('speedrun-times');
      const times = saved ? JSON.parse(saved) : [];
      
      // Créer un ID unique pour le temps actuel
      const newTimeId = `time_${Date.now()}_${Math.random()}`;
      setCurrentTimeId(newTimeId);
      
      // Ajouter le temps actuel
      const newTime = {
        time: finalTime,
        projects: collectedProjects,
        date: new Date().toISOString(),
        id: newTimeId
      };

      const updatedTimes = [...times, newTime].sort((a, b) => a.time - b.time);
      
      // Garder seulement les 5 meilleurs temps
      const topTimes = updatedTimes.slice(0, 5);
      
      // Vérifier si c'est un nouveau record
      const rank = updatedTimes.findIndex(t => t.id === newTime.id) + 1;
      setCurrentRank(rank);
      setIsNewRecord(rank <= 5);
      
      setBestTimes(topTimes);
      localStorage.setItem('speedrun-times', JSON.stringify(topTimes));
    } catch (error) {
      console.error('Erreur lors du chargement des temps:', error);
      setBestTimes([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t('locale'), { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGradeName = (rank) => {
    if (rank === 1) return { name: t('legendary'), color: '#FFD700', emoji: '👑' };
    if (rank <= 2) return { name: t('master'), color: '#C0C0C0', emoji: '🥈' };
    if (rank <= 3) return { name: t('expert'), color: '#CD7F32', emoji: '🥉' };
    if (rank <= 5) return { name: t('skilled'), color: '#10b981', emoji: '⭐' };
    return { name: t('apprentice'), color: '#6b7280', emoji: '🔰' };
  };

  // Fonction de partage avec screenshot personnalisé
  const handleShare = async () => {
    setIsSharing(true);
    const grade = getGradeName(currentRank);
    
    try {
      // Créer le texte de partage avec date et heure
      const now = new Date();
      const dateTime = now.toLocaleDateString(t('locale'), { 
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      // Texte de partage différent selon le mode
      const shareText = difficultyConfig?.key === 'discovery' 
        ? `🎮 J'ai exploré tous les projets le ${dateTime} ! Venez découvrir mon portfolio ! ${window.location.origin}/jeu`
        : `🎮 J'ai collecté tous les projets en ${formatTime(finalTime)} le ${dateTime} ! Essaye de me battre ! ${window.location.origin}/jeu`;

      // 1. Essayer le Web Share API natif (mobile)
      if (navigator.share && navigator.canShare) {
        try {
          await navigator.share({
            title: t('shareTitle'),
            text: shareText,
            url: window.location.origin + '/jeu'
          });
          setIsSharing(false);
          return;
        } catch (shareError) {
          // L'utilisateur a annulé ou erreur, continuer avec les autres méthodes
          console.log('Web Share API annulé ou non supporté');
        }
      }

      // 2. Prendre un screenshot des éléments spécifiques
      try {
        // Dynamically import html2canvas to avoid SSR issues
        const html2canvas = (await import('html2canvas')).default;
        
        // Créer un conteneur temporaire avec les éléments à capturer
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
          position: fixed;
          top: -9999px;
          left: -9999px;
          background: linear-gradient(135deg, rgba(38, 25, 57, 0.95) 0%, rgba(42, 28, 62, 0.95) 100%);
          border: 2px solid rgba(226, 141, 29, 0.4);
          border-radius: 24px;
          padding: 40px;
          max-width: 600px;
          width: 600px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // Créer le header avec emoji au lieu de l'icône Lucide
        const headerClone = document.createElement('div');
        headerClone.style.cssText = `
          text-align: center;
          margin-bottom: 40px;
        `;
        
        const victoryIcon = document.createElement('div');
        victoryIcon.style.cssText = `
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          border-radius: 50%;
          color: #1a1a2e;
          margin-bottom: 20px;
          box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3);
          font-size: 48px;
        `;
        victoryIcon.textContent = '🏆';
        
        const victoryTitle = document.createElement('h2');
        victoryTitle.style.cssText = `
          font-size: 2.5rem;
          font-weight: 700;
          color: #e28d1d;
          margin-bottom: 10px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        `;
        victoryTitle.textContent = t('gameCompleted');
        
        const victorySubtitle = document.createElement('p');
        victorySubtitle.style.cssText = `
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        `;
        victorySubtitle.textContent = t('allProjectsCollected');
        
        headerClone.appendChild(victoryIcon);
        headerClone.appendChild(victoryTitle);
        headerClone.appendChild(victorySubtitle);

        // Cloner les stats avec styles inline
        const statsElement = document.querySelector('.speedrun-stats');
        let statsClone = null;
        if (statsElement) {
          statsClone = statsElement.cloneNode(true);
          
          // Corriger toutes les icônes dans les stats
          const statCards = statsClone.querySelectorAll('.stat-card');
          statCards.forEach((card, index) => {
            const iconElement = card.querySelector('.stat-icon');
            if (iconElement) {
              // Remplacer les icônes Lucide par des emojis
              if (index === 0) {
                iconElement.innerHTML = '⏱️'; // Timer
              } else if (index === 1) {
                iconElement.innerHTML = '🎯'; // Target
              } else if (index === 2) {
                const gradeEmoji = card.querySelector('.grade-emoji');
                if (gradeEmoji) {
                  iconElement.innerHTML = gradeEmoji.textContent;
                } else {
                  iconElement.innerHTML = '🏆'; // Fallback
                }
              }
              iconElement.style.fontSize = '24px';
              iconElement.style.display = 'flex';
              iconElement.style.alignItems = 'center';
              iconElement.style.justifyContent = 'center';
            }
          });
          
          // Appliquer les styles inline aux éléments stats
          statsClone.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          `;
        }

        // Cloner le banner de record avec emoji
        const recordElement = document.querySelector('.new-record-banner');
        let recordClone = null;
        if (recordElement) {
          recordClone = recordElement.cloneNode(true);
          // Remplacer l'icône SVG par un emoji
          const recordIcon = recordClone.querySelector('svg');
          if (recordIcon) {
            const emojiSpan = document.createElement('span');
            emojiSpan.textContent = '🏆';
            emojiSpan.style.fontSize = '20px';
            recordIcon.parentNode.replaceChild(emojiSpan, recordIcon);
          }
        }

        // Ajouter les éléments au conteneur
        tempContainer.appendChild(headerClone);
        if (statsClone) {
          tempContainer.appendChild(statsClone);
        }
        if (recordClone) {
          tempContainer.appendChild(recordClone);
        }

        document.body.appendChild(tempContainer);

        // Capture screenshot
        const canvas = await html2canvas(tempContainer, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
          width: 600,
          height: tempContainer.scrollHeight
        });

        // Nettoyer le conteneur temporaire
        document.body.removeChild(tempContainer);
        
        // Convertir en blob
        canvas.toBlob(async (blob) => {
          try {
            // Essayer de partager l'image avec Web Share API
            if (navigator.share && navigator.canShare({ files: [new File([blob], 'speedrun-score.png', { type: 'image/png' })] })) {
              await navigator.share({
                title: t('shareTitle'),
                text: shareText,
                files: [new File([blob], 'speedrun-score.png', { type: 'image/png' })]
              });
            } else {
              // Télécharger l'image
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `speedrun-score-${formatTime(finalTime).replace(/[:.]/g, '-')}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              
              // Afficher notification de succès sans copie clipboard
              showNotification(t('shareImageSuccess'));
            }
          } catch (error) {
            console.error('Erreur lors du partage d\'image:', error);
            // Fallback: afficher le texte à partager
            showNotification(shareText);
          }
        }, 'image/png', 0.9);

      } catch (screenshotError) {
        console.error('Erreur screenshot:', screenshotError);
        // Fallback: afficher le texte de partage
        showNotification(shareText);
      }

    } catch (error) {
      console.error('Erreur lors du partage:', error);
      // Dernier fallback: alerte avec le texte
              // Texte de partage différent selon le mode
        const shareText = difficultyConfig?.key === 'discovery' 
          ? `🎮 J'ai exploré tous les projets ! Venez découvrir mon portfolio ! ${window.location.origin}/jeu`
          : `🎮 J'ai collecté tous les projets en ${formatTime(finalTime)} ! Essaye de me battre ! ${window.location.origin}/jeu`;
      alert(t('shareError') + '\n\n' + shareText);
    } finally {
      setIsSharing(false);
    }
  };



  // Fonction pour afficher une notification
  const showNotification = (message) => {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      z-index: 10000;
      font-weight: 600;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
      animation: slideInRight 0.3s ease-out;
    `;
    
    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
        if (style.parentNode) {
          document.head.removeChild(style);
        }
      }, 300);
    }, 3000);
  };

  if (!isVisible) return null;

  const grade = getGradeName(currentRank);

  return (
    <div className="speedrun-overlay">
      <motion.div 
        className="speedrun-popup"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header avec animations de victoire */}
        <div className="speedrun-header">
          <motion.div 
            className="victory-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            <Trophy size={48} />
          </motion.div>
          
          <motion.h2 
            className="victory-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {t('gameCompleted')}
          </motion.h2>
          
          <motion.p 
            className="victory-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {t('allProjectsCollected')}
          </motion.p>
        </div>

        {/* Stats principales */}
        <motion.div 
          className="speedrun-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {/* Temps final - masqué en mode Histoire */}
          {difficultyConfig?.key !== 'discovery' && (
            <div className="stat-card main-time">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">{t('finalTime')}</div>
                <div className="stat-value main-time-value">{formatTime(finalTime)}</div>
              </div>
            </div>
          )}

          <div className="stat-card">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{t('projectsCollected')}</div>
              <div className="stat-value">{totalProjects}/{totalProjects}</div>
            </div>
          </div>

          {/* Rang - masqué en mode Histoire */}
          {difficultyConfig?.key !== 'discovery' && (
            <div className="stat-card grade-card" style={{ borderColor: grade.color }}>
              <div className="stat-icon" style={{ color: grade.color }}>
                <span className="grade-emoji">{grade.emoji}</span>
              </div>
              <div className="stat-content">
                <div className="stat-label">{t('rank')}</div>
                <div className="stat-value" style={{ color: grade.color }}>#{currentRank}</div>
                <div className="grade-name" style={{ color: grade.color }}>{grade.name}</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Nouveau record - masqué en mode Histoire */}
        {isNewRecord && difficultyConfig?.key !== 'discovery' && (
          <motion.div 
            className="new-record-banner"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
          >
            <Award size={20} />
            <span>{currentRank === 1 ? t('newBestTime') : t('newTopTime')}</span>
          </motion.div>
        )}

        {/* Tableau des meilleurs temps - masqué en mode Histoire */}
        {difficultyConfig?.key !== 'discovery' && (
          <motion.div 
            className="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <h3 className="leaderboard-title">{t('bestTimes')}</h3>
            <div className="leaderboard-list">
              {bestTimes.map((time, index) => (
                <div 
                  key={time.id} 
                  className={`leaderboard-item ${time.id === currentTimeId ? 'current' : ''}`}
                >
                  <div className="rank">#{index + 1}</div>
                  <div className="time">{formatTime(time.time)}</div>
                  <div className="date">{formatDate(time.date)}</div>
                  <div className="projects">{time.projects}/{totalProjects}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div 
          className="speedrun-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <button 
            className="btn-share share-btn" 
            onClick={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Download size={18} />
              </motion.div>
            ) : (
              <Share2 size={18} />
            )}
            <span>{isSharing ? t('sharing') : t('shareScore')}</span>
          </button>
          
          <button 
            className="btn-primary restart-btn" 
            onClick={onRestart}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {/* Effet de lueur animée qui traverse le bouton */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1
              }}
              style={{
                transform: 'skewX(-20deg)',
                filter: 'blur(1px)'
              }}
            />
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
              <RotateCcw size={18} />
              <span>{t('playAgain')}</span>
            </div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SpeedrunPopup; 