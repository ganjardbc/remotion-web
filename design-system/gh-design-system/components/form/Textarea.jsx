import React from 'react';
export function Textarea({ ...rest }) {
  return React.createElement('textarea', { className: 'textarea', ...rest });
}
