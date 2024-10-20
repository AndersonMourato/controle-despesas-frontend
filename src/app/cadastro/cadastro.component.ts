import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { LoginService } from '../shared/services/login.service';
import { ICadastro } from '../shared/models/cadastro.interface';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, SharedModule, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

  formulario!: FormGroup;

  constructor(
    private fb:FormBuilder,
    private loginService: LoginService
  ){
    this.formulario = fb.group({
      email: ['', [Validators.required, Validators.email]], 
      senha: ['', [Validators.required, Validators.minLength(3)]],
      nome: ['', Validators.required],
      telefone: ['', Validators.required]
    });
  }

  setCadastro(){
    if(this.formulario){
      const user: ICadastro ={
        id:"",
        nome: this.formulario.get("nome")?.value,
        email: this.formulario.get("email")?.value,
        telefone: +(this.formulario.get("telefone")?.value),
        senha: this.formulario.get("senha")?.value
      }   
      console.log(user);
      this.loginService.cadastro(user).subscribe({
        next: (resp) => {
          if (resp.status === HttpStatusCode.Ok){
            this.formulario.reset();
            Swal.fire(
              'Cadastro de Usuário',
              'Usuário cadastrado com sucesso!',
              'success'
              );
          }
        },
        error: (err: HttpErrorResponse) => {
          let msg = err.error.error;
          if (err.status === HttpStatusCode.BadRequest && err.error.error.includes('Bad Request')) {
            msg = 'Não foi possivel realizar o cadastro';
          }
          Swal.fire(
            'ALERTA: falha ao realizar cadastro',
            err.error.mensagem ? err.error.mensagem : 'Ocorreu um erro inesperado. [ ' + msg + ' ]',
            'warning'
            );
        }
      })
    }
  }
}
