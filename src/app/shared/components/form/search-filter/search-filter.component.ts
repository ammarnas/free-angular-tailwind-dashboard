import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';
import { ButtonComponent } from '../../ui/button/button.component';
import { CheckboxComponent } from '../input/checkbox.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { InputFieldComponent } from '../input/input-field.component';
import { LabelComponent } from '../label/label.component';
import { MultiSelectComponent } from '../multi-select/multi-select.component';
import { SelectComponent } from '../select/select.component';
import {
  FilterField,
  FilterValue,
  FilterValues,
  RangeValue,
  SearchFilterConfig,
} from './search-filter.model';

type MultiOption = { value: string; text: string };

@Component({
  selector: 'app-search-filter',
  imports: [
    CommonModule,
    ButtonComponent,
    CheckboxComponent,
    DatePickerComponent,
    InputFieldComponent,
    LabelComponent,
    MultiSelectComponent,
    SelectComponent,
    SafeHtmlPipe,
  ],
  templateUrl: './search-filter.component.html',
  styles: ``,
})
export class SearchFilterComponent implements OnInit {

  @Input() config!: SearchFilterConfig;
  /** Read initial values from the query string and write them back on search/reset. */
  @Input() syncToUrl = false;
  /** Emit `search` once during init with the restored (or default) values. */
  @Input() emitOnInit = false;
  /** Disables both buttons and swaps the search icon for a spinner. */
  @Input() loading = false;
  /** Skip the card chrome — use when nesting inside `<app-component-card>`. */
  @Input() bare = false;
  @Input() className = '';

  @Output() search = new EventEmitter<FilterValues>();
  @Output() reset = new EventEmitter<FilterValues>();
  /** Mirrors the in-progress state. Does NOT mean a search was requested. */
  @Output() valuesChange = new EventEmitter<FilterValues>();

  values: FilterValues = {};
  isCollapsed = false;

  /** Flatpickr keeps its own input text, so reset has to clear each picker directly. */
  @ViewChildren(DatePickerComponent) datePickers!: QueryList<DatePickerComponent>;

  dateDefaults: Record<string, string | string[] | undefined> = {};
  multiOptions: Record<string, MultiOption[]> = {};

  readonly searchIcon =
    '<svg class="fill-current" width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M9.375 3.042a6.333 6.333 0 1 0 0 12.667 6.333 6.333 0 0 0 0-12.667Zm-7.833 6.333a7.833 7.833 0 1 1 14.04 4.79l2.655 2.655a.75.75 0 1 1-1.06 1.06l-2.656-2.654A7.833 7.833 0 0 1 1.542 9.375Z"/></svg>';

  readonly resetIcon =
    '<svg class="fill-current" width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M10 3.5a6.5 6.5 0 1 0 6.5 6.5.75.75 0 0 1 1.5 0 8 8 0 1 1-2.283-5.593V3.083a.75.75 0 0 1 1.5 0V6.25a.75.75 0 0 1-.75.75H13.3a.75.75 0 0 1 0-1.5h1.608A6.48 6.48 0 0 0 10 3.5Z"/></svg>';

  readonly spinnerIcon =
    '<svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-opacity="0.25"/>' +
    '<path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';

  readonly chevronIcon =
    '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M4.792 7.396 10 12.604l5.208-5.208" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isCollapsed = !!this.config?.collapsible && !!this.config?.collapsedByDefault;
    this.values = this.defaultValues();

    if (this.syncToUrl) {
      this.readFromUrl();
    }
    this.refreshDerived();

    if (this.emitOnInit) {
      this.search.emit(this.payload());
    }
  }

  // --- config helpers -------------------------------------------------------

  get fields(): FilterField[] {
    return this.config?.fields ?? [];
  }

  get title(): string {
    return this.config?.title ?? 'Filters';
  }

  get searchLabel(): string {
    return this.config?.searchLabel ?? 'Search';
  }

  get resetLabel(): string {
    return this.config?.resetLabel ?? 'Reset';
  }

  get collapsible(): boolean {
    return !!this.config?.collapsible;
  }

  /** Static class strings so Tailwind's scanner keeps these utilities. */
  get gridClasses(): string {
    switch (this.config?.columns ?? 4) {
      case 1:
        return 'grid grid-cols-1 gap-4';
      case 2:
        return 'grid grid-cols-1 gap-4 sm:grid-cols-2';
      case 3:
        return 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4';
    }
  }

  colSpanClasses(field: FilterField): string {
    switch (field.colSpan) {
      case 2:
        return 'sm:col-span-2';
      case 3:
        return 'sm:col-span-2 lg:col-span-3';
      case 4:
        return 'sm:col-span-2 lg:col-span-4';
      default:
        return '';
    }
  }

  fieldId(field: FilterField): string {
    return 'filter-' + field.key;
  }

  /** Number of criteria currently carrying a value — shown as a badge in the header. */
  get activeCount(): number {
    return this.fields.filter(field => !this.isEmpty(this.values[field.key])).length;
  }

  // --- value accessors used by the template ---------------------------------

  scalarValue(field: FilterField): string | number {
    const value = this.values[field.key];
    return typeof value === 'string' || typeof value === 'number' ? value : '';
  }

  selectValue(field: FilterField): string {
    const value = this.values[field.key];
    return typeof value === 'string' ? value : '';
  }

  booleanValue(field: FilterField): boolean {
    return this.values[field.key] === true;
  }

  multiValue(field: FilterField): string[] {
    const value = this.values[field.key];
    return Array.isArray(value) ? value : [];
  }

  rangeEdge(field: FilterField, edge: 'from' | 'to'): string | number {
    const range = this.values[field.key] as RangeValue | RangeValue<number> | null;
    const edgeValue = range ? range[edge] : null;
    return edgeValue === null || edgeValue === undefined ? '' : edgeValue;
  }

  // --- change handlers (never trigger a search) -----------------------------

  setText(field: FilterField, value: string | number): void {
    this.values[field.key] = value;
    this.valuesChange.emit({ ...this.values });
  }

  setNumber(field: FilterField, value: string | number): void {
    this.values[field.key] = value === '' ? null : Number(value);
    this.valuesChange.emit({ ...this.values });
  }

  setBoolean(field: FilterField, checked: boolean): void {
    this.values[field.key] = checked;
    this.valuesChange.emit({ ...this.values });
  }

  setMulti(field: FilterField, selected: string[]): void {
    this.values[field.key] = [...selected];
    this.valuesChange.emit({ ...this.values });
  }

  setNumberRange(field: FilterField, edge: 'from' | 'to', value: string | number): void {
    const current = (this.values[field.key] as RangeValue<number> | null) ?? { from: null, to: null };
    const next: RangeValue<number> = { from: current.from ?? null, to: current.to ?? null };
    next[edge] = value === '' ? null : Number(value);
    this.values[field.key] = next;
    this.valuesChange.emit({ ...this.values });
  }

  setDate(field: FilterField, event: { selectedDates?: Date[] }): void {
    const dates = event?.selectedDates ?? [];

    if (field.type === 'daterange') {
      this.values[field.key] = {
        from: dates[0] ? this.toIsoDate(dates[0]) : null,
        to: dates[1] ? this.toIsoDate(dates[1]) : null,
      };
    } else {
      this.values[field.key] = dates[0] ? this.toIsoDate(dates[0]) : null;
    }
    this.valuesChange.emit({ ...this.values });
  }

  // --- actions --------------------------------------------------------------

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onSearch(): void {
    if (this.loading) {
      return;
    }
    const payload = this.payload();
    if (this.syncToUrl) {
      this.writeToUrl();
    }
    this.search.emit(payload);
  }

  onReset(): void {
    if (this.loading) {
      return;
    }
    this.values = this.defaultValues();
    this.refreshDerived();
    this.datePickers?.forEach(picker => picker.clear());

    if (this.syncToUrl) {
      this.writeToUrl();
    }
    const payload = this.payload();
    this.valuesChange.emit({ ...this.values });
    this.reset.emit(payload);
  }

  // --- internals ------------------------------------------------------------

  private defaultValues(): FilterValues {
    const values: FilterValues = {};
    for (const field of this.fields) {
      values[field.key] = field.defaultValue !== undefined
        ? this.cloneValue(field.defaultValue)
        : this.blankValue(field);
    }
    return values;
  }

  private blankValue(field: FilterField): FilterValue {
    switch (field.type) {
      case 'boolean':
        return false;
      case 'multiselect':
        return [];
      case 'daterange':
      case 'numberrange':
        return { from: null, to: null };
      default:
        return '';
    }
  }

  private cloneValue(value: FilterValue): FilterValue {
    if (Array.isArray(value)) {
      return [...value];
    }
    if (value && typeof value === 'object') {
      return { ...(value as RangeValue) };
    }
    return value;
  }

  /** Keeps the flatpickr defaults and multi-select option shape in step with `values`. */
  private refreshDerived(): void {
    this.dateDefaults = {};
    this.multiOptions = {};

    for (const field of this.fields) {
      if (field.type === 'date') {
        const value = this.values[field.key];
        this.dateDefaults[field.key] = typeof value === 'string' && value ? value : undefined;
      }
      if (field.type === 'daterange') {
        const range = this.values[field.key] as RangeValue | null;
        const dates = [range?.from, range?.to].filter((date): date is string => !!date);
        this.dateDefaults[field.key] = dates.length ? dates : undefined;
      }
      if (field.type === 'multiselect') {
        this.multiOptions[field.key] = (field.options ?? []).map(option => ({
          value: option.value,
          text: option.label,
        }));
      }
    }
  }

  private isEmpty(value: FilterValue | undefined): boolean {
    if (value === null || value === undefined || value === '' || value === false) {
      return true;
    }
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    if (typeof value === 'object') {
      const range = value as RangeValue;
      return this.isEmptyEdge(range.from) && this.isEmptyEdge(range.to);
    }
    return false;
  }

  private isEmptyEdge(edge: string | number | null | undefined): boolean {
    return edge === null || edge === undefined || edge === '';
  }

  private payload(): FilterValues {
    const omitEmpty = this.config?.omitEmpty !== false;
    const payload: FilterValues = {};

    for (const field of this.fields) {
      const value = this.values[field.key];
      if (omitEmpty && this.isEmpty(value)) {
        continue;
      }
      payload[field.key] = this.cloneValue(value ?? null);
    }
    return payload;
  }

  private toIsoDate(date: Date): string {
    // Local parts, not toISOString(), so the day never shifts across timezones.
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return date.getFullYear() + '-' + month + '-' + day;
  }

  // --- query string codec ---------------------------------------------------

  private readFromUrl(): void {
    const params = this.route.snapshot.queryParamMap;

    for (const field of this.fields) {
      if (field.type === 'daterange' || field.type === 'numberrange') {
        const from = params.get(field.key + 'From');
        const to = params.get(field.key + 'To');
        if (from === null && to === null) {
          continue;
        }
        this.values[field.key] = field.type === 'numberrange'
          ? { from: from === null || from === '' ? null : Number(from), to: to === null || to === '' ? null : Number(to) }
          : { from: from || null, to: to || null };
        continue;
      }

      const raw = params.get(field.key);
      if (raw === null) {
        continue;
      }

      switch (field.type) {
        case 'multiselect':
          this.values[field.key] = raw.split(',').map(part => part.trim()).filter(Boolean);
          break;
        case 'boolean':
          this.values[field.key] = raw === 'true';
          break;
        case 'number':
          this.values[field.key] = raw === '' ? null : Number(raw);
          break;
        default:
          this.values[field.key] = raw;
      }
    }
  }

  /** Writes only this component's own keys, so sibling params (paging, tabs) survive. */
  private writeToUrl(): void {
    const queryParams: Params = {};

    for (const field of this.fields) {
      const value = this.values[field.key];

      if (field.type === 'daterange' || field.type === 'numberrange') {
        const range = (value ?? { from: null, to: null }) as RangeValue | RangeValue<number>;
        queryParams[field.key + 'From'] = this.isEmptyEdge(range.from) ? null : String(range.from);
        queryParams[field.key + 'To'] = this.isEmptyEdge(range.to) ? null : String(range.to);
        continue;
      }

      if (this.isEmpty(value)) {
        queryParams[field.key] = null;
        continue;
      }

      queryParams[field.key] = Array.isArray(value) ? value.join(',') : String(value);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
