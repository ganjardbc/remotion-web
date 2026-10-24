export interface TabsProps {
  tabs?: string[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  /** Content of the active panel — Tabs itself is not aware of tab-to-content mapping. */
  children?: React.ReactNode;
}
