export interface FieldProps {
  label?: string;
  /** Shown when there is no error. */
  helperText?: string;
  /** Shown instead of helperText and switches the field into its error styling. */
  errorText?: string;
  children?: React.ReactNode;
}
