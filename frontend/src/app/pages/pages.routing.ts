import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
//COMPONENTS ADMIN
import { AdminComponent } from './admin/admin.component';
import { GestionUsuariosComponent } from './admin/gestionusuarios/gestionusuarios.component';
import { GestionTrabajosComponent } from './admin/gestiontrabajos/gestiontrabajos.component';
import { GestionTitulacionesComponent } from './admin/gestiontitulaciones/gestiontitulaciones.component';
import { NuevousuarioComponent } from './admin/nuevousuario/nuevousuario.component';
import { NuevotrabajoComponent } from './admin/nuevotrabajo/nuevotrabajo.component';
import { NuevatitulacionComponent } from './admin/nuevatitulacion/nuevatitulacion.component';
import { ActualizarusuarioComponent } from './admin/actualizarusuario/actualizarusuario.component';
import { ActualizartrabajoComponent } from './admin/actualizartrabajo/actualizartrabajo.component';
import { ActualizarcontstrabajoComponent } from './admin/actualizarcontstrabajo/actualizarcontstrabajo.component';
import { ActualizartitulacionComponent } from './admin/actualizartitulacion/actualizartitulacion.component';
//COMPONENTS ALUMNO
import { AlumnoComponent } from './alumno/alumno.component';
import { TrabajosComponent } from './alumno/trabajos/trabajos.component';
import { NuevostrabajosComponent } from './alumno/nuevostrabajos/nuevostrabajos.component';
import { SubirtrabajoComponent } from './alumno/subirtrabajo/subirtrabajo.component';
import { SubircontenidosComponent } from './alumno/subircontenidos/subircontenidos.component';
//COMPONENTS EDITOR
import { EditorComponent } from './editor/editor.component';
import { RevisiontrabajosComponent } from './editor/revisiontrabajos/revisiontrabajos.component';
import { PreviewtrabajoComponent } from './landing/previewtrabajo/previewtrabajo.component';
//COMPONENT PERFIL GENERAL
import { UserProfileComponent } from './user-profile/user-profile.component';
//COMPONENTS LANDING
import { LandingComponent } from './landing/landing.component';
import { InicioComponent } from './landing/inicio/inicio.component';
import { DetallestrabajoComponent } from './landing/detallestrabajo/detallestrabajo.component';
import { ResultadosComponent } from './landing/resultados/resultados.component';










export const routes: Routes = [


  //PATHS ADMIN

  { path: 'admin', component: AdminComponent,canActivate: [ AuthGuard], data: {rol: 'ROL_ADMIN'},
  children:[
    { path: 'usuarios', component: GestionUsuariosComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ADMIN',
                                                            titulo: 'Showroom Admin - Gestión Usuarios',
                                                            breadcrums: []
                                                          },},
    { path: 'trabajos', component: GestionTrabajosComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ADMIN',
                                                            titulo: 'Showroom Admin - Gestión Trabajos',
                                                            breadcrums: []
                                                          },},
    { path: 'titulaciones', component: GestionTitulacionesComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ADMIN',
                                                            titulo: 'Showroom Admin - Gestión Titulaciones',
                                                            breadcrums: []
                                                          },},
    { path: 'perfil',  component: UserProfileComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ADMIN',
                                                            titulo: 'Perfil',
                                                            breadcrums: []
                                                          },},
    { path: 'nuevousu', component: NuevousuarioComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ADMIN',
                                                            titulo: 'Showroom Admin - Nuevo Usuario',
                                                            breadcrums: [{titulo: 'Usuarios', url: '/admin/usuarios'}]
                                                          }},
    { path: 'nuevotrabajo', component: NuevotrabajoComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ADMIN',
                                                            titulo: 'Showroom Admin - Nuevo Trabajo',
                                                            breadcrums: [{titulo: 'Trabajos', url: '/admin/trabajos'}]
                                                          }},
    { path: 'nuevatitulacion', component: NuevatitulacionComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ADMIN',
                                                            titulo: 'Showroom Admin - Nueva Titulación',
                                                            breadcrums: [{titulo: 'Titulaciones', url: '/admin/titulaciones'}]
                                                          }},
    { path: 'actualizarusuario/:uid', component: ActualizarusuarioComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ADMIN',
                                                            titulo: 'Showroom Admin - Actualizar Usuario',
                                                            breadcrums: [{titulo: 'Usuarios', url: '/admin/usuarios'}]
                                                          }},
    { path: 'actualizartrabajo/:uid', component: ActualizartrabajoComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ADMIN',
                                                            titulo: 'Showroom Admin - Actualizar Trabajo',
                                                            breadcrums: [{titulo: 'Trabajos', url: '/admin/trabajos'}]
                                                          }},
    { path: 'actualizarcontstrabajo/:uid', component: ActualizarcontstrabajoComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ADMIN',
                                                            titulo: 'Showroom Admin - Actualizar Contenidos Trabajo',
                                                            breadcrums: [{titulo: 'Trabajos', url: '/admin/trabajos'}]
                                                          }},
    { path: 'actualizartitulacion/:uid', component: ActualizartitulacionComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ADMIN',
                                                            titulo: 'Showroom Admin - Actualizar Titulación',
                                                            breadcrums: [{titulo: 'Titulaciones', url: '/admin/titulaciones'}]
                                                          }},

    { path: '**', redirectTo: 'admin/usuarios'}
  ]},

  //PATHS ALUMNO
  { path: 'alumno', component: AlumnoComponent,canActivate: [ AuthGuard], data: {rol: 'ROL_ALUMNO'},
  children:[
    { path: 'perfil',  component: UserProfileComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ALUMNO',
                                                            titulo: 'Perfil',
                                                            breadcrums: []
                                                          },},
    { path: 'trabajos', component: TrabajosComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ALUMNO',
                                                            titulo: 'Showroom Alumno - Trabajos subidos',
                                                            breadcrums: []
                                                          },},
    { path: 'nuevostrabajos', component: NuevostrabajosComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ALUMNO',
                                                            titulo: 'Showroom Alumno - Trabajos para Editar',
                                                            breadcrums: []
                                                          },},
    { path: 'subirtrabajo/:uid', component: SubirtrabajoComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ALUMNO',
                                                            titulo: 'Showroom Alumno - Editar Trabajo',
                                                            breadcrums: []
                                                          },},
    { path: 'subircontenidos/:uid', component: SubircontenidosComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ALUMNO',
                                                            titulo: 'Showroom Alumno - Subir Contenidos Trabajo',
                                                            breadcrums: []
                                                          },},

    { path: '**', redirectTo: 'alumno/trabajos'}
  ]},

  //PATHS EDITOR
  { path: 'editor', component: EditorComponent,canActivate: [ AuthGuard], data: {rol: 'ROL_EDITOR'},
  children:[
    { path: 'perfil',  component: UserProfileComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_ALUMNO',
                                                            titulo: 'Perfil',
                                                            breadcrums: []
                                                          },},
    { path: 'revisiontrabajos', component: RevisiontrabajosComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_EDITOR',
                                                            titulo: 'Showroom Editor - Trabajos para revisar',
                                                            breadcrums: []
                                                          },},
    { path: 'previewtrabajo/:uid', component: PreviewtrabajoComponent, canActivate: [ AuthGuard ], data: {
                                                            rol: 'ROL_EDITOR',
                                                            titulo: 'Showroom Editor - Revisión Trabajo',
                                                          },},
    { path: '**', redirectTo: 'editor/revisiontrabajos'}
  ]},

  //PATH PREVIEW TRABAJO
  // { path: 'editor/previewtrabajo/:uid', component: PreviewtrabajoComponent, data: {
  //   rol: 'ROL_EDITOR',
  //   titulo: 'Showroom Editor - Revisión Trabajo',
  // },},


  //http://localhost:4200/landing/trabajo/62d5d6279515244889ebb28d
  //PATHS LANDING
  { path: 'landing', component: LandingComponent,
  children:[
    { path: 'inicio',  component: InicioComponent, data: {
      titulo: 'Inicio',
      breadcrums: []
    },},
    { path: 'trabajo/:uid',  component: DetallestrabajoComponent, data: {
      titulo: 'Ficha Trabajo',
      breadcrums: []
    },},
    { path: 'busqueda/:texto',  component: ResultadosComponent, data: {
      titulo: 'Búsqueda Trabajos',
      breadcrums: []
    },},
    { path: '',  component: InicioComponent, data: {
      titulo: 'Inicio',
      breadcrums: []
    },},

    { path: '**', redirectTo: 'landing/inicio'}

  ]},


  { path: '**', redirectTo: 'landing/inicio'}

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
