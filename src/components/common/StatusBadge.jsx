import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const statusColors = {
    'Resolved': 'bg-green-100 text-green-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Pending': 'bg-red-100 text-red-800',
    'Acknowledged': 'bg-blue-100 text-blue-800',
    'Assigned': 'bg-purple-100 text-purple-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`rounded-full font-semibold inline-block ${colorClass} ${sizeClasses[size]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
