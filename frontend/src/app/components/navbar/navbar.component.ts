import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTESADMIN, ROUTESALUMNOS, ROUTESEDITOR } from '../sidebar/sidebar.component';
import { routes } from '../../pages/pages.routing';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import Chart from 'chart.js';
import {UsuarioService} from '../../services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    private listaTitulos: any[];
    location: Location;
      mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;

    public isCollapsed = true;

    public rol;

    constructor(location: Location,  private element: ElementRef, private router: Router, private UsuarioService: UsuarioService) {
      this.location = location;
          this.sidebarVisible = false;
    }

    ngOnInit(){
      this.rol= this.UsuarioService.rol;
      this.listaTitulos = routes.filter(listaTitulos => listaTitulos.children);
      console.log("TITULOS: ", this.listaTitulos);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
      this.router.events.subscribe((event) => {
        this.sidebarClose();
         var $layer: any = document.getElementsByClassName('close-layer')[0];
         if ($layer) {
           $layer.remove();
           this.mobile_menu_visible = 0;
         }
     });
    }

    logout() {
      this.UsuarioService.logout();
    }

    collapse(){
      this.isCollapsed = !this.isCollapsed;
      const navbar = document.getElementsByTagName('nav')[0];
      console.log(navbar);
      if (!this.isCollapsed) {
        navbar.classList.remove('navbar-transparent');
        navbar.classList.add('bg-white');
      }else{
        navbar.classList.add('navbar-transparent');
        navbar.classList.remove('bg-white');
      }

    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
        const html = document.getElementsByTagName('html')[0];
        if (window.innerWidth < 991) {
          mainPanel.style.position = 'fixed';
        }

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];

        if (window.innerWidth < 991) {
          setTimeout(function(){
            mainPanel.style.position = '';
          }, 500);
        }
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const html = document.getElementsByTagName('html')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const html = document.getElementsByTagName('html')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            html.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (html.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (html.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              html.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            html.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 2 );
      }
      //vamos a comprobar que no inicie por numero, para que no pille el nombre de ruta que no debe
      let numeros = ['0','1','2','3','4','5','6','7','8','9'];
      let title = titlee.split('/').pop();
      let boolnum= false;
      for(var i=0; i<numeros.length;i++){
        if(title.charAt(0)==numeros[i]) boolnum=true;
      }
      if(boolnum){
        let titlesplit = titlee.split('/');
        titlee = titlesplit[titlesplit.length - 2];
      }
      else titlee=title;

      //Reiniciamos variable bool para hacer la misma comprobación para las paths
      boolnum= false;
      let pathbueno; //Variable para almacenar el nombre del path de la ruta
      if(this.UsuarioService.rol=="ROL_ADMIN"){
        for(var item = 0; item < this.listaTitulos[1].children.length; item++){
          pathbueno = this.listaTitulos[0].children[item].path.split('/');
          pathbueno=pathbueno[0];
          if(pathbueno === titlee){
              return this.listaTitulos[0].children[item].data.titulo;
          }
        }
      }
      else if(this.UsuarioService.rol=="ROL_ALUMNO"){
        for(var item = 0; item < this.listaTitulos[1].children.length; item++){
          pathbueno = this.listaTitulos[1].children[item].path.split('/');
          pathbueno=pathbueno[0];
          if(pathbueno === titlee){
              return this.listaTitulos[1].children[item].data.titulo;
          }
        }
      }
      else if(this.UsuarioService.rol=="ROL_EDITOR"){
        for(var item = 0; item < this.listaTitulos[2].children.length; item++){
          pathbueno = this.listaTitulos[2].children[item].path.split('/');
          pathbueno=pathbueno[0];
          if(pathbueno === titlee){
              return this.listaTitulos[2].children[item].data.titulo;
          }
        }
      }


      return 'Dashboard';
    }
}
