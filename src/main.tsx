import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Démarrage de l\'application...');
const rootElement = document.getElementById('root');
console.log('Élément root trouvé:', rootElement);

if (!rootElement) {
  console.error('Élément root non trouvé!');
} else {
  try {
    const root = createRoot(rootElement);
    console.log('Root créé avec succès');
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('Rendu initial terminé');
  } catch (error) {
    console.error('Erreur lors du rendu:', error);
  }
}
