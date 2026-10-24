Tabs — underline-style tab switcher. It only renders the strip + one panel; the caller decides which content to show for the active index.

```jsx
const [i, setI] = useState(0);
<Tabs tabs={['Overview', 'Activity', 'Settings']} activeIndex={i} onChange={setI}>
  Content for the active tab goes here.
</Tabs>
```
