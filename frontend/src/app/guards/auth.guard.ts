import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

//descomentar y adaptar cuando esté listo

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private UsuarioService: UsuarioService,
               private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.UsuarioService.validarToken()
              .pipe(
                tap( resp => {
                  // Si devuelve falso, el token no es bueno, salimos a login
                  if (!resp) {
                    this.router.navigateByUrl('/landing');
                  } else {
                    // Si la ruta no es para el rol del token, reenviamos a ruta base de rol del token
                    if ((next.data.rol !== '*') && (this.UsuarioService.rol !== next.data.rol)) {
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
                   }
                  }
                })
              );
  }

}
