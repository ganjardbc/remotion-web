/**
 * @startingPoint section="Components" subtitle="Menu with active/disabled/divider items" viewport="700x220"
 */
export interface DropdownItem {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}
export interface DropdownProps {
  /** The clickable element that opens the menu — usually a <Button>. */
  trigger?: React.ReactNode;
  items?: DropdownItem[];
}
