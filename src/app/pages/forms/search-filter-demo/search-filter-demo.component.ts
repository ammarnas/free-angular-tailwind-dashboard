import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { SearchFilterComponent } from '../../../shared/components/form/search-filter/search-filter.component';
import {
  FilterValues,
  SearchFilterConfig,
} from '../../../shared/components/form/search-filter/search-filter.model';

@Component({
  selector: 'app-search-filter-demo',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    ComponentCardComponent,
    SearchFilterComponent,
  ],
  templateUrl: './search-filter-demo.component.html',
  styles: ``,
})
export class SearchFilterDemoComponent {

  /** Minimal bar: one keyword box plus one dropdown. */
  compactConfig: SearchFilterConfig = {
    title: 'Quick search',
    columns: 2,
    fields: [
      {
        key: 'keyword',
        type: 'text',
        label: 'Keyword',
        placeholder: 'Search by name or email',
      },
      {
        key: 'role',
        type: 'select',
        label: 'Role',
        placeholder: 'Any role',
        options: [
          { value: 'admin', label: 'Admin' },
          { value: 'editor', label: 'Editor' },
          { value: 'viewer', label: 'Viewer' },
        ],
      },
    ],
  };

  /** Every supported field type, collapsible, with its state mirrored into the URL. */
  fullConfig: SearchFilterConfig = {
    title: 'Order filters',
    columns: 4,
    collapsible: true,
    fields: [
      {
        key: 'reference',
        type: 'text',
        label: 'Reference',
        placeholder: 'e.g. #323534',
        colSpan: 2,
      },
      {
        key: 'status',
        type: 'select',
        label: 'Status',
        placeholder: 'Any status',
        options: [
          { value: 'paid', label: 'Paid' },
          { value: 'unpaid', label: 'Unpaid' },
          { value: 'draft', label: 'Draft' },
        ],
      },
      {
        key: 'channels',
        type: 'multiselect',
        label: 'Channels',
        placeholder: 'Any channel',
        options: [
          { value: 'web', label: 'Web store' },
          { value: 'pos', label: 'Point of sale' },
          { value: 'marketplace', label: 'Marketplace' },
          { value: 'phone', label: 'Phone order' },
        ],
      },
      {
        key: 'createdOn',
        type: 'date',
        label: 'Created on',
        placeholder: 'Pick a day',
      },
      {
        key: 'dueBetween',
        type: 'daterange',
        label: 'Due between',
        placeholder: 'Start — end',
        colSpan: 2,
      },
      {
        key: 'items',
        type: 'number',
        label: 'Item count',
        placeholder: 'Exactly',
        min: '0',
        step: 1,
      },
      {
        key: 'total',
        type: 'numberrange',
        label: 'Total (USD)',
        fromPlaceholder: 'Min',
        toPlaceholder: 'Max',
        min: '0',
        step: 10,
        colSpan: 2,
      },
      {
        key: 'archived',
        type: 'boolean',
        label: 'Include archived',
        hint: 'Off by default',
      },
    ],
  };

  lastEvent = '';
  lastPayload: FilterValues | null = null;
  eventLog: string[] = [];

  onSearch(source: string, values: FilterValues): void {
    this.record(source + ' → search', values);
  }

  onReset(source: string, values: FilterValues): void {
    this.record(source + ' → reset', values);
  }

  private record(label: string, values: FilterValues): void {
    this.lastEvent = label;
    this.lastPayload = values;
    this.eventLog = [`${this.timestamp()}  ${label}`, ...this.eventLog].slice(0, 8);
  }

  private timestamp(): string {
    const now = new Date();
    const pad = (part: number) => ('0' + part).slice(-2);
    return pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  }
}
