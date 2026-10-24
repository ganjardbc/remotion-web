/**
 * @startingPoint section="Components" subtitle="Site/app header, light or on-ground" viewport="700x120"
 */
export interface NavLink { label: string; href?: string; active?: boolean; }
export interface NavbarProps {
  brand?: React.ReactNode;
  links?: NavLink[];
  /** Usually a <Button>. */
  cta?: React.ReactNode;
  /** Render for use on the near-black .on-ground field (transparent bg, white text). */
  onGround?: boolean;
}
