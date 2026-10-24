import React from 'react';
export function Button({ variant = 'primary', size = 'md', disabled = false, icon = null, children, onClick, ...rest }) {
  const cls = ['btn', 'btn-' + variant].join(' ');
  const style = size === 'sm' ? { padding: '10px 20px', fontSize: 'var(--text-sm)' } : undefined;
  return React.createElement('button', { className: cls, style, disabled, onClick, ...rest }, icon, children);
}
