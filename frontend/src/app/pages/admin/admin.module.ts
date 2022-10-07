//MODULES
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../../components/components.module';
//COMPONENTS
import { NuevousuarioComponent } from './nuevousuario/nuevousuario.component';
import { GestionUsuariosComponent } from './gestionusuarios/gestionusuarios.component';
import { AdminComponent } from './admin.component';
import { GestionTrabajosComponent } from './gestiontrabajos/gestiontrabajos.component';
import { NuevotrabajoComponent } from './nuevotrabajo/nuevotrabajo.component';
import { GestionTitulacionesComponent } from './gestiontitulaciones/gestiontitulaciones.component';
import { NuevatitulacionComponent } from './nuevatitulacion/nuevatitulacion.component';
import { ActualizarusuarioComponent } from './actualizarusuario/actualizarusuario.component';
import { ActualizartrabajoComponent } from './actualizartrabajo/actualizartrabajo.component';
import { ActualizartitulacionComponent } from './actualizartitulacion/actualizartitulacion.component';
import { ActualizarcontstrabajoComponent } from './actualizarcontstrabajo/actualizarcontstrabajo.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule,
    ComponentsModule
  ],
  declarations: [
    GestionUsuariosComponent,
    NuevousuarioComponent,
    AdminComponent,
    GestionTrabajosComponent,
    NuevotrabajoComponent,
    GestionTitulacionesComponent,
    NuevatitulacionComponent,
    ActualizarusuarioComponent,
    ActualizartrabajoComponent,
    ActualizartitulacionComponent,
    ActualizarcontstrabajoComponent
  ],
  // exports:[
  //   UserProfileComponent,
  //   DashboardUsuariosComponent,
  //   NuevousuarioComponent,
  //   AdminComponent
  // ]
})

export class AdminModule {}
