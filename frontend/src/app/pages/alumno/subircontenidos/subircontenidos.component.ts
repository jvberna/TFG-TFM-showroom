import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TrabajosService } from '../../../services/trabajos.service';

@Component({
  selector: 'subircontenidos',
  templateUrl: './subircontenidos.component.html',
  styleUrls: ['./subircontenidos.component.css']
})
export class SubircontenidosComponent implements OnInit {

  public contenidos: {nombre:string, descripcion:string, tipo:string, contenido:any}[]=[];
  private uid: string = '';
  public loading = true;
  public contenidossubidos= [];

  public dataEstado = this.fb.group({ // para enviar el estado como aceptado o denegado
    estado: [''],
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

  cargarTrabajo(){
    this.loading = true;
    this.TrabajosService.obtenerTrabajo(this.uid)
      .subscribe( res => {
        console.log("LA RES de trabajos: ", res['trabajos']);
          this.contenidossubidos = res['trabajos'].contenidos;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
  }

  cambioContenido( evento ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['jpeg','jpg','png','PNG','txt','xlsx','doc','docx','exe','mp3','wav','zip','rar','pdf'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser válido'});
        return;
      }
      this.contenidos.push({nombre:"",descripcion:"",tipo:extension,contenido:evento.target.files[0]});
    }
  }

  cambioVideo(){ // para videos de youtube
    let url= (document.getElementById("urlyt") as HTMLInputElement).value;
    console.log("que nos devuelve la validación: ", this.matchYoutubeUrl(url));
    if(this.matchYoutubeUrl(url)==false){
      Swal.fire({
        icon: 'error',
        title: 'URL de Youtube incorrecta',
        showConfirmButton: false,
        timer: 2000
      })
    }
    else{
      this.contenidos.push({nombre:"",descripcion:url,tipo:"YT",contenido:url});
      this.addDatosContenido(this.contenidos.length-1);
    }
  }

  matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
  }


  addDatosContenido(num){
    if(this.contenidos[num].tipo=="YT"){
      this.subirVideoYT(num);
    }
    else{
      this.contenidos[num].nombre= (document.getElementById("nombre"+num) as HTMLInputElement).value;
      this.contenidos[num].descripcion = (document.getElementById("descripcion"+num) as HTMLInputElement).value;
      this.subirContenido(num);
    }
  }

  quitarDatosContenido(num){
    //quitamos del array el contenido que ha quitado el alumno
    this.contenidos.splice(num,1);
  }

  addDatosContenidoAct(num){ // cambiar datos contenidos ya subido, para actualizar
    this.contenidossubidos[num].nombre= (document.getElementById("nombre2"+num) as HTMLInputElement).value;
    this.contenidossubidos[num].descripcion = (document.getElementById("descripcion2"+num) as HTMLInputElement).value;
    this.actualizarContenido(num);
  }

  subirContenido(num){
    //comprobamos que tenga todos los campos requeridos
    if(this.contenidos[num].nombre!="" && this.contenidos[num].descripcion!=""){
      this.TrabajosService.subirConts( this.uid, this.contenidos[num].contenido)
            .subscribe( res => {
              let jsonparse= JSON.stringify(res);
              //spliteamos el nombre del archivo de la res para actualizarlo en la bd
              let split = jsonparse.split(',');
              let split2 = split[2].split('"');
              let split3 = split2[3];
              this.contenidos[num].contenido = split3;
              console.log("Contenido: ", split3);
              //si todo sale bien hacemos la llamada para actualizar la bd con la subida del contenido
                this.TrabajosService.actualizarContenidoTrabajo( this.uid, this.contenidos[num], -1)
                  .subscribe( res => {
                    console.log("Respuesta a la actualización: ", res);
                    //borramos el contenido subido del array y actualizamos la llamada al trabajo
                    //para cargar todos los contenidos de nuevo
                    this.contenidos.splice(num,1);
                    this.actualizarEstado();
                    this.cargarTrabajo();
                  }, (err) => {
                    const errtext = err.error.msg || 'No se pudo actualizar el contenido';
                    Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
                    return;
                  });
            }, (err) => {
              const errtext = err.error.msg || 'No se pudo cargar el contenido';
              Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
              return;
            });
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Debes rellenar todos los campos',
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  subirVideoYT(num){
    this.TrabajosService.actualizarContenidoTrabajo( this.uid, this.contenidos[num], -1)
    .subscribe( res => {
      console.log("Respuesta a la actualización: ", res);
      //borramos el contenido subido del array y actualizamos la llamada al trabajo
      //para cargar todos los contenidos de nuevo
      this.contenidos.splice(num,1);
      this.cargarTrabajo();
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo actualizar el contenido';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    });
  }

  actualizarContenido(num){
    if(this.contenidossubidos[num].nombre!="" && this.contenidossubidos[num].descripcion!=""){
      this.TrabajosService.actualizarContenidoTrabajo( this.uid, this.contenidossubidos[num], num)
                .subscribe( res => {
                  console.log("Respuesta a la subida de la foto: ", res);
                  Swal.fire({
                    icon: 'success',
                    title: 'Contenido actualizado',
                    showConfirmButton: false,
                    timer: 2000
                  })
                  this.cargarTrabajo();
                }, (err) => {
                  const errtext = err.error.msg || 'No se pudo cargar la imagen';
                  Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
                  return;
                });
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Debes rellenar todos los campos',
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  borrarContenido(num){

    Swal.fire({
      title: 'Eliminar contenido',
      text: `¿Seguro que desea eliminar el contenido?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
          if (result.value) {
            this.TrabajosService.borrarContenidoTrabajo( this.uid, num)
              .subscribe( res => {
                Swal.fire({
                  icon: 'success',
                  title: 'Contenido eliminado',
                  showConfirmButton: false,
                  timer: 2000
                })
                this.cargarTrabajo();
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                console.warn('error:', err);
              })
          }
      });
  }

  //función para cambiar el estado a revisión si se ha realizado algún cambio
  actualizarEstado(){
    this.dataEstado.get('estado').setValue("Pendiente de revisión");
    this.loading = true;
    this.TrabajosService.actualizarEstadoTrabajo(this.uid, this.dataEstado.value)
      .subscribe( res => {
          console.log("Estado actualizado");

      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
  }

}
