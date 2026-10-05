import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { DeclarationsDataTableComponent } from '../../../shared/components/tables/data-table/declarations-data-table.component';

@Component({
  selector: 'app-data-table',
  imports: [
    ComponentCardComponent,
    PageBreadcrumbComponent,
    DeclarationsDataTableComponent,
  ],
  templateUrl: './data-table.component.html',
  styles: ``,
})
export class DataTableComponent {

}
