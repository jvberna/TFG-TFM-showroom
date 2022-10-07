import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { ComponentsModule } from '../../components/components.module';
import { RouterModule } from '@angular/router';
import { Auth2Module } from '../../auth2/auth2.module';
import { InicioComponent } from './inicio/inicio.component';
import { SwiperModule } from 'swiper/angular';
import { DetallestrabajoComponent } from './detallestrabajo/detallestrabajo.component';
import {SafePipe} from '../../pipes/SafePipe';
import { ResultadosComponent } from './resultados/resultados.component';
import { PreviewtrabajoComponent } from './previewtrabajo/previewtrabajo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';
import {ShareIconsModule} from 'ngx-sharebuttons/icons';



@NgModule({
  declarations: [

    LandingComponent,
      InicioComponent,
      DetallestrabajoComponent,
      SafePipe,
      ResultadosComponent,
      PreviewtrabajoComponent

  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule,
    Auth2Module,
    SwiperModule,
    FormsModule,
    HttpClientModule,
    ShareButtonsModule,
    ShareIconsModule
  ]
})
export class LandingModule { }
