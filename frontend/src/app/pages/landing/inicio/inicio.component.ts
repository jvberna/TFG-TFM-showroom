import { Component, ElementRef, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from "keen-slider";
import { TrabajosService } from '../../../services/trabajos.service';
import { Trabajo } from '../../../models/trabajo.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SwiperComponent } from "swiper/angular";
// import SwiperCore y los modulos requeridos
import SwiperCore, { SwiperOptions, Navigation, Pagination, Scrollbar, A11y  } from 'swiper';
import { TitulacionService } from '../../../services/titulacion.service';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);


@Component({
  selector: 'inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InicioComponent implements OnInit {

  //Variables para la carga de los trabajos
  public loading = true;
  public totaltrabajos = 0;
  public listaTrabajos; // trabajos generales

  //para trabajos más valorados
  public trabajosValorados;

  //para trabajos más recientes
  public trabajosRecientes;

  //para trabajos aleatorios
  public trabajosAleatorios;

  //Variables para la carga de titulaciones
  public listaTitulaciones;

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      // when window width is >= 640px
      1200: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      1500: {
        slidesPerView: 3,
        spaceBetween: 40
      }
    }
  };
  config2: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: true,
    pagination: { clickable: true },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      850: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      // when window width is >= 640px
      1200: {
        slidesPerView: 4,
        spaceBetween: 40
      },
      1500: {
        slidesPerView: 5,
        spaceBetween: 40
      }
    }
  };
  // onSwiper([swiper]) {
  //   console.log(swiper);
  // }
  // onSlideChange() {
  //   console.log('slide change');
  // }


  constructor(private trabajoService: TrabajosService,
              private TitulacionService: TitulacionService,
              private router: Router) { }

  ngOnInit(): void {
    this.cargarTrabajosValorados();
    this.cargarTrabajosRecientes();
    this.cargarTrabajosAleatorios();
    this.cargarTitulaciones();
  }

  // cargamos los trabajos
  cargarTrabajosValorados() {
    this.loading = true;
    this.trabajoService.cargarTrabajosValorados()
      .subscribe( res => {
        console.log("Res de trabajos", res['trabajos']);
          this.trabajosValorados = res['trabajos'];
          //this.totaltrabajos = res['page'].total;
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
    }

    cargarTrabajosRecientes() {
      this.loading = true;
      this.trabajoService.cargarTrabajosRecientes()
        .subscribe( res => {
          console.log("Res de trabajos", res['trabajos']);
            this.trabajosRecientes = res['trabajos'];
            //this.totaltrabajos = res['page'].total;
          this.loading = false;
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          //console.warn('error:', err);
          this.loading = false;
        });
      }

      cargarTrabajosAleatorios() {
        this.loading = true;
        this.trabajoService.cargarTrabajosAleatorios()
          .subscribe( res => {
            console.log("Res de trabajos aleatorios", res['trabajos']);
              this.trabajosAleatorios = res['trabajos'];
              //this.totaltrabajos = res['page'].total;
            this.loading = false;
          }, (err) => {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
            //console.warn('error:', err);
            this.loading = false;
          });
        }

    //cargamos las titulaciones
    cargarTitulaciones() {
      this.loading = true;
      this.TitulacionService.cargarTitulacionesTodo()
        .subscribe( res => {
            this.listaTitulaciones = res['titulaciones'];
            this.loading = false;
          }, (err) => {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
            this.loading = false;
          });
      }

    //Para cargar la imagen de la titulacion
    crearUrlTitulacion(imagen:string){
      return this.TitulacionService.crearImagenUrl(imagen);
    }

    //Para cargar la imagen del trabajo
    crearImagenUrl(trabajo) {
      let img=this.trabajoService.crearImagenUrl(trabajo.imagen);
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

    irFicha(uid){
      this.router.navigateByUrl('/landing/trabajo/'+ uid);
      // window.open('/landing/trabajo',uid, '_blank');
    }

    busqueda(titulacion){
      this.router.navigateByUrl('/landing/busqueda/'+ titulacion.nombre);
    }

  }
