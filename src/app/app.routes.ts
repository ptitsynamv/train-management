import { Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { DetailsComponent } from './components/details/details.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'train/:id', component: DetailsComponent },
  { path: '**', component: PageNotFoundComponent },
];
