import React from 'react';
export function Checkbox({ label, checked, disabled, onChange }) {
  return React.createElement('label', { className: 'checkbox' },
    React.createElement('input', { type: 'checkbox', checked, disabled, onChange }),
    label
  );
}
