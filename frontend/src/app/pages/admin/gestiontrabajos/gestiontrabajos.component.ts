import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TrabajosService } from '../../../services/trabajos.service';
import { Trabajo } from '../../../models/trabajo.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'gestiontrabajos',
  templateUrl: './gestiontrabajos.component.html',
  styleUrls: ['./gestiontrabajos.component.css']
})
export class GestionTrabajosComponent implements OnInit {

  public loading = true;

  public totaltrabajos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaTrabajos: Trabajo[] = [];

  constructor(private trabajoService: TrabajosService) { }

  ngOnInit(): void {
    this.cargarTrabajos(this.ultimaBusqueda);
  }

  cargarTrabajos( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.trabajoService.cargarTrabajos( this.posicionactual, textoBuscar )
      .subscribe( res => {
        // Lo que nos llega lo asignamos a lista trabajos para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
        console.log("LA RES de trabajos: ", res['trabajos']);
        if (res['trabajos'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarTrabajos(this.ultimaBusqueda);
          } else {
            this.listaTrabajos = [];
            this.totaltrabajos = 0;
          }
        } else {
          this.listaTrabajos = res['trabajos'];
          this.totaltrabajos = res['page'].total;
        }
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
  }

  eliminarTrabajo( uid: string, titulo: string) {
    Swal.fire({
      title: 'Eliminar trabajo',
      text: `Al eliminar el trabajo '${titulo}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.trabajoService.borrarTrabajo(uid)
              .subscribe( resp => {
                this.cargarTrabajos(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                console.warn('error:', err);
              })
          }
      });
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarTrabajos(this.ultimaBusqueda);
  }

}
