import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminModule } from './admin/admin.module';
import { AlumnoModule } from './alumno/alumno.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditorModule } from './editor/editor.module';
import { LandingModule } from './landing/landing.module';


@NgModule({
  declarations: [
    UserProfileComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminModule,
    AlumnoModule,
    EditorModule,
    LandingModule

  ]
})
export class PagesModule { }
