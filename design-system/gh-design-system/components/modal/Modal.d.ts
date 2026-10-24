export interface ModalProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Usually two <Button>s (ghost cancel + primary confirm). */
  footer?: React.ReactNode;
  onClose?: () => void;
}
