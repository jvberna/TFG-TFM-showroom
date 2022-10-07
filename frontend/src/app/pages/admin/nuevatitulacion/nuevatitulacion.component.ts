import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TitulacionService } from '../../../services/titulacion.service';

@Component({
  selector: 'nuevatitulacion',
  templateUrl: './nuevatitulacion.component.html',
  styleUrls: ['./nuevatitulacion.component.css']
})
export class NuevatitulacionComponent implements OnInit {

  public Tipos = ['Grado','Máster'];
  public ListaGrados = ['Construcción','Tecnologías de la información y las comunicaciones', 'Industrial y aeronáutica', 'Ciencia y tecnologías para la salud'];
  public ListaMasters = ['Construcción','Tecnologías de la información y las comunicaciones', 'Industrial y aeronáutica', 'Ciencia de la salud'];

  public foto: File = null;
  private formSubmited = false;
  private uid: string = '';
  public showOKP: boolean = false;
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
  }



  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
      this.router.navigateByUrl('/admin/titulaciones');
  }

  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }

      this.TitulacionService.nuevaTitulacion( this.datosForm.value )
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
      this.foto = evento.target.files[0];
      this.fileText = nombre;
  }
  }



  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

  salida(event){
    this.tipo=event.split(": ",2)[1];
  }
}
