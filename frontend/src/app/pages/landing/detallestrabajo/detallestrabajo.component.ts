import { Component, ViewEncapsulation, OnInit,NgZone, AfterContentInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TrabajosService } from '../../../services/trabajos.service';
import { TitulacionService } from '../../../services/titulacion.service';
//SANITIZER
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';



import { SwiperComponent } from "swiper/angular";
// import SwiperCore y los modulos requeridos
import SwiperCore, { SwiperOptions, Navigation, Pagination, Scrollbar, A11y, EffectCoverflow  } from 'swiper';

SwiperCore.use([EffectCoverflow, Navigation, Pagination, Scrollbar, A11y]);

declare const gapi:any;


@Component({
  selector: 'detallestrabajo',
  templateUrl: './detallestrabajo.component.html',
  styleUrls: ['./detallestrabajo.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallestrabajoComponent implements OnInit {

  // @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

  public auth2: any;

  private uid: string = '';
  public loading = true;
  public trabajo;
  public titulotrabajo: boolean = true;

  public rutatrabajo;

  public titulacionenlace;

  config: SwiperOptions = {
    effect:'coverflow',
    grabCursor:true,
    centeredSlides:true,
    loop: true,
    slidesPerView:'auto',
    coverflowEffect:{
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true
    },
    navigation:true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };
  onSwiper([swiper]) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private TrabajosService: TrabajosService,
              private TitulacionService: TitulacionService,
              private sanitizer: DomSanitizer,
              private zone: NgZone) {
              }

  ngOnInit(): void {
    this.loading = true;
    this.rutatrabajo = window.location.href;
    this.uid = this.route.snapshot.params['uid'];
    console.log("UID: ", this.uid);
    this.cargarTrabajo();
    this.startApp();
  }

  startApp() {
    console.log("Entra attach1");
    gapi.load('auth2', ()=>{
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        // ID de las credenciales de OAUTH que se generen
        // client_id: '267603643942-q9j8dm25g6uq0ivqn1ls2df05rgs372h.apps.googleusercontent.com',
        client_id: '826053114073-g8rqruj8i8bl3gubhrlfa3juc27ffkrn.apps.googleusercontent.com',
      });
      this.attachSignin(document.getElementById('my-signin2'));
    });
  };

  attachSignin(element) {
    console.log("Entra attach2");
    if(element!=null){
      this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        var id_token = googleUser.getAuthResponse().id_token;
        // this.closeAddExpenseModal.nativeElement.click();
        console.log("User: ",googleUser.getBasicProfile().getEmail());

        this.TrabajosService.agregarValoracionTrabajo(this.uid,googleUser.getBasicProfile().getEmail())
          .subscribe( res => {
            console.log("Datos de login para valorar OK");
            Swal.fire({
              icon: 'success',
              title: 'Valoración añadida correctamente',
              showConfirmButton: false,
              timer: 2000
            })
            window.location.reload();
          }, (err) => {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
            //console.warn('error:', err);
            this.loading = false;
          });

        // this.closeAddExpenseModal.nativeElement.click();
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
    }
  }


  cargarTrabajo(){
    this.loading = true;
    this.TrabajosService.obtenerTrabajoVisible(this.uid)
      .subscribe( res => {
        console.log("LA RES de trabajos: ", res['trabajos']);
          this.trabajo = res['trabajos'];

          //para la navegación a la ficha de la titulación
          this.TitulacionService.obtenerTitulacion(this.trabajo.titulacion.titulacion)
          .subscribe( res => {
            console.log("LA RES de titulacion: ", res['titulaciones']);
              this.titulacionenlace = res['titulaciones'].resumen;
          }, (err) => {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
            //console.warn('error:', err);
            this.loading = false;
          });

          this.loading=false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
  }

  //Para cargar la imagen del trabajo
  crearImagenUrl(trabajo) {
    let img=this.TrabajosService.crearImagenUrl(trabajo.imagen);
    if(img=='nofoto'){
      img= this.crearImagenTitu(trabajo.area);
    }
    return img;
  }

  //Para cargar la imagen del trabajo
  crearImagenTitu(area) {
    const r = Math.ceil(Math.random()*(4-1) + 1); // numero aleatorio del 1 al 4
    let urlfoto='';
    if(area == "Construcción"){
      urlfoto= '../../../../assets/img/construccion/'+r+'.jpg'
    }
    if(area == "Tecnologías de la información y las comunicaciones"){
      urlfoto= '../../../../assets/img/tecnoinfocom/'+r+'.jpg'
    }
    if(area == "Ciencia y tecnologías para la salud" || area == "Ciencia de la salud"){
      urlfoto= '../../../../assets/img/cienciassalud/'+r+'.jpg'
    }
    if(area == "Industrial y aeronáutica"){
      urlfoto= '../../../../assets/img/industrialaero/'+r+'.jpg'
    }
    return urlfoto;

  }

  crearContenidosUrl(imagen: string) {
    return this.TrabajosService.crearContenidosUrl(imagen);
  }

  getVideoIframe(url) {
    var video, results;

    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];

    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
}

}
