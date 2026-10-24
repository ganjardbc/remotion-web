import React from 'react';
export function Toast({ variant = 'default', children }) {
  const cls = variant === 'default' ? 'toast' : 'toast toast-' + variant;
  return React.createElement('div', { className: cls }, children);
}
