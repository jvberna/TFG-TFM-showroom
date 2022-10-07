import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UsuarioService } from '../../services/usuario.service';
import {Usuario} from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor( private fb: FormBuilder,
    private UsuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router) { }

  public loading = true;
  public usuario: Usuario;
  public rol = this.UsuarioService.rol;
  private formSubmited = false;
  public enablepass: boolean = true;
  public showOKP: boolean = false;

  public nuevoPassword = this.fb.group({
    password: ['', Validators.required],
    nuevopassword: ['', Validators.required],
    nuevopassword2: ['', Validators.required],
  });

  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.loading = true;
    this.UsuarioService.cargarUsuario(this.UsuarioService.uid)
      .subscribe( res => {
        this.usuario = res['usuarios'];
        console.log("Usuario: ", res['usuarios']);
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
  }

  cambiarPassword(){
    // ponemos el mismo valor en los tres campos
    const data = {
      password : this.nuevoPassword.get('password').value,
      nuevopassword: this.nuevoPassword.get('nuevopassword').value,
      nuevopassword2: this.nuevoPassword.get('nuevopassword2').value
    };
    this.UsuarioService.cambiarPassword( this.UsuarioService.uid, data)
      .subscribe(res => {
        this.nuevoPassword.reset();
        this.showOKP = true;
      }, (err)=>{
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
        return;
      });
  }

}
