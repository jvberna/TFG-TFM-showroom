import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TrabajosService } from '../../../services/trabajos.service';

@Component({
  selector: 'subirtrabajo',
  templateUrl: './subirtrabajo.component.html',
  styleUrls: ['./subirtrabajo.component.css']
})
export class SubirtrabajoComponent implements OnInit {

  public imagenUrl;
  public foto: File = null;
  private formSubmited = false;
  private uid: string = '';
  public showOKP: boolean = false;
  public tipo : string = '';
  public fileText = 'Seleccione imagen';
  public loading = true;

  //Arrays para guardar el contenido que se copiará a los campos del form group
  public imagenes: File [] = [];
  public videos: File [] = [];
  public audios: File [] = [];
  public documentos: File [] = [];
  //Arrays para guardar los nombres de estos contenidos
  public nomimagenes: String [] = [];
  public nomvideos: String [] = [];
  public nomaudios: String [] = [];
  public nomdocumentos: String [] = [];



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
    estado: [''], // cambiar a revisión por los editores
    visible: [''],
    enlace: ['', Validators.required ],
    defensa: ['', Validators.required ],
    curso: ['', Validators.required ],
    palabrasclave: ['', Validators.required ],
  });

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private TrabajosService: TrabajosService) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];
    console.log("UID: ", this.uid);
    this.cargarTrabajo();
  }

  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
      this.router.navigateByUrl('/admin/titulaciones');
  }

  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }
    this.datosForm.get('estado').setValue('Pendiente de revisión');
    this.datosForm.get('visible').setValue(false);
    //Llamar a actualizar trabajo
    //Hacer bucle para cada array de archivos para subirlos uno a uno
      this.TrabajosService.actualizarTrabajo( this.uid,this.datosForm.value )
        .subscribe( res => {
          console.log("Trabajo creado: ", res['trabajo']);
          //Subida imagen del trabajo
          if (this.foto ) {
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
          this.router.navigateByUrl('/alumno/trabajos');

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
          this.datosForm.get('titulo').disable();
          this.datosForm.get('autor').setValue(res['trabajos'].autor.nombre_apellidos);
          this.datosForm.get('autor').disable();
          this.datosForm.get('area').setValue(res['trabajos'].area);
          this.datosForm.get('area').disable();
          this.datosForm.get('titulacion').setValue(res['trabajos'].titulacion.nombre);
          this.datosForm.get('titulacion').disable();
          this.datosForm.get('tipo').setValue(res['trabajos'].tipo);
          this.datosForm.get('tipo').disable();
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
      this.foto = evento.target.files[0];
      this.fileText = nombre;
      console.log("Foto: ", this.foto);
    }
  }

  //Funciones para ir agregando los contenidos al array y mostrarlos en el front
  cambioImagenes( evento ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['jpeg','jpg','png','PNG'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        // Si no teniamos ningúna foto ya seleccionada antes, dejamos el campo pristine
          //this.datosForm.get('imagenes').markAsPristine();
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser una imagen jpeg, jpg o png'});
        return;
      }
      this.imagenes.push(evento.target.files[0]);
      this.nomimagenes.push(nombre);
      console.log("Imagenes: ", this.imagenes);
    }
  }

  cambioVideos( evento ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['mp4','MP4','avi','AVI'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        // Si no teniamos ningúna foto ya seleccionada antes, dejamos el campo pristine
          //this.datosForm.get('videos').markAsPristine();
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser un video mp4 o avi'});
        return;
      }
      this.videos.push(evento.target.files[0]);
      this.nomvideos.push(nombre);
      console.log("Videos: ", this.videos);
    }
  }

  cambioDocumentos( evento ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['pdf','PDF'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        // Si no teniamos ningúna foto ya seleccionada antes, dejamos el campo pristine
          //this.datosForm.get('documentos').markAsPristine();
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser un documento pdf'});
        return;
      }
      this.documentos.push(evento.target.files[0]);
      this.nomdocumentos.push(nombre);
      console.log("Docs: ", this.documentos);
    }
  }

  cambioAudios( evento ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['mp3','MP3','wav','WAV'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        // Si no teniamos ningúna foto ya seleccionada antes, dejamos el campo pristine
          //this.datosForm.get('audios').markAsPristine();
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser un audio mp3 o wav'});
        return;
      }
      this.audios.push(evento.target.files[0]);
      this.nomaudios.push(nombre);
      console.log("Audios: ", this.audios);
    }
  }

  //Funciones para si se quiere quitar algun contenido

  quitarImagen(num){
    this.imagenes.splice(num,1);
    this.nomimagenes.splice(num,1);
  }

  quitarVideo(num){
    this.videos.splice(num,1);
    this.nomvideos.splice(num,1);
  }

  quitarDocumentos(num){
    this.documentos.splice(num,1);
    this.nomdocumentos.splice(num,1);
  }

  quitarAudio(num){
    this.audios.splice(num,1);
    this.nomaudios.splice(num,1);
  }



  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

}
