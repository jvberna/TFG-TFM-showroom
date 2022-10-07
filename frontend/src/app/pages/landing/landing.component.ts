import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TitulacionService } from '../../services/titulacion.service';
import { ResultadosComponent } from './resultados/resultados.component';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class LandingComponent implements OnInit {

  @ViewChild(ResultadosComponent) hijo: ResultadosComponent;

  //Variables para la carga de titulaciones
  public listaTitulaciones;
  public loading = true;
  public listatitu: boolean = true;
  public actualinicio: boolean = false; // variable para saber si estamos en inicio, para ocultar Inicio y Titulaciones

  public texto;

  test : Date = new Date();

  constructor(private UsuarioService: UsuarioService,
              private router: Router,
              private TitulacionService: TitulacionService) { }

  ngOnInit(): void {
    //this.rol= this.UsuarioService.rol;
    // this.router.navigateByUrl('/landing/inicio');
    this.cargarTitulaciones();
    // console.log("Landing component");
    // console.log("Url: ", this.router.url);
    // console.log(window.location.href);
    console.log(this.router.url.split('/').pop());
    if(this.router.url.split('/').pop()=="inicio" || this.router.url.split('/').pop()=="landing"){
      this.actualinicio=true;
      console.log(this.actualinicio);
    }
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  logout() {
    this.UsuarioService.logout();
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


  cambiotitu(){
    if(this.listatitu) this.listatitu= false;
    else this.listatitu = true;
    console.log(this.listatitu);
  }

  busqueda(){
    this.texto= (document.getElementById("txtQuery") as HTMLInputElement).value;
    console.log("TExto: ", this.texto);
    // window.location.reload();
    // this.hijo.cargarTexto(texto);
    let url=this.router.url.split('/');
    let url2 = url[2];
    console.log("Url actual para res: ", url);
    console.log("Url actual para res: ", url2);
    this.router.navigate(['/landing/busqueda/',this.texto]);
    // if(url2=='busqueda') window.location.reload();

    // this.router.navigate(['/landing/busqueda/'+ texto]);
  }

  busquedatitu(titulacion){
    this.texto=titulacion.nombre;
    this.router.navigateByUrl('/landing/busqueda/'+ titulacion.nombre);
  }



}
