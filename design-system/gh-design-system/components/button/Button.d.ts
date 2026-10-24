export interface ButtonProps {
  /** Visual style. */
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost';
  /** Compact size for dense contexts like navbars and card footers. */
  size?: 'md' | 'sm';
  disabled?: boolean;
  /** Optional icon element rendered before the label. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}
