import React from 'react';
export function Field({ label, helperText, errorText, children }) {
  return React.createElement('div', { className: 'field' + (errorText ? ' field-error' : '') },
    label ? React.createElement('label', { className: 'label' }, label) : null,
    children,
    helperText && !errorText ? React.createElement('span', { className: 'help-text' }, helperText) : null,
    errorText ? React.createElement('span', { className: 'error-text' }, errorText) : null
  );
}
