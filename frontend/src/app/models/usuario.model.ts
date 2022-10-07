
import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Usuario {
  // nombre_apellidos, email, password, imagen, rol, alta
    constructor( public uid: string,
                 public rol: string,
                 public nombre_apellidos?: string,
                 public email?: string,
                 public alta?: Date,
                 public imagen?: string,

                 ) {}

    get imagenUrl(): string {
        // Devolvemos la imagen en forma de peticion a la API
        const token = localStorage.getItem('token') || '';
        if (!this.imagen) {
            return `${base_url}/upload/fotoperfil/no-imagen.jpg?token=${token}`;
        }
        return `${base_url}/upload/fotoperfil/${this.imagen}?token=${token}`;
    }
}
