import React from 'react';
export function Tooltip({ children, text }) {
  return React.createElement('div', { className: 'tooltip' }, children,
    React.createElement('div', { className: 'tooltip-bubble' }, text)
  );
}
