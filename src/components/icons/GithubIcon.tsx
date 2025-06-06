import React from 'react';
import { Github } from 'lucide-react';

const GithubIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = (props) => {
  return <Github {...props} />;
};

export default GithubIcon; 