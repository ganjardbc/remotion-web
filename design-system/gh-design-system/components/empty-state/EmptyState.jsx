import React from 'react';
export function EmptyState({ icon, title, description, action }) {
  return React.createElement('div', { className: 'empty-state' },
    icon,
    title ? React.createElement('h4', null, title) : null,
    description ? React.createElement('p', null, description) : null,
    action
  );
}
