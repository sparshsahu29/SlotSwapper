import React from 'react';

export const Badge = ({ status = 'busy', text, className = '' }) => {
  let badgeClass = 'badge-busy';
  const normStatus = status.toLowerCase();

  if (normStatus === 'swappable') badgeClass = 'badge-swappable';
  else if (normStatus === 'pending' || normStatus === 'active' || normStatus === 'swap_pending') badgeClass = 'badge-pending';
  else if (normStatus === 'accepted' || normStatus === 'success') badgeClass = 'badge-accepted';
  else if (normStatus === 'rejected' || normStatus === 'failed' || normStatus === 'danger') badgeClass = 'badge-rejected';

  // Display label formatting
  const label = text || status.replace('_', ' ').toUpperCase();

  return (
    <span className={`${badgeClass} ${className} select-none`}>
      {label}
    </span>
  );
};

export default Badge;
