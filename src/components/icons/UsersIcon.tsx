import React from 'react';
import { Users } from 'lucide-react';

const UsersIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = (props) => {
  return <Users {...props} />;
};

export default UsersIcon; 