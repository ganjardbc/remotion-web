import React from 'react';
export function Tag({ variant = 'neutral', children }) {
  const cls = variant === 'neutral' ? 'tag' : 'tag tag-' + variant;
  return React.createElement('span', { className: cls }, children);
}
