/* @ds-bundle: {"format":4,"namespace":"InsellDesignSystem_ce0d5e","components":[{"name":"Avatar","sourcePath":"components/avatar/Avatar.jsx"},{"name":"Badge","sourcePath":"components/badge/Badge.jsx"},{"name":"Button","sourcePath":"components/button/Button.jsx"},{"name":"Card","sourcePath":"components/card/Card.jsx"},{"name":"Dropdown","sourcePath":"components/dropdown/Dropdown.jsx"},{"name":"EmptyState","sourcePath":"components/empty-state/EmptyState.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Select.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Modal","sourcePath":"components/modal/Modal.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"Progress","sourcePath":"components/progress/Progress.jsx"},{"name":"Spinner","sourcePath":"components/progress/Progress.jsx"},{"name":"StatCard","sourcePath":"components/stat-card/StatCard.jsx"},{"name":"Table","sourcePath":"components/table/Table.jsx"},{"name":"Tabs","sourcePath":"components/tabs/Tabs.jsx"},{"name":"Breadcrumb","sourcePath":"components/wayfinding/Breadcrumb.jsx"},{"name":"Pagination","sourcePath":"components/wayfinding/Pagination.jsx"}],"sourceHashes":{"components/avatar/Avatar.jsx":"4cd2f850d9aa","components/badge/Badge.jsx":"183817cbcff6","components/button/Button.jsx":"67f757c8c38c","components/card/Card.jsx":"29f318743730","components/dropdown/Dropdown.jsx":"16c9f19d2587","components/empty-state/EmptyState.jsx":"4302dfefc820","components/feedback/Alert.jsx":"88986d46e079","components/feedback/Toast.jsx":"8daed80a7255","components/feedback/Tooltip.jsx":"dd7ccd01bd7f","components/forms/Checkbox.jsx":"0d5f6796bde2","components/forms/Input.jsx":"1766a40e4c55","components/forms/Select.jsx":"e256704fd013","components/modal/Modal.jsx":"e17cab69858f","components/navigation/Navbar.jsx":"a70545ff9738","components/navigation/Sidebar.jsx":"e4a0e18cb9ae","components/progress/Progress.jsx":"e7077caa2b01","components/stat-card/StatCard.jsx":"564eb50a75ec","components/table/Table.jsx":"8f7ca25bcf4c","components/tabs/Tabs.jsx":"95597c9d63ea","components/wayfinding/Breadcrumb.jsx":"f938c2300ef3","components/wayfinding/Pagination.jsx":"5a189906bfc4"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.InsellDesignSystem_ce0d5e = window.InsellDesignSystem_ce0d5e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/avatar/Avatar.jsx
try { (() => {
const SIZES = {
  sm: 28,
  md: 36,
  lg: 48
};
function Avatar({
  name = '',
  src,
  size = 'md'
}) {
  const px = SIZES[size] || SIZES.md;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: px,
      height: px,
      borderRadius: 'var(--radius-full)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: src ? 'transparent' : 'var(--color-primary-100)',
      color: 'var(--color-primary-700)',
      font: 'var(--text-body-sm)',
      fontWeight: 700,
      fontFamily: 'var(--font-body)',
      flexShrink: 0
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/avatar/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/badge/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: 'var(--color-neutral-100)',
    fg: 'var(--text-secondary)'
  },
  brand: {
    bg: 'var(--brand-soft)',
    fg: 'var(--text-brand)'
  },
  success: {
    bg: 'var(--color-success-bg)',
    fg: 'var(--color-success-dark)'
  },
  warning: {
    bg: 'var(--color-warning-bg)',
    fg: 'var(--color-warning-dark)'
  },
  error: {
    bg: 'var(--color-error-bg)',
    fg: 'var(--color-error-dark)'
  },
  info: {
    bg: 'var(--color-info-bg)',
    fg: 'var(--color-info-dark)'
  }
};
function Badge({
  tone = 'neutral',
  dot,
  children
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      background: t.bg,
      color: t.fg,
      font: 'var(--text-caption)',
      fontFamily: 'var(--font-body)',
      fontWeight: 600
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 'var(--radius-full)',
      background: t.fg
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/badge/Badge.jsx", error: String((e && e.message) || e) }); }

// components/button/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    pad: '6px 12px',
    font: 'var(--text-body-sm)',
    gap: 6
  },
  md: {
    pad: '10px 16px',
    font: 'var(--text-body-md)',
    gap: 8
  },
  lg: {
    pad: '13px 22px',
    font: 'var(--text-body-lg)',
    gap: 10
  }
};
function variantStyle(variant) {
  switch (variant) {
    case 'secondary':
      return {
        base: 'var(--surface-page)',
        hover: 'var(--color-neutral-50)',
        press: 'var(--color-neutral-100)',
        text: 'var(--text-primary)',
        border: 'var(--border-default)'
      };
    case 'ghost':
      return {
        base: 'transparent',
        hover: 'var(--brand-soft)',
        press: 'var(--brand-soft-hover)',
        text: 'var(--text-brand)',
        border: 'transparent'
      };
    case 'danger':
      return {
        base: 'var(--color-error)',
        hover: 'var(--color-error-dark)',
        press: 'var(--color-error-dark)',
        text: 'var(--text-on-brand)',
        border: 'transparent'
      };
    default:
      return {
        base: 'var(--brand-solid)',
        hover: 'var(--brand-solid-hover)',
        press: 'var(--brand-solid-press)',
        text: 'var(--text-on-brand)',
        border: 'transparent'
      };
  }
}
function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  fullWidth,
  icon,
  children,
  onClick
}) {
  const [state, setState] = React.useState('idle');
  const v = variantStyle(variant);
  const s = SIZES[size] || SIZES.md;
  const bg = disabled ? 'var(--color-neutral-100)' : state === 'press' ? v.press : state === 'hover' ? v.hover : v.base;
  return /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setState('hover'),
    onMouseLeave: () => setState('idle'),
    onMouseDown: () => setState('press'),
    onMouseUp: () => setState('hover'),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      width: fullWidth ? '100%' : 'auto',
      padding: s.pad,
      font: s.font,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      color: disabled ? 'var(--text-disabled)' : v.text,
      background: bg,
      border: `1px solid ${disabled ? 'var(--border-subtle)' : v.border}`,
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'var(--transition-interactive)',
      boxShadow: variant === 'primary' && !disabled && state !== 'press' ? 'var(--shadow-xs)' : 'none'
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/button/Button.jsx", error: String((e && e.message) || e) }); }

// components/card/Card.jsx
try { (() => {
function Card({
  title,
  subtitle,
  actions,
  footer,
  children,
  padding = 'var(--space-6)'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-body)',
      overflow: 'hidden'
    }
  }, (title || actions) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      padding: `${padding} ${padding} 0`
    }
  }, /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-heading-md)',
      color: 'var(--text-primary)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, subtitle)), actions), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-subtle)',
      padding,
      background: 'var(--surface-sunken)'
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/card/Card.jsx", error: String((e && e.message) || e) }); }

// components/dropdown/Dropdown.jsx
try { (() => {
function Dropdown({
  trigger,
  items = [],
  onSelect
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      display: 'inline-block',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(o => !o),
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(o => !o);
      }
    },
    role: "button",
    tabIndex: 0,
    "aria-haspopup": "menu",
    "aria-expanded": open
  }, trigger), open && /*#__PURE__*/React.createElement("div", {
    role: "menu",
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      right: 0,
      minWidth: 180,
      background: 'var(--surface-page)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      padding: 6,
      zIndex: 10
    }
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    role: "menuitem",
    onClick: () => {
      onSelect && onSelect(it.id);
      setOpen(false);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      padding: '8px 10px',
      border: 'none',
      background: 'transparent',
      borderRadius: 'var(--radius-sm)',
      font: 'var(--text-body-sm)',
      color: it.danger ? 'var(--color-error)' : 'var(--text-primary)',
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--color-neutral-50)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, it.label))));
}
Object.assign(__ds_scope, { Dropdown });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/dropdown/Dropdown.jsx", error: String((e && e.message) || e) }); }

// components/empty-state/EmptyState.jsx
try { (() => {
function EmptyState({
  title,
  description,
  action,
  icon
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 12,
      padding: 'var(--space-16) var(--space-6)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      width: 56,
      height: 56,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-neutral-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-tertiary)'
    }
  }, icon || /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 'var(--radius-sm)',
      border: '2px dashed var(--border-strong)'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-heading-md)',
      color: 'var(--text-primary)'
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--text-secondary)',
      marginTop: 4,
      maxWidth: 320
    }
  }, description)), action);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/empty-state/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
const TONES = {
  info: {
    bg: 'var(--color-info-bg)',
    fg: 'var(--color-info-dark)',
    accent: 'var(--color-info)'
  },
  success: {
    bg: 'var(--color-success-bg)',
    fg: 'var(--color-success-dark)',
    accent: 'var(--color-success)'
  },
  warning: {
    bg: 'var(--color-warning-bg)',
    fg: 'var(--color-warning-dark)',
    accent: 'var(--color-warning)'
  },
  error: {
    bg: 'var(--color-error-bg)',
    fg: 'var(--color-error-dark)',
    accent: 'var(--color-error)'
  }
};
function Alert({
  tone = 'info',
  title,
  children,
  onDismiss
}) {
  const t = TONES[tone] || TONES.info;
  const role = tone === 'error' || tone === 'warning' ? 'alert' : 'status';
  return /*#__PURE__*/React.createElement("div", {
    role: role,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      background: t.bg,
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      marginTop: 6,
      borderRadius: '50%',
      background: t.accent,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-heading-sm)',
      color: t.fg,
      marginBottom: 2
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-body-sm)',
      color: t.fg,
      opacity: 0.9
    }
  }, children)), onDismiss && /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      border: 'none',
      background: 'transparent',
      color: t.fg,
      cursor: 'pointer',
      opacity: 0.6
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  tone = 'success',
  message,
  onClose
}) {
  const accent = tone === 'error' ? 'var(--color-error)' : tone === 'warning' ? 'var(--color-warning)' : tone === 'info' ? 'var(--color-info)' : 'var(--color-success)';
  const role = tone === 'error' ? 'alert' : 'status';
  return /*#__PURE__*/React.createElement("div", {
    role: role,
    "aria-live": tone === 'error' ? 'assertive' : 'polite',
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--color-neutral-800)',
      color: 'var(--color-white)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      boxShadow: 'var(--shadow-lg)',
      fontFamily: 'var(--font-body)',
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: accent,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: 'var(--text-body-sm)'
    }
  }, message), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      border: 'none',
      background: 'transparent',
      color: 'var(--color-white)',
      opacity: 0.6,
      cursor: 'pointer'
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  children
}) {
  const [show, setShow] = React.useState(false);
  const id = React.useId();
  const trigger = React.cloneElement(children, {
    'aria-describedby': id,
    onMouseEnter: e => {
      setShow(true);
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: e => {
      setShow(false);
      children.props.onMouseLeave?.(e);
    },
    onFocus: e => {
      setShow(true);
      children.props.onFocus?.(e);
    },
    onBlur: e => {
      setShow(false);
      children.props.onBlur?.(e);
    }
  });
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block'
    }
  }, trigger, show && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    id: id,
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--color-neutral-800)',
      color: 'var(--color-white)',
      padding: '6px 10px',
      borderRadius: 'var(--radius-sm)',
      font: 'var(--text-caption)',
      fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-md)',
      zIndex: 20
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  hint,
  error,
  placeholder,
  prefix,
  disabled,
  type = 'text',
  value,
  onChange
}) {
  const [focused, setFocused] = React.useState(false);
  const borderColor = error ? 'var(--color-error)' : focused ? 'var(--border-focus)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--text-heading-sm)',
      color: 'var(--text-primary)',
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-page)',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px',
      boxShadow: focused && !error ? 'var(--shadow-focus-ring)' : 'none',
      transition: 'var(--transition-interactive)'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      display: 'flex'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    disabled: disabled,
    value: value,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      width: '100%',
      font: 'var(--text-body-md)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)'
    }
  })), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 6,
      font: 'var(--text-caption)',
      color: error ? 'var(--color-error)' : 'var(--text-tertiary)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--text-heading-sm)',
      color: 'var(--text-primary)',
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: onChange,
    style: {
      width: '100%',
      appearance: 'none',
      background: 'var(--surface-page)',
      border: '1.5px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 12px',
      font: 'var(--text-body-md)',
      fontFamily: 'var(--font-body)',
      color: 'var(--text-primary)'
    }
  }, placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))));
}
function Checkbox({
  label,
  checked,
  onChange,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-body)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 'var(--radius-xs)',
      border: `1.5px solid ${checked ? 'var(--brand-solid)' : 'var(--border-strong)'}`,
      background: checked ? 'var(--brand-solid)' : 'var(--surface-page)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-interactive)'
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "9",
    viewBox: "0 0 11 9",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 4.5L4 7.5L10 1",
    stroke: "white",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      opacity: 0,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body-md)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Select, Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {

Object.assign(__ds_scope, { Checkbox: __ds_scope.Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/modal/Modal.jsx
try { (() => {
function Modal({
  open,
  title,
  children,
  footer,
  onClose
}) {
  const dialogRef = React.useRef(null);
  const previouslyFocused = React.useRef(null);
  const titleId = React.useId();
  React.useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement;
    dialogRef.current?.focus();
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onClose && onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const list = Array.from(focusables);
        const first = list[0],
          last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-overlay)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      fontFamily: 'var(--font-body)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    ref: dialogRef,
    tabIndex: -1,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": titleId,
    onClick: e => e.stopPropagation(),
    style: {
      width: 420,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 20px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    id: titleId,
    style: {
      font: 'var(--text-heading-md)',
      color: 'var(--text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      border: 'none',
      background: 'transparent',
      color: 'var(--text-tertiary)',
      fontSize: 18,
      cursor: 'pointer'
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      font: 'var(--text-body-md)',
      color: 'var(--text-secondary)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: '16px 20px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/modal/Modal.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navbar.jsx
try { (() => {
function Navbar({
  links = [],
  cta,
  onGround
}) {
  const fg = 'var(--text-primary)';
  return /*#__PURE__*/React.createElement("div", {
    className: onGround ? 'on-ground' : '',
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 32px',
      background: onGround ? 'var(--color-primary-600)' : 'var(--surface-page)',
      borderBottom: onGround ? 'none' : '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      font: 'var(--text-heading-md)',
      color: fg,
      fontFamily: 'var(--font-display)',
      fontWeight: 800
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: onGround ? 'var(--color-white)' : 'linear-gradient(135deg,#F14A2A,#FFA347)',
      display: 'inline-block'
    }
  }), "insell.id"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 28
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: fg,
      opacity: 0.85,
      font: 'var(--text-body-md)',
      textDecoration: 'none'
    }
  }, l))), cta);
}
Object.assign(__ds_scope, { Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navbar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sidebar.jsx
try { (() => {
function Sidebar({
  sections = [],
  activeId,
  onSelect,
  collapsed
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Sidebar",
    style: {
      width: collapsed ? 64 : 232,
      background: 'var(--surface-page)',
      borderRight: '1px solid var(--border-subtle)',
      padding: '16px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      fontFamily: 'var(--font-body)',
      boxSizing: 'border-box',
      height: '100%'
    }
  }, sections.map(sec => /*#__PURE__*/React.createElement("div", {
    key: sec.title
  }, !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-overline)',
      letterSpacing: 'var(--tracking-overline)',
      color: 'var(--text-tertiary)',
      padding: '0 10px 8px'
    }
  }, sec.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, sec.items.map(item => {
    const active = item.id === activeId;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      onClick: () => onSelect && onSelect(item.id),
      "aria-current": active ? 'page' : undefined,
      "aria-label": collapsed ? item.label : undefined,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 10px',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        background: active ? 'var(--brand-soft)' : 'transparent',
        color: active ? 'var(--text-brand)' : 'var(--text-secondary)',
        font: 'var(--text-body-md)',
        fontWeight: active ? 600 : 500,
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 'var(--radius-xs)',
        background: active ? 'var(--color-primary-500)' : 'var(--color-neutral-300)',
        flexShrink: 0
      }
    }), !collapsed && item.label);
  })))));
}
Object.assign(__ds_scope, { Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sidebar.jsx", error: String((e && e.message) || e) }); }

// components/progress/Progress.jsx
try { (() => {
function Progress({
  value = 0,
  tone = 'brand'
}) {
  const fg = tone === 'error' ? 'var(--color-error)' : tone === 'warning' ? 'var(--color-warning)' : 'var(--brand-solid)';
  const clamped = Math.min(100, Math.max(0, value));
  return /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuenow": clamped,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    style: {
      height: 8,
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-neutral-100)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${clamped}%`,
      background: fg,
      borderRadius: 'var(--radius-full)',
      transition: 'width var(--duration-slow) var(--ease-standard)'
    }
  }));
}
function Spinner({
  size = 20,
  label = 'Loading'
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    role: "status",
    "aria-label": label,
    style: {
      animation: 'isl-spin 700ms linear infinite'
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes isl-spin{to{transform:rotate(360deg)}}'), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9",
    fill: "none",
    stroke: "var(--color-neutral-200)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 12a9 9 0 0 0-9-9",
    fill: "none",
    stroke: "var(--brand-solid)",
    strokeWidth: "3",
    strokeLinecap: "round"
  }));
}
Object.assign(__ds_scope, { Progress, Spinner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/progress/Progress.jsx", error: String((e && e.message) || e) }); }

// components/stat-card/StatCard.jsx
try { (() => {
function StatCard({
  label,
  value,
  delta,
  deltaTone = 'success',
  icon
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-5)',
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-tertiary)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--brand-soft)',
      color: 'var(--text-brand)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, icon)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-display-sm)',
      fontFamily: 'var(--font-display)',
      color: 'var(--text-primary)'
    }
  }, value), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      fontWeight: 600,
      color: deltaTone === 'error' ? 'var(--color-error)' : 'var(--color-success)'
    }
  }, delta));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/stat-card/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/table/Table.jsx
try { (() => {
function Table({
  columns = [],
  rows = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-sunken)'
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    scope: "col",
    style: {
      textAlign: c.align || 'left',
      padding: '10px 16px',
      font: 'var(--text-overline)',
      letterSpacing: 'var(--tracking-overline)',
      color: 'var(--text-tertiary)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none'
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: '12px 16px',
      font: c.mono ? 'var(--text-mono-sm)' : 'var(--text-body-sm)',
      color: 'var(--text-primary)'
    }
  }, row[c.key])))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/table/Table.jsx", error: String((e && e.message) || e) }); }

// components/tabs/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  activeId,
  onChange
}) {
  const active = activeId ?? tabs[0]?.id;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, tabs.map(t => {
    const isActive = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      role: "tab",
      "aria-selected": isActive,
      onClick: () => onChange && onChange(t.id),
      style: {
        padding: '10px 16px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        font: 'var(--text-body-md)',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--text-brand)' : 'var(--text-secondary)',
        borderBottom: `2px solid ${isActive ? 'var(--brand-solid)' : 'transparent'}`,
        marginBottom: -1
      }
    }, t.label);
  })));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tabs/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/wayfinding/Breadcrumb.jsx
try { (() => {
function Breadcrumb({
  items = []
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Breadcrumb",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-body)'
    }
  }, items.map((item, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      font: 'var(--text-body-sm)'
    }
  }, "/"), i === items.length - 1 ? /*#__PURE__*/React.createElement("span", {
    "aria-current": "page",
    style: {
      font: 'var(--text-body-sm)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, item) : /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      font: 'var(--text-body-sm)',
      color: 'var(--text-secondary)',
      textDecoration: 'none'
    }
  }, item))));
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
  const go = p => p >= 1 && p <= totalPages && onChange && onChange(p);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'var(--font-body)'
    },
    role: "navigation",
    "aria-label": "Pagination"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go(page - 1),
    disabled: page === 1,
    style: btnStyle(false, page === 1),
    "aria-label": "Halaman sebelumnya"
  }, "\u2039"), Array.from({
    length: totalPages
  }, (_, i) => i + 1).slice(0, 6).map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => go(p),
    style: btnStyle(p === page),
    "aria-current": p === page ? 'page' : undefined,
    "aria-label": 'Halaman ' + p
  }, p)), /*#__PURE__*/React.createElement("button", {
    onClick: () => go(page + 1),
    disabled: page === totalPages,
    style: btnStyle(false, page === totalPages),
    "aria-label": "Halaman berikutnya"
  }, "\u203A"));
}
function btnStyle(active, disabled) {
  return {
    minWidth: 32,
    height: 32,
    border: '1px solid ' + (active ? 'var(--brand-solid)' : 'var(--border-default)'),
    borderRadius: 'var(--radius-sm)',
    background: active ? 'var(--brand-solid)' : 'var(--surface-page)',
    color: active ? 'var(--text-on-brand)' : disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
    font: 'var(--text-body-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer'
  };
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

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Navbar = __ds_scope.Navbar;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.Spinner = __ds_scope.Spinner;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.Pagination = __ds_scope.Pagination;

})();
