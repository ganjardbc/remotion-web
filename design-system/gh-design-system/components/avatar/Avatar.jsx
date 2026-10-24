import React from 'react';
export function Avatar({ initials, src, alt = '', size = 'md' }) {
  return React.createElement('div', { className: 'avatar avatar-' + size },
    src ? React.createElement('img', { src, alt }) : initials
  );
}
