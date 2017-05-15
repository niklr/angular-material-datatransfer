import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DataTableDemo } from './data-table/data-table-demo';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent},
  { path: 'table', component: DataTableDemo}
];

export const routing = RouterModule.forRoot(routes);
