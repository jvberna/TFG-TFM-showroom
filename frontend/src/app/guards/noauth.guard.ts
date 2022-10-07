import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoauthGuard implements CanActivate {

  constructor( private UsuarioService: UsuarioService,
                private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.UsuarioService.validarNoToken()
              .pipe(
                tap( resp => {
                  if (!resp) {
                    switch (this.UsuarioService.rol) {
                      case 'ROL_ADMIN':
                          this.router.navigateByUrl('/admin/usuarios');
                          break;
                        case 'ROL_ALUMNO':
                          this.router.navigateByUrl('/alumno/trabajos');
                          break;
                        case 'ROL_EDITOR':
                          this.router.navigateByUrl('/editor/trabajos');
                          break;
                        case 'ROL_EMPRESA':
                          this.router.navigateByUrl('/landing');
                          break;
                    }
                    //this.router.navigateByUrl('/dashboard');
                  }
                })
              );
  }
}
