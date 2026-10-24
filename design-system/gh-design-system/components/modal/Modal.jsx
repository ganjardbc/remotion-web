import React from 'react';
export function Modal({ title, children, footer, onClose }) {
  return React.createElement('div', { className: 'modal-backdrop', style: { position: 'relative', minHeight: '100%' } },
    React.createElement('div', { className: 'modal' },
      React.createElement('div', { className: 'modal-header' },
        React.createElement('h3', { className: 'modal-title' }, title),
        React.createElement('button', { className: 'modal-close', onClick: onClose },
          React.createElement('svg', { className: 'icon icon-md', viewBox: '0 0 24 24' }, React.createElement('path', { d: 'M18 6L6 18M6 6l12 12' }))
        )
      ),
      React.createElement('div', { className: 'modal-body' }, children),
      footer ? React.createElement('div', { className: 'modal-footer' }, footer) : null
    )
  );
}
