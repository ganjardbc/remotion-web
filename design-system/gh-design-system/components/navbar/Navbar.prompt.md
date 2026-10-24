Navbar — site/app header: brand mark + wordmark, nav links, one CTA button.

```jsx
<Navbar
  brand={<><Badge />GH</>}
  links={[{ label: 'Home', active: true }, { label: 'Content' }, { label: 'About' }]}
  cta={<Button size="sm">Contact</Button>}
/>
```

Set `onGround` when placing the navbar directly on the near-black field (a marketing page hero) — background goes transparent and text flips to white; pair with `variant="outline"` or `"ghost"` on the CTA.
