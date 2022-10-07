import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TitulacionService } from '../../../services/titulacion.service';
import { Titulacion } from '../../../models/titulacion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'gestiontitulaciones',
  templateUrl: './gestiontitulaciones.component.html',
  styleUrls: ['./gestiontitulaciones.component.css']
})
export class GestionTitulacionesComponent implements OnInit {
  public loading = true;

  public totaltitulaciones = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaTitulaciones: Titulacion[] = [];

  constructor(private TitulacionService: TitulacionService) { }

  ngOnInit(): void {
    this.cargarTitulaciones(this.ultimaBusqueda);
  }

  cargarTitulaciones( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.TitulacionService.cargarTitulaciones( this.posicionactual, textoBuscar )
      .subscribe( res => {
        // Lo que nos llega lo asignamos a lista titulaciones para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
        console.log("LA RES de titulaciones: ", res['titulaciones']);
        if (res['titulaciones'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarTitulaciones(this.ultimaBusqueda);
          } else {
            this.listaTitulaciones = [];
            this.totaltitulaciones = 0;
          }
        } else {
          this.listaTitulaciones = res['titulaciones'];
          this.totaltitulaciones = res['page'].total;
        }
          this.loading = false;
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          //console.warn('error:', err);
          this.loading = false;
        });
    }

  eliminarTitulacion( uid: string, nombre: string) {
    Swal.fire({
      title: 'Eliminar titulacion',
      text: `Al eliminar la titulación '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.TitulacionService.borrarTitulacion(uid)
              .subscribe( resp => {
                this.cargarTitulaciones(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                console.warn('error:', err);
              })
          }
      });
  }

  crearImagenUrl(imagen: string) {
    return this.TitulacionService.crearImagenUrl(imagen);
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarTitulaciones(this.ultimaBusqueda);
  }

}
