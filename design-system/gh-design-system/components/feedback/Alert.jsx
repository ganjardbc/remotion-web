import React from 'react';
export function Alert({ variant = 'info', title, children }) {
  return React.createElement('div', { className: 'alert alert-' + variant },
    React.createElement('span', null,
      title ? React.createElement('span', { className: 'alert-title' }, title) : null,
      children
    )
  );
}
