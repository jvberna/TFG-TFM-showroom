import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'actualizarusuario',
  templateUrl: './actualizarusuario.component.html',
  styleUrls: ['./actualizarusuario.component.css']
})
export class ActualizarusuarioComponent implements OnInit {

  private formSubmited = false;
  private uid: string = '';
  public showOKP: boolean = false;
  public loading: boolean = true;

  public datosForm = this.fb.group({
    email: [ '', [Validators.required, Validators.email] ],
    nombre_apellidos: ['', Validators.required ],
    rol: ['ROL_ALUMNO', Validators.required ],
  });

  public nuevoPassword = this.fb.group({
    nuevopassword: ['', Validators.required],
    nuevopassword2: ['', Validators.required],
  });

  constructor( private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private UsuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];
    console.log("UID: ", this.uid);
    this.cargarUsuario();
  }

  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
      this.router.navigateByUrl('/admin/usuarios');
  }


  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }

      this.UsuarioService.actualizarUsuario(this.uid, this.datosForm.value )
        .subscribe( res => {
          this.datosForm.markAsPristine();

          Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado correctamente',
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

  campoNoValidoPass( campo: string) {
    return this.nuevoPassword.get(campo).invalid && this.formSubmited;
  }

  cargarUsuario(){
    this.loading = true;
    this.UsuarioService.cargarUsuario(this.uid)
      .subscribe( res => {
          this.datosForm.get('nombre_apellidos').setValue(res['usuarios'].nombre_apellidos);
          this.datosForm.get('email').setValue(res['usuarios'].email);
          this.datosForm.get('rol').setValue(res['usuarios'].rol);
          console.log(res['usuarios']);

      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
  }

  cambiarPassword(){
    console.log("Entro pass");
    // ponemos el mismo valor en los tres campos
    const data = {
      nuevopassword: this.nuevoPassword.get('nuevopassword').value,
      nuevopassword2: this.nuevoPassword.get('nuevopassword2').value
    };
    this.UsuarioService.cambiarPassword( this.uid, data)
      .subscribe(res => {
        this.nuevoPassword.reset();
        this.showOKP = true;
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada correctamente',
          showConfirmButton: false,
          timer: 2000
        })
        this.router.navigateByUrl('/admin/usuarios');
      }, (err)=>{
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
        return;
      });
  }

}
