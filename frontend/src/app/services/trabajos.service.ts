import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { loginForm  } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Trabajo } from '../models/trabajo.model'

@Injectable({
  providedIn: 'root'
})
export class TrabajosService {
  cargarEjercicios: any;

  constructor(private http: HttpClient,
               private router: Router) { }

  //POST

  nuevoTrabajo ( data: Trabajo) {
    return this.http.post(`${environment.base_url}/trabajos/`, data, this.cabeceras);
  }

  //Llamadas subida archivos

  subirFoto( uid: string, foto: File) {
    console.log(foto);
    const url = `${environment.base_url}/upload/trabajoimg/${uid}`;
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/trabajoimg/${uid}`, datos, this.cabeceras);
  }

  subirConts( uid: string, foto: File) {
    const url = `${environment.base_url}/upload/trabajoconts/${uid}`;
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/trabajoconts/${uid}`, datos, this.cabeceras);
  }

  //PUT

  actualizarTrabajo ( uid: string, data: Trabajo) {

    return this.http.put(`${environment.base_url}/trabajos/${uid}`, data, this.cabeceras);
  }

  actualizarEstadoTrabajo ( uid: string, data) {
    console.log("Actualizar con: ", data);
    return this.http.put(`${environment.base_url}/trabajos/et/${uid}`, data, this.cabeceras);
  }

  actualizarFeedbackTrabajo ( uid: string, data) {
    console.log("Actualizar con: ", data);
    return this.http.put(`${environment.base_url}/trabajos/af/${uid}`, data, this.cabeceras);
  }

  agregarValoracionTrabajo ( uid: string, usuario) {
    const datos: FormData = new FormData();
    datos.append('usuario', usuario);
    return this.http.put(`${environment.base_url}/trabajos/av/${uid}`, datos, this.cabeceras);
  }

  // quitarValoracionTrabajo ( uid: string, data) {
  //   console.log("Actualizar con: ", data);
  //   return this.http.put(`${environment.base_url}/trabajos/qv/${uid}`, data, this.cabeceras);
  // }

  actualizarContenidoTrabajo ( uid: string, data, num) { // llamada despues de subir el contenido correctamente
    console.log("Actualizar con: ", data);
    return this.http.put(`${environment.base_url}/trabajos/ac/${uid}?num=${num}`, data, this.cabeceras);
  }

  borrarContenidoTrabajo ( uid: string, num) { // llamada para quitar algun contenido del trabajo
    console.log("Borrar con: ", num);
    const datos: FormData = new FormData();
    datos.append('posicion', num);
    return this.http.put(`${environment.base_url}/trabajos/bc/${uid}`, datos, this.cabeceras);
  }

  // limpiarMultimediaTrabajo ( uid: string) {

  //   return this.http.put(`${environment.base_url}/trabajos/lm/${uid}`, '', this.cabeceras);
  // }

  //GET

  obtenerTrabajo (uid: string){
    return this.http.get(`${environment.base_url}/trabajos/?id=${uid}`, this.cabeceras);
  }

  obtenerTrabajoVisible (uid: string){
    return this.http.get(`${environment.base_url}/trabajos/tv/?id=${uid}`, this.cabeceras);
  }

  cargarTrabajos( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/trabajos/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarTrabajosVisibles( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/trabajos/tv/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarTrabajosVisiblesNoPag(textoBusqueda?: string ): Observable<object> {
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/trabajos/tv/?texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarTrabajosValorados(): Observable<object> {
    return this.http.get(`${environment.base_url}/trabajos/mv/` , this.cabeceras);
  }

  cargarTrabajosAleatorios(): Observable<object> {
    return this.http.get(`${environment.base_url}/trabajos/aleatorios/` , this.cabeceras);
  }

  cargarTrabajosRecientes(): Observable<object> {
    return this.http.get(`${environment.base_url}/trabajos/mr/` , this.cabeceras);
  }

  cargarTrabajosTodo(): Observable<object> {
    return this.http.get(`${environment.base_url}/trabajos` , this.cabeceras);
  }

  cargarTrabajosEditor( desde: number, textoBusqueda?: string ): Observable<object> { // get trabajos para revisar
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/trabajos/tr/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarTrabajosAluVisibles(uid: string, desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/trabajos/v/?id=${uid}&?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarTrabajosAluNoVisibles(uid: string, desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/trabajos/nv/?id=${uid}&?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  //DELETE

  borrarTrabajo( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/trabajos/${uid}` , this.cabeceras);
  }



  //Llamadas obtención archivos

  crearImagenUrl( imagen: string) {

    const token = localStorage.getItem('token') || '';
    if (!imagen) {
      // return `${environment.base_url}/upload/trabajoimg/nofoto.PNG?token=${token}`;
      return 'nofoto';
    }
    return `${environment.base_url}/upload/trabajoimg/${imagen}?token=${token}`;
  }

  crearContenidosUrl( imagen: string) { // imagenes adicionales trabajo

    const token = localStorage.getItem('token') || '';
    if (!imagen) {
      return `${environment.base_url}/upload/trabajoconts/no-imagen.jpg?token=${token}`;
    }
    return `${environment.base_url}/upload/trabajoconts/${imagen}?token=${token}`;
  }

  //Identificacion con Google
  loginGoogle( tokenGoogle ) {
    return this.http.post(`${environment.base_url}/login/google`, { token: tokenGoogle })
            .pipe(
              tap( (res : any) => {
                localStorage.setItem('token', res['token']);
              })
            );
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }


}
