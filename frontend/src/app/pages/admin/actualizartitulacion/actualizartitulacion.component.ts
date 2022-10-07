import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TitulacionService } from '../../../services/titulacion.service';

@Component({
  selector: 'actualizartitulacion',
  templateUrl: './actualizartitulacion.component.html',
  styleUrls: ['./actualizartitulacion.component.css']
})
export class ActualizartitulacionComponent implements OnInit {

  public Tipos = ['Grado','Máster'];
  public ListaGrados = ['Construcción','Tecnologías de la información y las comunicaciones', 'Industrial y aeronáutica', 'Ciencia y tecnologías para la salud'];
  public ListaMasters = ['Construcción','Tecnologías de la información y las comunicaciones', 'Industrial y aeronáutica', 'Ciencia de la salud'];

  public imagenUrl='';
  public foto: File = null;
  private formSubmited = false;
  private uid: string = '';
  public showOKP: boolean = false;
  public loading: boolean = true;
  public tipo : string = '';
  public fileText = 'Seleccione archivo';

  public datosForm = this.fb.group({
    nombre: ['', Validators.required ],
    abreviatura: ['', Validators.required ],
    resumen: ['', Validators.required ],
    tipo: ['', Validators.required ],
    area: ['', Validators.required ],
    imagen: [''],
  });

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private TitulacionService: TitulacionService) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];
    console.log("UID: ", this.uid);
    this.cargarTitulacion();
  }



  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
      this.router.navigateByUrl('/admin/titulaciones');
  }

  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }

      this.TitulacionService.actualizarTitulacion(this.uid, this.datosForm.value )
        .subscribe( res => {
          console.log("Titulacion creada: ", res['titulacion']);
          if (this.foto ) {
            this.TitulacionService.subirFoto( res['titulacion'].uid, this.foto)
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
            title: 'Titulacion creada correctamente',
            showConfirmButton: false,
            timer: 2000
          })
          this.router.navigateByUrl('/admin/titulaciones');

        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
          return;
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

  salida(event){
    this.tipo=event.split(": ",2)[1];
    console.log("Tipo: ", this.tipo);
  }

  cargarTitulacion(){
    this.loading = true;
    this.TitulacionService.obtenerTitulacion(this.uid)
      .subscribe( res => {
          this.datosForm.get('nombre').setValue(res['titulaciones'].nombre);
          this.datosForm.get('tipo').setValue(res['titulaciones'].tipo);
          this.tipo= res['titulaciones'].tipo;
          this.datosForm.get('area').setValue(res['titulaciones'].area);
          this.datosForm.get('resumen').setValue(res['titulaciones'].resumen);
          this.datosForm.get('abreviatura').setValue(res['titulaciones'].abreviatura);
          //this.datosForm.get('imagen').setValue(res['titulaciones'].imagen);
          this.imagenUrl = this.TitulacionService.crearImagenUrl(res['titulaciones'].imagen);
          console.log("Tipo: ",this.tipo);

      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
  }

}
