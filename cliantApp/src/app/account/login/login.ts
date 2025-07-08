import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountModule } from '../account-module';
import { Account } from '../account';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {



  loginForm : FormGroup = new FormGroup({});
  submitted = false;
  errorMessage : string[] = [];

  constructor(
    private accountservice: Account,
    private formBuilder: FormBuilder,
    private router:Router
  ) { 
    this.accountservice.user$.pipe(take(1)).subscribe({
      next:(user)=>{
        if (user){
          this.router.navigateByUrl('/');
        }
      },
      error:(error)=>{
        console.error("Error fetching user", error);
      }
    });

  }
 
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.loginForm = this.formBuilder.group({
      userName: ['',Validators.required],
      password: ['',Validators.required],

    });
  }
  
  logIn(){
    this.submitted = true;
    this.errorMessage = [];
    
    console.log("Form Submitted");
    
    console.log(this.loginForm.value);

    if (this.loginForm.valid || true){
      this.accountservice.login(this.loginForm.value).subscribe(
      {
        next:(response)=>{
          console.log(response);
          this.router.navigateByUrl('/');
       
        
          
          
        },
        error:(error)=>{

          if(error.error.error){
            this.errorMessage= error.error.error;
          }
          else{
            this.errorMessage.push(error.error);
          }
        }
      }
    )

  }}

  


}
