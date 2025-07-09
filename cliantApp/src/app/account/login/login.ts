import { Component, DOCUMENT, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountModule } from '../account-module';
import { Account } from '../account';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { Shared } from '../../shared/shared';
import { LoginWithExternal } from '../../shared/models/account/loginWithExternal';
import { CredentialResponse } from 'google-one-tap';
import { jwtDecode } from 'jwt-decode';
declare const FB: any;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {


  @ViewChild('googleButton', {static: true}) googleButton: ElementRef = new ElementRef({});
  loginForm : FormGroup = new FormGroup({});
  submitted = false;
  errorMessage : string[] = [];
  returnUrl: string | null = null;

  constructor(
    private accountservice: Account,
    private formBuilder: FormBuilder,
    private sharedService: Shared,
    private router:Router,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document)
  
   { 
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
    this.initiazeGoogleButton();
    this.initializeForm();
  }

   ngAfterViewInit() {
    const script1 = this._renderer2.createElement('script');
    script1.src = 'https://accounts.google.com/gsi/client';
    script1.async = 'true';
    script1.defer = 'true';
    this._renderer2.appendChild(this._document.body, script1);
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

  loginWithFacebook() {
    FB.login(async (fbResult: any) => {
      if (fbResult.authResponse) {
        const accessToken = fbResult.authResponse.accessToken;
        const userId = fbResult.authResponse.userID;
        console.log(fbResult);
        
        
        this.accountservice.loginWithThirdParty(new LoginWithExternal(accessToken, userId, "facebook")).subscribe({
          next: () => {
            if (this.returnUrl) {
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.router.navigateByUrl('/');
            }
          },
          error: error => {
            // this.sharedService.showNotification(false, "Failed", error.error);
            alert("Failed to login with Facebook: " + error.error);
          }
        })
      } else {
        // this.sharedService.showNotification(false, "Failed", "Unable to login with your facebook");
        alert("Unable to login with your Facebook account. Please try again.");
      }
    })
  }

  fogetPassword(){
    this.router.navigateByUrl('/account/send-email/resend-email-confirmation-link');
    alert("Foget Password");
  }

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
        {size: 'medium', shape: 'rectangular', text: 'signin_with', logo_alignment: 'center'}
      );
    };
  }

  private async googleCallBack(response: CredentialResponse) {

    const decodedToken: any = jwtDecode(response.credential);
    console.log(decodedToken);
    
    this.accountservice.loginWithThirdParty(new LoginWithExternal(response.credential, decodedToken.sub, "google"))
      .subscribe({
        next: _ => {
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl('/');
          }
        }, error: error => {
          // this.sharedService.showNotification(false, "Failed", error.error);
          alert( error.error)
        }
      })
  }

  


}
