import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';


const routes: Routes = [
  { path: '**', redirectTo: 'admin/dashboard'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
