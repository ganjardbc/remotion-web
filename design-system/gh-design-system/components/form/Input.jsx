import React from 'react';
export function Input({ type = 'text', invalid = false, ...rest }) {
  return React.createElement('input', { className: 'input', type, style: invalid ? { borderColor: 'var(--color-danger)' } : undefined, ...rest });
}
