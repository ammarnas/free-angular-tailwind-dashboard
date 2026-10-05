// Configuration contract for `<app-search-filter>`.
// A consumer describes the criteria it wants to collect and the component renders the matching
// controls, then emits the collected values. It never filters data itself.

export type FilterFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'daterange'
  | 'numberrange'
  | 'boolean';

export interface FilterOption {
  value: string;
  label: string;
}

export interface RangeValue<T = string> {
  from: T | null;
  to: T | null;
}

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | RangeValue
  | RangeValue<number>
  | null;

export type FilterValues = Record<string, FilterValue>;

export interface FilterField {
  /** Key used in the emitted payload and as the query param name. */
  key: string;
  type: FilterFieldType;
  label?: string;
  placeholder?: string;
  /** Required for `select` and `multiselect`. */
  options?: FilterOption[];
  /** Initial value, and the value `Reset` returns to. */
  defaultValue?: FilterValue;
  /** Grid columns this field consumes at `lg` and up. Defaults to 1. */
  colSpan?: 1 | 2 | 3 | 4;
  disabled?: boolean;
  hint?: string;
  /** `number` and `numberrange` only. */
  min?: string;
  max?: string;
  step?: number;
  /** `numberrange` and `daterange` only. */
  fromPlaceholder?: string;
  toPlaceholder?: string;
}

export interface SearchFilterConfig {
  fields: FilterField[];
  /** Panel heading. Defaults to 'Filters'. */
  title?: string;
  /** Grid columns at `lg` and up. Defaults to 4. */
  columns?: 1 | 2 | 3 | 4;
  /** Defaults to 'Search'. */
  searchLabel?: string;
  /** Defaults to 'Reset'. */
  resetLabel?: string;
  /** Render a chevron that hides the field grid. Defaults to false. */
  collapsible?: boolean;
  collapsedByDefault?: boolean;
  /** Drop empty values ('', null, [], all-null ranges) from the emitted payload. Defaults to true. */
  omitEmpty?: boolean;
}
