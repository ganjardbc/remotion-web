import React from 'react';
export function Navbar({ brand, links = [], cta, onGround = false }) {
  const navStyle = onGround ? { background: 'transparent', borderBottomColor: 'var(--color-ground-border)' } : undefined;
  return React.createElement('nav', { className: 'navbar', style: navStyle },
    React.createElement('div', { className: 'navbar-brand', style: onGround ? { color: '#fff' } : undefined }, brand),
    React.createElement('ul', { className: 'navbar-links' },
      links.map((l, i) => React.createElement('li', { key: i },
        React.createElement('a', { className: 'navbar-link' + (l.active ? ' is-active' : ''), href: l.href || '#' }, l.label)
      ))
    ),
    cta
  );
}
