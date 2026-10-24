import React from 'react';
export function Card({ title, children, footer, interactive = false }) {
  return React.createElement('div', { className: 'card' + (interactive ? ' card-interactive' : '') },
    title ? React.createElement('div', { className: 'card-title' }, title) : null,
    children ? React.createElement('div', { className: 'card-body' }, children) : null,
    footer ? React.createElement('div', { className: 'card-footer' }, footer) : null
  );
}
