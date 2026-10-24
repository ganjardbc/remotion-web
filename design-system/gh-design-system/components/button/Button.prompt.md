Button — the one clickable-action shape in the system; only color changes across variants, never shape or size logic.

```jsx
<Button variant="primary">Save</Button>
<Button variant="accent">Upgrade</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

Variants: `primary` (brand blue, main CTA), `accent` (orange highlight, use for at most one control per screen), `secondary` (soft blue), `outline`, `ghost`. Wrap in `.on-ground` (or render inside a container with that class) to auto-flip outline/ghost to white on the brand-blue field. Disabled drops opacity to 0.45.
