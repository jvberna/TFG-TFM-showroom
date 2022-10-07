import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { TrabajosService } from '../../../services/trabajos.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../../../src/app/models/usuario.model';
import { TitulacionService } from '../../../services/titulacion.service';

@Component({
  selector: 'actualizartrabajo',
  templateUrl: './actualizartrabajo.component.html',
  styleUrls: ['./actualizartrabajo.component.css']
})
export class ActualizartrabajoComponent implements OnInit {

  public imagenUrl;
  public foto: File = null;
  private formSubmited = false;
  private uid: string = '';
  public showOKP: boolean = false;
  public tipo : string = '';
  public fileText = 'Seleccione imagen';
  public loading = true;

  //Variables para el listado de Alumnos
  public loading2 = false;
  public ultimaBusqueda = '';
  public listaAlumnos: Usuario[] = [];
  public totalalumnos = 0;
  public nombreAlu: string = ''; // nombre alumno seleccionado en la select
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  //Variables para el nuevo alumno
  public loadingModal= true;
  public idnewalu;
  private formSubmited2 = false;
  public nomnewalu;
  private passaleatoria;

  //Carga lista titulaciones
  public listaTitulaciones;
  public nombreTitu: string = ''; // nombre titulacion seleccionada en la select

  public datosForm = this.fb.group({
    //Ya registrados, pero para mostrar
    titulo: [''],
    autor: [''],
    area: [''],
    titulacion: [''],
    tipo: [''],
    //********************** */
    resumen: ['', Validators.required ],
    imagen: [''],
    director: ['', Validators.required ],
    enlace: ['', Validators.required ],
    defensa: ['', Validators.required ],
    curso: ['', Validators.required ],
    palabrasclave: ['', Validators.required ],
    estado: [''], // cambiar a revisión por los editores
  });

  public datosForm2 = this.fb.group({ // para el registro de un alumno nuevo
    email: [ '', [Validators.required, Validators.email] ],
    nombre_apellidos: ['', Validators.required ],
    password: ['', Validators.required],
    rol: ['ROL_ALUMNO', Validators.required ],
  });

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private TrabajosService: TrabajosService,
              private UsuarioService: UsuarioService,
              private TitulacionService: TitulacionService ) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];
    console.log("UID: ", this.uid);
    this.cargarTrabajo();
    this.cargarTitulaciones();
  }

  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
      this.router.navigateByUrl('/admin/trabajos');
  }

  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }
    this.datosForm.get('estado').setValue('Pendiente de revisión');
    //Llamar a actualizar trabajo
    //Hacer bucle para cada array de archivos para subirlos uno a uno
      this.TrabajosService.actualizarTrabajo( this.uid,this.datosForm.value )
        .subscribe( res => {
          console.log("Trabajo creado: ", res['trabajo']);
          //Subida imagen del trabajo
          if (this.foto) {
            this.TrabajosService.subirFoto( res['trabajo'].uid, this.foto)
            .subscribe( res => {
              console.log("Respuesta a la subida de la foto: ", res);
            }, (err) => {
              const errtext = err.error.msg || 'No se pudo cargar la imagen';
              Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
              return;
            });
          }

          this.datosForm.markAsPristine();

          Swal.fire({
            icon: 'success',
            title: 'Trabajo subido correctamente',
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

  cargarTrabajo(){
    this.loading = true;
    this.TrabajosService.obtenerTrabajo(this.uid)
      .subscribe( res => {
        // Obtenemos los trabajos del alumno que han sido aceptados por el editor y por lo tanto publicados
        console.log("LA RES de trabajos: ", res['trabajos']);
          this.datosForm.get('titulo').setValue(res['trabajos'].titulo);
          this.datosForm.get('autor').setValue(res['trabajos'].autor);
          this.nombreAlu= res['trabajos'].autor.nombre_apellidos;
          this.datosForm.get('area').setValue(res['trabajos'].area);
          this.datosForm.get('titulacion').setValue(res['trabajos'].titulacion);
          this.nombreTitu = res['trabajos'].titulacion.nombre;
          this.datosForm.get('tipo').setValue(res['trabajos'].tipo);
          this.datosForm.get('director').setValue(res['trabajos'].director);
          this.datosForm.get('enlace').setValue(res['trabajos'].enlace);
          this.datosForm.get('defensa').setValue(res['trabajos'].defensa);
          this.datosForm.get('curso').setValue(res['trabajos'].curso);
          this.datosForm.get('palabrasclave').setValue(res['trabajos'].palabrasclave);
          this.datosForm.get('resumen').setValue(res['trabajos'].resumen);
          this.imagenUrl = this.TrabajosService.crearImagenUrl(res['trabajos'].imagen);
          this.loading = false;

      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
  }

  cambioImagen( evento ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['jpeg','jpg','png','PNG'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        // Si no teniamos ningúna foto ya seleccionada antes, dejamos el campo pristine
        if (this.foto === null) {
          this.datosForm.get('imagen').markAsPristine();
        }
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser una imagen jpeg, jpg o png'});
        return;
      }
      this.fileText = nombre;
      let reader = new FileReader();
      // cargamos el archivo en la variable foto que servirá para enviarla al servidor
      this.foto = evento.target.files[0];
      // leemos el archivo desde el dispositivo
      reader.readAsDataURL(evento.target.files[0]);
      // y cargamos el archivo en la imagenUrl que es lo que se inserta en el src de la imagen
      reader.onload = (event) => {
        this.imagenUrl = event.target.result.toString();
        this.fileText = nombre;
      };
    }
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

  // BUSQUEDA ALUMNOS
  cargarAlumnos( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    if(this.ultimaBusqueda.length>2){
      this.loading2 = true;
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
        this.loading2 = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        this.loading2 = false;
      });
    }

  }

  esteLugar( alu ) { // Funcion para establecer nombre del alumno en el input y reiniciar el listado
    this.nombreAlu = alu.nombre_apellidos;
    this.datosForm.get('autor').setValue(alu.uid);
    this.ultimaBusqueda='';
    document.getElementById('cerrar').click();

  }

  cancelar2(): void {
    // Si estamos creando uno nuevo, vamos a la lista
      this.router.navigateByUrl('/admin/trabajos');
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

  cargarTitulaciones() { // cargamos todas las titulaciones
    this.TitulacionService.cargarTitulacionesTodo()
      .subscribe( res => {
          this.listaTitulaciones = res['titulaciones'];
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        });
    }

    actualizarCamposTitu(){
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


      console.log("Entra actualizar campos: ", this.nombreTitu);
    }

}
