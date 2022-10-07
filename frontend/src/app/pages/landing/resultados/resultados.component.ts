import { Component,  OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TrabajosService } from '../../../services/trabajos.service';
import { Trabajo } from '../../../models/trabajo.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ResultadosComponent implements OnInit{

  public texto: string = '';
  public loading = true;

  public totaltrabajos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaTrabajos= [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private TrabajosService: TrabajosService) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // window.location.reload();
    console.log("Hijo cargado");
    this.texto = this.route.snapshot.params['texto'];
    // if(this.texto!=this.ultimaBusqueda){
    //   this.ultimaBusqueda=this.texto;
    //   window.location.reload();
    // }
    console.log("Texto: ", this.texto);
    this.cargarTrabajos();
  }

  busqueda(){
    console.log("Hijo cargado");
    this.ngOnInit();
  }

  cargarTrabajos() {
      this.loading = true;
      console.log("Se entra en cargar trabajos");
      this.TrabajosService.cargarTrabajosVisiblesNoPag(this.texto )
      .subscribe( res => {
        console.log("Res trabajos: ", res['trabajos']);
          this.listaTrabajos = res['trabajos'];
          this.totaltrabajos = res['page'].total;
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
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

  irFicha(uid){
    this.router.navigateByUrl('/landing/trabajo/'+ uid);
    // window.open('/landing/trabajo',uid, '_blank');
  }

}
