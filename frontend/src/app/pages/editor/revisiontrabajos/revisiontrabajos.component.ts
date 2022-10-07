import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TrabajosService } from '../../../services/trabajos.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Trabajo } from '../../../models/trabajo.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'revisiontrabajos',
  templateUrl: './revisiontrabajos.component.html',
  styleUrls: ['./revisiontrabajos.component.css']
})
export class RevisiontrabajosComponent implements OnInit {
  public loading = true;

  public totaltrabajos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaTrabajos: Trabajo[] = [];

  public dataEstado = this.fb.group({ // para enviar el estado como aceptado o denegado
    estado: [''],
  });

  public dataFeedback = this.fb.group({ // para enviar el feedback si rechaza el trabajo
    feedback: [''],
  });

  constructor(private TrabajosService: TrabajosService,
              private UsuarioService:UsuarioService,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cargarTrabajos(this.ultimaBusqueda);
  }

  cargarTrabajos( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    //Hacer funcion que devuelva los no visibles con estado de revisión
    this.TrabajosService.cargarTrabajosEditor( this.posicionactual, textoBuscar )
      .subscribe( res => {
        // Obtenemos los trabajos del alumno que han sido aceptados por el editor y por lo tanto publicados
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

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarTrabajos(this.ultimaBusqueda);
  }

  irRevision(uid){
    this.router.navigateByUrl('/editor/previewtrabajo/'+ uid);
  }

  actualizarEstado(uid,estado){ // estado param -> 'Aceptado' o 'Denegado'
    this.dataEstado.get('estado').setValue(estado);
    this.loading = true;

    if(estado=="Denegado"){
      Swal.fire({
        title: "Añade feedback del trabajo",
        text: "¿Qué se debería cambiar o arreglar?",
        input: 'text',
        confirmButtonText: 'Enviar',
        cancelButtonText: "Cancelar",
        showCancelButton: true
    }).then((result) => {
        if (result.value) {
          console.log("Result: " + result.value);
          this.dataFeedback.get('feedback').setValue(result.value);
          this.TrabajosService.actualizarEstadoTrabajo(uid, this.dataEstado.value)
            .subscribe( res => {
              this.TrabajosService.actualizarFeedbackTrabajo(uid, this.dataFeedback.value)
              .subscribe( res => {
                Swal.fire({
                  icon: 'success',
                  title: 'Estado actualizado correctamente',
                  showConfirmButton: false,
                  timer: 2000
                })
                this.loading = false;
                this.cargarTrabajos(this.ultimaBusqueda);

              }, (err) => {
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                //console.warn('error:', err);
                this.loading = false;
              });
            }, (err) => {
              Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              //console.warn('error:', err);
              this.loading = false;
            });
        }
    });
    }
    else{
      this.TrabajosService.actualizarEstadoTrabajo(uid, this.dataEstado.value)
      .subscribe( res => {
        Swal.fire({
          icon: 'success',
          title: 'Estado actualizado correctamente',
          showConfirmButton: false,
          timer: 2000
        })
        this.loading = false;
        this.cargarTrabajos(this.ultimaBusqueda);

      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
    }

  }

}
