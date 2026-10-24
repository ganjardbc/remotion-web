EmptyState — centered zero-data placeholder: icon, short title, one line of description, one action.

```jsx
<EmptyState
  icon={<svg className="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>}
  title="No schedule yet"
  description="Content you schedule will show up here."
  action={<Button variant="primary">Create schedule</Button>}
/>
```
