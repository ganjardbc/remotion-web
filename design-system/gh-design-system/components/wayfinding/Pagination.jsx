import React from 'react';
export function Pagination({ page = 1, totalPages = 1, onChange }) {
  const items = [];
  items.push({ key: 'prev', label: '\u2039', disabled: page <= 1, go: page - 1 });
  for (let p = 1; p <= totalPages; p++) items.push({ key: p, label: String(p), active: p === page, go: p });
  items.push({ key: 'next', label: '\u203a', disabled: page >= totalPages, go: page + 1 });
  return React.createElement('div', { className: 'pagination' },
    items.map(it => React.createElement('div', {
      key: it.key,
      className: 'page-item' + (it.active ? ' is-active' : '') + (it.disabled ? ' is-disabled' : ''),
      onClick: it.disabled ? undefined : () => onChange && onChange(it.go)
    }, it.label))
  );
}
