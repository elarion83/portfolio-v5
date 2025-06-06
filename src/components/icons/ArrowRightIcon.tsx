import React from 'react';
import { ArrowRight } from 'lucide-react';

const ArrowRightIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = (props) => {
  return <ArrowRight {...props} />;
};

export default ArrowRightIcon; 