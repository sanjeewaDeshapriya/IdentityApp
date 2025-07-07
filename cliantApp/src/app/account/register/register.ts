import { Component, OnInit } from '@angular/core';
import { Account } from '../account';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationMessages } from "../../shared/validation-messages/validation-messages/validation-messages";
import { Notification } from "../../shared/models/notification/notification";
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, ValidationMessages, Notification,],
  templateUrl: './register.html',
  standalone:true,
  styleUrl: './register.css'
})
export class Register implements OnInit {
  regiesterForm : FormGroup = new FormGroup({});
  submitted = false;
  errorMessage : string[] = [];
  notificationTitle = 'Saved!';
  notificationMessage = 'Changes have been saved.';
  isSuccess = false;
  isError = true;
  

  constructor(
    private accountservice:Account,
    private formBuilder: FormBuilder,
    private router:Router
  ) { 

  }

  Register(){
    this.submitted = true;
    this.errorMessage = [];
    
    console.log(this.regiesterForm.value);

    
    

    console.log(this.regiesterForm.get('firstname')?.valid);
    console.log(this.regiesterForm.get('email')?.valid);
    console.log(this.regiesterForm.get('lastName')?.valid);
    console.log(this.regiesterForm.get('password')?.valid);

    if (this.regiesterForm.valid || true){
      this.accountservice.register(this.regiesterForm.value).subscribe(
      {
        next:(response)=>{
          console.log(response);
          this.isError = false;
          this.router.navigateByUrl('/account/login');
          
          
        },
        error:(error)=>{

          if(error.error.error){
            this.errorMessage= error.error.error;
          }
          else{
            this.errorMessage.push(error.error);
          }
          console.log("eeeeeeeeee");
          console.log(error.error);
          console.log("eeeeeeeeee");
          console.log(this.errorMessage);
          
       
          
          
          
        }
      }
    )

    if(this.submitted && !this.isError){
      this.isSuccess = true;
      this.notificationTitle = 'Saved!';
      this.notificationMessage = 'User have been saved.';
    }
      
    }
    

    

  }



  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.regiesterForm = this.formBuilder.group({
      firstName: ['',Validators.required, Validators.minLength(3), Validators.maxLength(15)],
      lastName: ['',Validators.required, Validators.minLength(3), Validators.maxLength(15)],
      email: ['',Validators.email,],
      password: ['',Validators.required, Validators.minLength(6)],

    });
  }

}
