import { Component, DOCUMENT, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Account } from '../account';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationMessages } from "../../shared/validation-messages/validation-messages/validation-messages";
import { Notification } from "../../shared/models/notification/notification";
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { CredentialResponse } from 'google-one-tap';
import { User } from '../../shared/models/account/user';
import { take } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
declare const FB: any;

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, ValidationMessages, Notification,],
  templateUrl: './register.html',
  standalone:true,
  styleUrl: './register.css'
})
export class Register implements OnInit {
   @ViewChild('googleButton', {static: true}) googleButton: ElementRef = new ElementRef({});
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
    private router:Router,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) { 
    this.accountservice.user$.pipe(take(1)).subscribe({
        next: (user: User | null) => {
          if (user) {
            this.router.navigateByUrl('/');
          }
        }
      })

  }

  ngAfterViewInit() {
    const script1 = this._renderer2.createElement('script');
    script1.src = 'https://accounts.google.com/gsi/client';
    script1.async = 'true';
    script1.defer = 'true';
    this._renderer2.appendChild(this._document.body, script1);
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
    this.initiazeGoogleButton();
  }

  initializeForm(){
    this.regiesterForm = this.formBuilder.group({
      firstName: ['',Validators.required, Validators.minLength(3), Validators.maxLength(15)],
      lastName: ['',Validators.required, Validators.minLength(3), Validators.maxLength(15)],
      email: ['',Validators.email,],
      password: ['',Validators.required, Validators.minLength(6)],

    });
  }

   registerWithFacebook(){
    FB.login(async(fberesult: any) => {

      if(fberesult.authResponse) {
        const accessToken = fberesult.authResponse.accessToken;
         const userId = fberesult.authResponse.userID;
         this.router.navigateByUrl(`/account/register/third-party/facebook?access_token=${accessToken}&userId=${userId}`);
        console.log(fberesult); }
        else{
          alert("User cancelled login or did not fully authorize.");
        }

      
      }

      
    )}

    private initiazeGoogleButton() {
    (window as any).onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '940632980931-ej87k0ef2n2p7ulb07dq50lojlvmsmi0.apps.googleusercontent.com',
        callback: this.googleCallBack.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        this.googleButton.nativeElement,
        {size: 'medium', shape: 'rectangular', text: 'signup_with', logo_alignment: 'center'}
      );
    };
  }

  private async googleCallBack(response: CredentialResponse) {
   const decodedToken: any = jwtDecode(response.credential);
    this.router.navigateByUrl(`/account/register/third-party/google?access_token=${response.credential}&userId=${decodedToken.sub}`);
    
    
  }

 


}
