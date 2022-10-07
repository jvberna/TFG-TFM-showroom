import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Trabajo {

    constructor( // opcionales
                 public imagen: string,
                 public visible: Boolean,
                 // obligatorios
                 public titulo?: string,
                 public autor?,
                 public resumen?: string,
                 public area?: string,
                 public carrera?: Date,
                 public director?: string,
                 public tipo?: string,
                 ) {}
}
