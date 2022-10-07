import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTESADMIN: RouteInfo[] = [
  { path: 'usuarios', title: 'Gestión Usuarios',  icon:'users_single-02', class: '' },
  { path: 'trabajos', title: 'Gestión Trabajos',  icon:'design_bullet-list-67', class: '' },
  { path: 'titulaciones', title: 'Gestión Titulaciones',  icon:'design_bullet-list-67', class: '' },
  //{ path: 'perfil', title: 'Perfil',  icon:'users_single-02', class: '' },
    //{ path: '/upgrade', title: 'Upgrade to PRO',  icon:'objects_spaceship', class: 'active active-pro' }
];

export const ROUTESALUMNOS: RouteInfo[] = [
  { path: 'trabajos', title: 'Trabajos subidos',  icon:'design_bullet-list-67', class: '' },
  { path: 'nuevostrabajos', title: 'Trabajos para editar',  icon:'design_bullet-list-67', class: '' }
];

export const ROUTESEDITOR: RouteInfo[] = [
  { path: 'revisiontrabajos', title: 'Revisión Trabajos',  icon:'design_bullet-list-67', class: '' }
];



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})


export class SidebarComponent implements OnInit {
  menuItems: any[];
  public rollog;
  constructor(private UsuarioService: UsuarioService) { }

  ngOnInit() {
    this.rollog= this.UsuarioService.rol;
    if(this.UsuarioService.rol=="ROL_ADMIN"){
      this.menuItems = ROUTESADMIN.filter(menuItem => menuItem);
    }
    else if(this.UsuarioService.rol=="ROL_ALUMNO"){
      this.menuItems = ROUTESALUMNOS.filter(menuItem => menuItem);
    }
    else if(this.UsuarioService.rol=="ROL_EDITOR"){
      this.menuItems = ROUTESEDITOR.filter(menuItem => menuItem);
    }

  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
