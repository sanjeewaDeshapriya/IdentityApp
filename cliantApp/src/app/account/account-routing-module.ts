import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Home } from '../home/home';
import { NotFound } from '../shared/not-found/not-found/not-found';
import { Login } from './login/login';
import { Register } from './register/register';
import { ConfirmEmail } from './confirm-email/confirm-email';
import { SendEmail } from './send-email/send-email';
import { ResetPassword } from './reset-password/reset-password';

const router:Routes=[
  {path: 'login', component: Login },
  {path: 'register', component: Register },
  {path: 'confirm-email', component: ConfirmEmail },
  {path: 'send-email/:model', component:  SendEmail},
  {path: 'reset-password',component:ResetPassword}

]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(router),
    CommonModule
  ],
  exports: [
    RouterModule]
})
export class AccountRoutingModule { }
