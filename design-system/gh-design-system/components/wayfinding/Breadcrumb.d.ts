export interface BreadcrumbItem { label: string; href?: string; }
export interface BreadcrumbProps {
  /** Last item renders as the non-linked current page. */
  items?: BreadcrumbItem[];
}
