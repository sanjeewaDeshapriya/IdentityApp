import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ValidationMessages } from './validation-messages/validation-messages/validation-messages';
import { Notification } from './models/notification/notification';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    ValidationMessages,
    Notification
    // ModalModule.forRoot()
  ],
  exports: [RouterModule,ReactiveFormsModule,HttpClientModule,ValidationMessages]
})
export class SharedModule { }
