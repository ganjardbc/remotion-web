export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  /** Force error border without wrapping in a Field with errorText. */
  invalid?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
