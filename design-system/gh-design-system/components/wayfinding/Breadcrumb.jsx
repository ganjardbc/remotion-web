import React from 'react';
export function Breadcrumb({ items = [] }) {
  return React.createElement('nav', { className: 'breadcrumb' },
    items.map((it, i) => React.createElement(React.Fragment, { key: i },
      i > 0 ? React.createElement('span', { className: 'sep' }, '/') : null,
      i === items.length - 1
        ? React.createElement('span', { className: 'current' }, it.label)
        : React.createElement('a', { href: it.href || '#' }, it.label)
    ))
  );
}
