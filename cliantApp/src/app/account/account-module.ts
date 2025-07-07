import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from './login/login';
import { Register } from './register/register';
import { RouterModule } from '@angular/router';
import { AccountRoutingModule } from './account-routing-module';
import { share } from 'rxjs';
import { SharedModule } from '../shared/shared-module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Login,
    AccountRoutingModule,
    SharedModule

  ]
})
export class AccountModule { }
