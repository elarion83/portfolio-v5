import React from 'react';
import { Mail } from 'lucide-react';

const MailIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = (props) => {
  return <Mail {...props} />;
};

export default MailIcon; 