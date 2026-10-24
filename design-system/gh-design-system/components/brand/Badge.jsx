import React from 'react';
export function Badge({ size = 'default', src = './assets/gh-logo.png', alt = 'GH' }) {
  return React.createElement('div', { className: 'badge' + (size === 'lg' ? ' badge-lg' : '') },
    React.createElement('img', { src, alt })
  );
}
