import React from 'react';
import { Code } from 'lucide-react';

const CodeIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = (props) => {
  return <Code {...props} />;
};

export default CodeIcon; 