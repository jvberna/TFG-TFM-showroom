import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { TrabajosService } from '../../../services/trabajos.service';
import { UsuarioService } from '../../../services/usuario.service';
import { TitulacionService } from '../../../services/titulacion.service';
import { Usuario } from '../../../../../src/app/models/usuario.model';
import { Titulacion } from '../../../../../src/app/models/titulacion.model';

@Component({
  selector: 'nuevotrabajo',
  templateUrl: './nuevotrabajo.component.html',
  styleUrls: ['./nuevotrabajo.component.css']
})
export class NuevotrabajoComponent implements OnInit {


  private formSubmited = false;
  public showOKP: boolean = false;


  public datosForm = this.fb.group({
    autor: ['', Validators.required ], // hacer peticion a la BD para sacar en un desplegable todos los usuarios con ROL_ALUMNO
    titulo: ['', Validators.required], // maximo 150 caracteres
    titulacion: ['', Validators.required ],
    tipo: ['', Validators.required],
    area: ['', Validators.required],
  });

  public datosForm2 = this.fb.group({ // para el registro de un alumno nuevo
    email: [ '', [Validators.required, Validators.email] ],
    nombre_apellidos: ['', Validators.required ],
    password: ['', Validators.required],
    rol: ['ROL_ALUMNO', Validators.required ],
  });

  //Variables para el listado de Alumnos
  public loading = false;
  public ultimaBusqueda = '';
  public listaAlumnos: Usuario[] = [];
  public totalalumnos = 0;
  public nombreAlu: string = ''; // nombre alumno seleccionado en la select
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  //Variables para el listado de Titulaciones
  public loading2 = false;
  public ultimaBusqueda2 = '';
  public listaTitulaciones: Titulacion[] = [];
  public totaltitulaciones = 0;
  public nombreTitu: string = ''; // nombre alumno seleccionado en la select
  public posicionactual2 = 0;
  public registrosporpagina2 = environment.registros_por_pagina;

  //Variables para el nuevo alumno
  public loadingModal= false;
  public idnewalu;
  private formSubmited2 = false;
  public nomnewalu;
  private passaleatoria;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private TrabajosService: TrabajosService,
              private UsuarioService: UsuarioService,
              private TitulacionService: TitulacionService) { }

  ngOnInit(): void {
    this.cargarTitulaciones();
  }



  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
      this.router.navigateByUrl('/admin/trabajos');
  }

  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }

      this.TrabajosService.nuevoTrabajo( this.datosForm.value )
        .subscribe( res => {
          this.datosForm.markAsPristine();

          Swal.fire({
            icon: 'success',
            title: 'Trabajo creado correctamente',
            showConfirmButton: false,
            timer: 2000
          })
          this.router.navigateByUrl('/admin/trabajos');

        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
          return;
        });


  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

  // BUSQUEDA ALUMNOS
  cargarAlumnos( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    if(this.ultimaBusqueda.length>2){
      this.loading = true;
      this.UsuarioService.cargarAlumnos( this.posicionactual, textoBuscar )
      .subscribe( res => {
        if (res['alumnos'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarAlumnos(this.ultimaBusqueda);
          } else {
            this.listaAlumnos = [];
            this.totalalumnos = 0;
          }
        } else {
          this.listaAlumnos = res['alumnos'];
          this.totalalumnos = res['page'].total;
        }
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        this.loading = false;
      });
    }

  }

  cargarTitulaciones() { // cargamos todas las titulaciones
    this.TitulacionService.cargarTitulacionesTodo()
      .subscribe( res => {
          this.listaTitulaciones = res['titulaciones'];
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        });
    }

  esteLugar( alu ) { // Funcion para establecer nombre del alumno en el input y reiniciar el listado
    this.nombreAlu = alu.nombre_apellidos;
    this.datosForm.get('autor').setValue(alu.uid);
    this.ultimaBusqueda='';
    document.getElementById('cerrar').click();

  }

  // Funciones para crear un nuevo alumno si no existe

  cancelar2(): void {
    // Si estamos creando uno nuevo, vamos a la lista
      this.router.navigateByUrl('/admin/dashboard');
  }


  enviar2(): void {
    this.formSubmited2 = true;
    if (this.datosForm2.invalid) { return; }
    this.datosForm2.get('rol').setValue('ROL_ALUMNO');

      this.UsuarioService.nuevoUsuario( this.datosForm2.value )
        .subscribe( res => {
          this.datosForm2.markAsPristine();

          Swal.fire({
            icon: 'success',
            title: 'Usuario creado correctamente',
            showConfirmButton: false,
            timer: 2000
          })
          this.idnewalu= res['usuario'].uid;
          //cargar usuario nuevo creado
          this.UsuarioService.cargarUsuario(this.idnewalu)
            .subscribe( res => {
              //Guardamos en la variable nombreAlu para mostrar el alumno en el frontend
              this.nombreAlu= res['usuarios'].nombre_apellidos;
              this.idnewalu= res['usuarios'].uid;
          }, (err) => {
            const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
            Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
            return;
          });
          //Cambiamos el valor del autor por el ID del nuevo alumno
          this.datosForm.get('autor').setValue(this.idnewalu);

        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
          return;
        });


  }

  campoNoValido2( campo: string) {
    return this.datosForm2.get(campo).invalid && this.formSubmited2;
  }

  clickModal(){
    this.loadingModal= false;
    console.log("DATOS FORM USU INICIO: ", this.datosForm2.value);
    this.generatePasswordRand(4);
  }


  //Para generar una pass aleatoria para el usuario
  generatePasswordRand(length){
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var pass = "";
    for (var i = 0; i < length; i++) {
            pass += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.datosForm2.get('password').setValue(pass);
    this.passaleatoria= pass;
  }

  actualizarCamposTitu(){ // funcion para establecer el area y el tipo de la titulacion seleccionada
    console.log("Entra actualizar campos");
    let uid= "";
    uid = this.datosForm.get('titulacion').value;
    console.log("Entra actualizar campos: ", uid);
    if(uid!=''){
      this.TitulacionService.obtenerTitulacion(uid)
      .subscribe( res => {
          console.log(res['titulaciones']);
          this.nombreTitu= res['titulaciones'].nombre;
          this.datosForm.get('area').setValue(res['titulaciones'].area);
          this.datosForm.get('tipo').setValue(res['titulaciones'].tipo);
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        });
    }
  }

}
