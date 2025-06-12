'use client';

export const blurSensitiveWord = (text: string): string => {
  if (!text) return '';
  
  const sensitiveWord = 'creampie';
  const regex = new RegExp(sensitiveWord, 'gi');
  
  return text.replace(regex, (match) => {
    return `<span class="blur-text">${match}</span>`;
  });
}; 