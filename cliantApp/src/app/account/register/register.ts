import { Component, OnInit } from '@angular/core';
import { Account } from '../account';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationMessages } from "../../shared/validation-messages/validation-messages/validation-messages";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, ValidationMessages],
  templateUrl: './register.html',
  standalone:true,
  styleUrl: './register.css'
})
export class Register implements OnInit {
  regiesterForm : FormGroup = new FormGroup({});
  submitted = false;
  errorMessage : string[] = [];
  

  constructor(
    private accountservice:Account,
    private formBuilder: FormBuilder
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
