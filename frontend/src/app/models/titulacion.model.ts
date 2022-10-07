import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Titulacion {

    constructor( // opcionales
                 public tipo: string,
                 public imagen: string,
                 // obligatorios
                 public titulo?,
                 public resumen?: string,
                 public area?: string
                 ) {}

    get imagenUrl(): string {
        // Devolvemos la imagen en forma de peticilon a la API
        const token = localStorage.getItem('token') || '';
        if (!this.imagen) {
            return `${base_url}/upload/fotoperfil/no-imagen.jpg?token=${token}`;
        }
        return `${base_url}/upload/fotoperfil/${this.imagen}?token=${token}`;
    }
}
