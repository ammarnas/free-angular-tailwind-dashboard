import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { SearchFilterDemoComponent } from './pages/forms/search-filter-demo/search-filter-demo.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { DataTableComponent } from './pages/tables/data-table/data-table.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent,
    children:[
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title:
          'لوحة التحكم | الهيئة العامة للمنافذ والجمارك',
      },
      {
        path:'calendar',
        component:CalenderComponent,
        title:'Calender | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'profile',
        component:ProfileComponent,
        title:'Profile | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'form-elements',
        component:FormElementsComponent,
        title:'Form Elements | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'search-filter',
        component:SearchFilterDemoComponent,
        title:'Search & Filter | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'basic-tables',
        component:BasicTablesComponent,
        title:'Basic Tables | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'data-table',
        component:DataTableComponent,
        title:'Data Table | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'blank',
        component:BlankComponent,
        title:'Blank | الهيئة العامة للمنافذ والجمارك'
      },
      // support tickets
      {
        path:'invoice',
        component:InvoicesComponent,
        title:'Invoice Details | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'line-chart',
        component:LineChartComponent,
        title:'Line Chart | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'bar-chart',
        component:BarChartComponent,
        title:'Bar Chart | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'alerts',
        component:AlertsComponent,
        title:'Alerts | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'avatars',
        component:AvatarElementComponent,
        title:'Avatars | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'badge',
        component:BadgesComponent,
        title:'Badges | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'buttons',
        component:ButtonsComponent,
        title:'Buttons | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'images',
        component:ImagesComponent,
        title:'Images | الهيئة العامة للمنافذ والجمارك'
      },
      {
        path:'videos',
        component:VideosComponent,
        title:'Videos | الهيئة العامة للمنافذ والجمارك'
      },
    ]
  },
  // auth pages
  {
    path:'signin',
    component:SignInComponent,
    title:'Sign In | الهيئة العامة للمنافذ والجمارك'
  },
  {
    path:'signup',
    component:SignUpComponent,
    title:'Sign Up | الهيئة العامة للمنافذ والجمارك'
  },
  // error pages
  {
    path:'**',
    component:NotFoundComponent,
    title:'NotFound | الهيئة العامة للمنافذ والجمارك'
  },
];
