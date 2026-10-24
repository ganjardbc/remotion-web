/* @ds-bundle: {"format":4,"namespace":"GHPersonalBrandDesignSystem_a922a5","components":[{"name":"Avatar","sourcePath":"components/avatar/Avatar.jsx"},{"name":"Badge","sourcePath":"components/brand/Badge.jsx"},{"name":"Button","sourcePath":"components/button/Button.jsx"},{"name":"Card","sourcePath":"components/card/Card.jsx"},{"name":"Dropdown","sourcePath":"components/dropdown/Dropdown.jsx"},{"name":"EmptyState","sourcePath":"components/empty-state/EmptyState.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/form/Checkbox.jsx"},{"name":"Field","sourcePath":"components/form/Field.jsx"},{"name":"Input","sourcePath":"components/form/Input.jsx"},{"name":"Radio","sourcePath":"components/form/Radio.jsx"},{"name":"Textarea","sourcePath":"components/form/Textarea.jsx"},{"name":"Modal","sourcePath":"components/modal/Modal.jsx"},{"name":"Navbar","sourcePath":"components/navbar/Navbar.jsx"},{"name":"Progress","sourcePath":"components/progress/Progress.jsx"},{"name":"Spinner","sourcePath":"components/progress/Spinner.jsx"},{"name":"Table","sourcePath":"components/table/Table.jsx"},{"name":"Tabs","sourcePath":"components/tabs/Tabs.jsx"},{"name":"Tag","sourcePath":"components/tag/Tag.jsx"},{"name":"Breadcrumb","sourcePath":"components/wayfinding/Breadcrumb.jsx"},{"name":"Pagination","sourcePath":"components/wayfinding/Pagination.jsx"}],"sourceHashes":{"components/avatar/Avatar.jsx":"7081e385d592","components/brand/Badge.jsx":"4bd4b3673946","components/button/Button.jsx":"e83df57ea7af","components/card/Card.jsx":"6a62d22c03b7","components/dropdown/Dropdown.jsx":"489be18a055e","components/empty-state/EmptyState.jsx":"04dbe9b96b1b","components/feedback/Alert.jsx":"3e8adbd8a02a","components/feedback/Toast.jsx":"3f60ab09ecb0","components/feedback/Tooltip.jsx":"62e7ff20ea22","components/form/Checkbox.jsx":"f626d2277715","components/form/Field.jsx":"e3073fea23a8","components/form/Input.jsx":"74dc71374f1d","components/form/Radio.jsx":"9e8d98f91726","components/form/Textarea.jsx":"d0840f728b97","components/modal/Modal.jsx":"6505cf031241","components/navbar/Navbar.jsx":"1986dc54a241","components/progress/Progress.jsx":"1f85cf298c47","components/progress/Spinner.jsx":"3e775ce4ec99","components/table/Table.jsx":"863895c80e14","components/tabs/Tabs.jsx":"ed298f12057c","components/tag/Tag.jsx":"0cc6fc97059b","components/wayfinding/Breadcrumb.jsx":"32a16c0a843b","components/wayfinding/Pagination.jsx":"c3cc7f182d48"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GHPersonalBrandDesignSystem_a922a5 = window.GHPersonalBrandDesignSystem_a922a5 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/avatar/Avatar.jsx
try { (() => {
function Avatar({
  initials,
  src,
  alt = '',
  size = 'md'
}) {
  return React.createElement('div', {
    className: 'avatar avatar-' + size
  }, src ? React.createElement('img', {
    src,
    alt
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/avatar/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/brand/Badge.jsx
try { (() => {
function Badge({
  size = 'default',
  src = './assets/gh-logo.png',
  alt = 'GH'
}) {
  return React.createElement('div', {
    className: 'badge' + (size === 'lg' ? ' badge-lg' : '')
  }, React.createElement('img', {
    src,
    alt
  }));
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Badge.jsx", error: String((e && e.message) || e) }); }

// components/button/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  children,
  onClick,
  ...rest
}) {
  const cls = ['btn', 'btn-' + variant].join(' ');
  const style = size === 'sm' ? {
    padding: '10px 20px',
    fontSize: 'var(--text-sm)'
  } : undefined;
  return React.createElement('button', {
    className: cls,
    style,
    disabled,
    onClick,
    ...rest
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/button/Button.jsx", error: String((e && e.message) || e) }); }

// components/card/Card.jsx
try { (() => {
function Card({
  title,
  children,
  footer,
  interactive = false
}) {
  return React.createElement('div', {
    className: 'card' + (interactive ? ' card-interactive' : '')
  }, title ? React.createElement('div', {
    className: 'card-title'
  }, title) : null, children ? React.createElement('div', {
    className: 'card-body'
  }, children) : null, footer ? React.createElement('div', {
    className: 'card-footer'
  }, footer) : null);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/card/Card.jsx", error: String((e && e.message) || e) }); }

// components/dropdown/Dropdown.jsx
try { (() => {
function Dropdown({
  trigger,
  items = []
}) {
  const [open, setOpen] = React.useState(false);
  return React.createElement('div', {
    className: 'dropdown'
  }, React.createElement('span', {
    onClick: () => setOpen(o => !o)
  }, trigger), open ? React.createElement('div', {
    className: 'dropdown-menu'
  }, items.map((it, i) => it.divider ? React.createElement('div', {
    key: i,
    className: 'dropdown-divider'
  }) : React.createElement('div', {
    key: i,
    className: 'dropdown-item' + (it.active ? ' is-active' : ''),
    'aria-disabled': it.disabled || undefined,
    onClick: it.disabled ? undefined : it.onClick
  }, it.icon, it.label))) : null);
}
Object.assign(__ds_scope, { Dropdown });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/dropdown/Dropdown.jsx", error: String((e && e.message) || e) }); }

// components/empty-state/EmptyState.jsx
try { (() => {
function EmptyState({
  icon,
  title,
  description,
  action
}) {
  return React.createElement('div', {
    className: 'empty-state'
  }, icon, title ? React.createElement('h4', null, title) : null, description ? React.createElement('p', null, description) : null, action);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/empty-state/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function Alert({
  variant = 'info',
  title,
  children
}) {
  return React.createElement('div', {
    className: 'alert alert-' + variant
  }, React.createElement('span', null, title ? React.createElement('span', {
    className: 'alert-title'
  }, title) : null, children));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  variant = 'default',
  children
}) {
  const cls = variant === 'default' ? 'toast' : 'toast toast-' + variant;
  return React.createElement('div', {
    className: cls
  }, children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  children,
  text
}) {
  return React.createElement('div', {
    className: 'tooltip'
  }, children, React.createElement('div', {
    className: 'tooltip-bubble'
  }, text));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/form/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  disabled,
  onChange
}) {
  return React.createElement('label', {
    className: 'checkbox'
  }, React.createElement('input', {
    type: 'checkbox',
    checked,
    disabled,
    onChange
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/form/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/form/Field.jsx
try { (() => {
function Field({
  label,
  helperText,
  errorText,
  children
}) {
  return React.createElement('div', {
    className: 'field' + (errorText ? ' field-error' : '')
  }, label ? React.createElement('label', {
    className: 'label'
  }, label) : null, children, helperText && !errorText ? React.createElement('span', {
    className: 'help-text'
  }, helperText) : null, errorText ? React.createElement('span', {
    className: 'error-text'
  }, errorText) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/form/Field.jsx", error: String((e && e.message) || e) }); }

// components/form/Input.jsx
try { (() => {
function Input({
  type = 'text',
  invalid = false,
  ...rest
}) {
  return React.createElement('input', {
    className: 'input',
    type,
    style: invalid ? {
      borderColor: 'var(--color-danger)'
    } : undefined,
    ...rest
  });
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/form/Input.jsx", error: String((e && e.message) || e) }); }

// components/form/Radio.jsx
try { (() => {
function Radio({
  label,
  name,
  checked,
  disabled,
  onChange
}) {
  return React.createElement('label', {
    className: 'radio'
  }, React.createElement('input', {
    type: 'radio',
    name,
    checked,
    disabled,
    onChange
  }), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/form/Radio.jsx", error: String((e && e.message) || e) }); }

// components/form/Textarea.jsx
try { (() => {
function Textarea({
  ...rest
}) {
  return React.createElement('textarea', {
    className: 'textarea',
    ...rest
  });
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/form/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/modal/Modal.jsx
try { (() => {
function Modal({
  title,
  children,
  footer,
  onClose
}) {
  return React.createElement('div', {
    className: 'modal-backdrop',
    style: {
      position: 'relative',
      minHeight: '100%'
    }
  }, React.createElement('div', {
    className: 'modal'
  }, React.createElement('div', {
    className: 'modal-header'
  }, React.createElement('h3', {
    className: 'modal-title'
  }, title), React.createElement('button', {
    className: 'modal-close',
    onClick: onClose
  }, React.createElement('svg', {
    className: 'icon icon-md',
    viewBox: '0 0 24 24'
  }, React.createElement('path', {
    d: 'M18 6L6 18M6 6l12 12'
  })))), React.createElement('div', {
    className: 'modal-body'
  }, children), footer ? React.createElement('div', {
    className: 'modal-footer'
  }, footer) : null));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/modal/Modal.jsx", error: String((e && e.message) || e) }); }

// components/navbar/Navbar.jsx
try { (() => {
function Navbar({
  brand,
  links = [],
  cta,
  onGround = false
}) {
  const navStyle = onGround ? {
    background: 'transparent',
    borderBottomColor: 'var(--color-ground-border)'
  } : undefined;
  return React.createElement('nav', {
    className: 'navbar',
    style: navStyle
  }, React.createElement('div', {
    className: 'navbar-brand',
    style: onGround ? {
      color: '#fff'
    } : undefined
  }, brand), React.createElement('ul', {
    className: 'navbar-links'
  }, links.map((l, i) => React.createElement('li', {
    key: i
  }, React.createElement('a', {
    className: 'navbar-link' + (l.active ? ' is-active' : ''),
    href: l.href || '#'
  }, l.label)))), cta);
}
Object.assign(__ds_scope, { Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navbar/Navbar.jsx", error: String((e && e.message) || e) }); }

// components/progress/Progress.jsx
try { (() => {
function Progress({
  value = 0
}) {
  return React.createElement('div', {
    className: 'progress'
  }, React.createElement('div', {
    className: 'progress-bar',
    style: {
      width: value + '%'
    }
  }));
}
Object.assign(__ds_scope, { Progress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/progress/Progress.jsx", error: String((e && e.message) || e) }); }

// components/progress/Spinner.jsx
try { (() => {
function Spinner() {
  return React.createElement('div', {
    className: 'spinner'
  });
}
Object.assign(__ds_scope, { Spinner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/progress/Spinner.jsx", error: String((e && e.message) || e) }); }

// components/table/Table.jsx
try { (() => {
function Table({
  columns = [],
  rows = []
}) {
  return React.createElement('table', {
    className: 'table'
  }, React.createElement('thead', null, React.createElement('tr', null, columns.map((c, i) => React.createElement('th', {
    key: i
  }, c)))), React.createElement('tbody', null, rows.map((r, i) => React.createElement('tr', {
    key: i
  }, r.map((cell, j) => React.createElement('td', {
    key: j
  }, cell))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/table/Table.jsx", error: String((e && e.message) || e) }); }

// components/tabs/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  activeIndex = 0,
  onChange,
  children
}) {
  return React.createElement(React.Fragment, null, React.createElement('div', {
    className: 'tabs'
  }, tabs.map((t, i) => React.createElement('button', {
    key: i,
    className: 'tab' + (i === activeIndex ? ' is-active' : ''),
    onClick: () => onChange && onChange(i)
  }, t))), children ? React.createElement('div', {
    className: 'tab-panel'
  }, children) : null);
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tabs/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/tag/Tag.jsx
try { (() => {
function Tag({
  variant = 'neutral',
  children
}) {
  const cls = variant === 'neutral' ? 'tag' : 'tag tag-' + variant;
  return React.createElement('span', {
    className: cls
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tag/Tag.jsx", error: String((e && e.message) || e) }); }

// components/wayfinding/Breadcrumb.jsx
try { (() => {
function Breadcrumb({
  items = []
}) {
  return React.createElement('nav', {
    className: 'breadcrumb'
  }, items.map((it, i) => React.createElement(React.Fragment, {
    key: i
  }, i > 0 ? React.createElement('span', {
    className: 'sep'
  }, '/') : null, i === items.length - 1 ? React.createElement('span', {
    className: 'current'
  }, it.label) : React.createElement('a', {
    href: it.href || '#'
  }, it.label))));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/wayfinding/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/wayfinding/Pagination.jsx
try { (() => {
function Pagination({
  page = 1,
  totalPages = 1,
  onChange
}) {
  const items = [];
  items.push({
    key: 'prev',
    label: '\u2039',
    disabled: page <= 1,
    go: page - 1
  });
  for (let p = 1; p <= totalPages; p++) items.push({
    key: p,
    label: String(p),
    active: p === page,
    go: p
  });
  items.push({
    key: 'next',
    label: '\u203a',
    disabled: page >= totalPages,
    go: page + 1
  });
  return React.createElement('div', {
    className: 'pagination'
  }, items.map(it => React.createElement('div', {
    key: it.key,
    className: 'page-item' + (it.active ? ' is-active' : '') + (it.disabled ? ' is-disabled' : ''),
    onClick: it.disabled ? undefined : () => onChange && onChange(it.go)
  }, it.label)));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/wayfinding/Pagination.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Dropdown = __ds_scope.Dropdown;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Navbar = __ds_scope.Navbar;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.Spinner = __ds_scope.Spinner;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.Pagination = __ds_scope.Pagination;

})();
