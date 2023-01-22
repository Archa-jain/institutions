import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutionsListComponent } from './Components/institutions-list/institutions-list.component';
import { NewInstitutionComponent } from './Components/new-institution/new-institution.component';

const routes: Routes = [
  {
    path: '',
    component: InstitutionsListComponent,
  },
  {
    path: 'new-institution',
    component: NewInstitutionComponent,
  },
  {
    path: 'institution/:id',
    component: NewInstitutionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
