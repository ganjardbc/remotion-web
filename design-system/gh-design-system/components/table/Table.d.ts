export interface TableProps {
  columns?: string[];
  /** Each row is an array of cell nodes, one per column. */
  rows?: React.ReactNode[][];
}
