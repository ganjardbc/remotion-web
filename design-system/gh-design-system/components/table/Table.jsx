import React from 'react';
export function Table({ columns = [], rows = [] }) {
  return React.createElement('table', { className: 'table' },
    React.createElement('thead', null, React.createElement('tr', null, columns.map((c, i) => React.createElement('th', { key: i }, c)))),
    React.createElement('tbody', null, rows.map((r, i) => React.createElement('tr', { key: i }, r.map((cell, j) => React.createElement('td', { key: j }, cell)))))
  );
}
