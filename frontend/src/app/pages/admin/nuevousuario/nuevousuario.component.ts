import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'nuevousuario',
  templateUrl: './nuevousuario.component.html',
  styleUrls: ['./nuevousuario.component.css']
})
export class NuevousuarioComponent implements OnInit {


  private formSubmited = false;
  private uid: string = '';
  public showOKP: boolean = false;

  public datosForm = this.fb.group({
    email: [ '', [Validators.required, Validators.email] ],
    nombre_apellidos: ['', Validators.required ],
    password: ['', Validators.required ],
    rol: ['ROL_ALUMNO', Validators.required ],
  });


  constructor( private fb: FormBuilder,
               private route: ActivatedRoute,
               private router: Router,
               private UsuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.generatePasswordRand(4);
  }

  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
      this.router.navigateByUrl('/admin/usuarios');
  }


  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }

      this.UsuarioService.nuevoUsuario( this.datosForm.value )
        .subscribe( res => {
          this.datosForm.markAsPristine();

          Swal.fire({
            icon: 'success',
            title: 'Usuario creado correctamente',
            showConfirmButton: false,
            timer: 2000
          })
          this.router.navigateByUrl('/admin/usuarios');

        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
          return;
        });


  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

  //Para generar una pass aleatoria para el usuario
  generatePasswordRand(length){
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var pass = "";
    for (var i = 0; i < length; i++) {
            pass += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.datosForm.get('password').setValue(pass);
    return pass;
  }

}



