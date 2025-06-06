import React from 'react';
import { Coffee } from 'lucide-react';

const CoffeeIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = (props) => {
  return <Coffee {...props} />;
};

export default CoffeeIcon; 