Dropdown — click-to-open menu anchored to its trigger. Items share the default/hover/is-active/disabled pattern used by NavbarLink and Pagination's page items.

```jsx
<Dropdown
  trigger={<Button variant="outline">Menu</Button>}
  items={[{ label: 'Profile', active: true }, { label: 'Schedule' }, { divider: true }, { label: 'Archived', disabled: true }, { label: 'Log out' }]}
/>
```
