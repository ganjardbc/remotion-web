export interface AvatarProps {
  /** Shown when no src is given. */
  initials?: string;
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}
