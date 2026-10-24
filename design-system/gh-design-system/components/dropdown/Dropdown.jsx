import React from 'react';
export function Dropdown({ trigger, items = [] }) {
  const [open, setOpen] = React.useState(false);
  return React.createElement('div', { className: 'dropdown' },
    React.createElement('span', { onClick: () => setOpen(o => !o) }, trigger),
    open ? React.createElement('div', { className: 'dropdown-menu' },
      items.map((it, i) => it.divider
        ? React.createElement('div', { key: i, className: 'dropdown-divider' })
        : React.createElement('div', {
            key: i,
            className: 'dropdown-item' + (it.active ? ' is-active' : ''),
            'aria-disabled': it.disabled || undefined,
            onClick: it.disabled ? undefined : it.onClick
          }, it.icon, it.label)
      )
    ) : null
  );
}
