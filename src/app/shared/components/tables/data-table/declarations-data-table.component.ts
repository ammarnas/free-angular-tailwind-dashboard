import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import {
  FlexRender,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  flexRenderComponent,
  globalFilteringFeature,
  injectTable,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
} from '@tanstack/angular-table';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { CUSTOMS_DECLARATIONS, CustomsDeclaration } from './customs-declaration';
import { DeclarationStatusCellComponent } from './declaration-status-cell.component';

// `injectTable`'s initializer re-runs on every signal it reads, so the feature
// set, row models and column defs stay out here as stable module-level
// references. Only the reactive bits (`data()`, `globalFilter()`) go inside it.
const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    text: sortFn_text,
  },
});

const columnHelper = createColumnHelper<typeof features, CustomsDeclaration>();

const omrFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

const columns = columnHelper.columns([
  columnHelper.accessor('reference', {
    header: 'Reference',
    sortFn: 'alphanumeric',
  }),
  columnHelper.accessor('trader', {
    header: 'Trader',
    sortFn: 'text',
  }),
  columnHelper.accessor('port', {
    header: 'Port of entry',
    sortFn: 'text',
  }),
  columnHelper.accessor('movement', {
    header: 'Movement',
    sortFn: 'text',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    // A component cell: TanStack instantiates `DeclarationStatusCellComponent`
    // and binds its signal inputs. See `flexRenderComponent` in CLAUDE.md.
    cell: ({ getValue }) =>
      flexRenderComponent(DeclarationStatusCellComponent, {
        inputs: { status: getValue() },
      }),
  }),
  columnHelper.accessor('valueOmr', {
    header: 'Value (OMR)',
    sortFn: 'basic',
    cell: ({ getValue }) => omrFormat.format(getValue()),
  }),
  columnHelper.accessor('submittedOn', {
    header: 'Submitted',
    sortFn: 'basic',
  }),
]);

@Component({
  selector: 'app-declarations-data-table',
  imports: [CommonModule, FlexRender, InputFieldComponent],
  templateUrl: './declarations-data-table.component.html',
  styles: ``,
})
export class DeclarationsDataTableComponent {
  readonly pageSizeOptions = [5, 8, 10, 20];

  // Signals are confined to this component: the TanStack adapter is
  // signal-based, while the rest of the codebase stays on BehaviorSubjects.
  readonly data = signal<CustomsDeclaration[]>(CUSTOMS_DECLARATIONS);
  readonly globalFilter = signal('');

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    // Global filter is controlled by the signal above; sorting and pagination
    // are left to the table's own reactive state atoms.
    state: { globalFilter: this.globalFilter() },
    onGlobalFilterChange: (updater: unknown) =>
      this.globalFilter.set(
        typeof updater === 'function' ? updater(this.globalFilter()) : (updater as string),
      ),
    globalFilterFn: 'includesString' as const,
    initialState: { pagination: { pageIndex: 0, pageSize: 8 } },
  }));

  readonly pageIndex = computed(() => this.table.store.state.pagination.pageIndex);
  readonly pageSize = computed(() => this.table.store.state.pagination.pageSize);

  /** Rows left after filtering, i.e. everything pagination walks through. */
  readonly filteredRowCount = computed(() => this.table.getRowCount());

  readonly firstRowOnPage = computed(() =>
    this.filteredRowCount() === 0 ? 0 : this.pageIndex() * this.pageSize() + 1,
  );

  readonly lastRowOnPage = computed(() =>
    Math.min((this.pageIndex() + 1) * this.pageSize(), this.filteredRowCount()),
  );

  onSearch(value: string | number): void {
    this.globalFilter.set(String(value));
    // Page 4 of a 24-row list is page 1 of a 3-row result.
    this.table.setPageIndex(0);
  }

  onPageSizeChange(event: Event): void {
    this.table.setPageSize(Number((event.target as HTMLSelectElement).value));
  }
}
