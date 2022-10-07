import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TrabajosService } from '../../../services/trabajos.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Trabajo } from '../../../models/trabajo.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { SwiperComponent } from "swiper/angular";
// import SwiperCore y los modulos requeridos
import SwiperCore, { SwiperOptions, Navigation, Pagination, Scrollbar, A11y, EffectCoverflow  } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

SwiperCore.use([EffectCoverflow, Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'nuevostrabajos',
  templateUrl: './nuevostrabajos.component.html',
  styleUrls: ['./nuevostrabajos.component.css'],

})


export class NuevostrabajosComponent implements OnInit {

  public loading = true;

  public totaltrabajos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaTrabajos: Trabajo[] = [];

  //Variable para ofrecer feedback del trabajo seleccionado
  public trabajofeed;
  public loadingfeed = true;


  config: SwiperOptions = {
    effect:'coverflow',
    grabCursor:true,
    centeredSlides:true,
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

  constructor(private TrabajosService: TrabajosService,
              private UsuarioService:UsuarioService,
              private router: Router) {
               }

  ngOnInit(): void {
    this.cargarTrabajos(this.ultimaBusqueda);
  }

  cargarTrabajos( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.TrabajosService.cargarTrabajosAluNoVisibles( this.UsuarioService.uid,this.posicionactual, textoBuscar )
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

  subirTrabajo(id){
    this.router.navigateByUrl('/alumno/subirtrabajo/'+id);
  }

  subirContenidos(id){
    this.router.navigateByUrl('/alumno/subircontenidos/'+id);
  }

  clickFeedback(trabajo){
    this.trabajofeed=trabajo;
    this.loadingfeed = false;
    console.log("trabajofeed: ", this.trabajofeed);
  }

}
