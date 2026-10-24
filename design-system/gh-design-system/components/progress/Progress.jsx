import React from 'react';
export function Progress({ value = 0 }) {
  return React.createElement('div', { className: 'progress' },
    React.createElement('div', { className: 'progress-bar', style: { width: value + '%' } })
  );
}
