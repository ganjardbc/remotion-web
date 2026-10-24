import React from 'react';
export function Radio({ label, name, checked, disabled, onChange }) {
  return React.createElement('label', { className: 'radio' },
    React.createElement('input', { type: 'radio', name, checked, disabled, onChange }),
    label
  );
}
