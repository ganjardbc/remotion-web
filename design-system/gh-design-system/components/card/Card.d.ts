export interface CardProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Lifts on hover and shows a pointer cursor — use when the whole card is clickable. */
  interactive?: boolean;
}
