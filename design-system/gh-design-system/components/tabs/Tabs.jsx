import React from 'react';
export function Tabs({ tabs = [], activeIndex = 0, onChange, children }) {
  return React.createElement(React.Fragment, null,
    React.createElement('div', { className: 'tabs' },
      tabs.map((t, i) => React.createElement('button', {
        key: i,
        className: 'tab' + (i === activeIndex ? ' is-active' : ''),
        onClick: () => onChange && onChange(i)
      }, t))
    ),
    children ? React.createElement('div', { className: 'tab-panel' }, children) : null
  );
}
