import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account } from '../account';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../shared/models/account/user';
import { take } from 'rxjs';
import { RegisterWithExternal } from '../../shared/models/account/registerWithExternal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-with-third-party',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register-with-third-party.html',
  styleUrl: './register-with-third-party.css'
})
export class RegisterWithThirdParty implements OnInit{
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  provider: string | null = null;
  access_token: string | null = null;
  userId: string | null = null;
  errorMessages: string[] = [];

  constructor(private accountService: Account,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigateByUrl('/');
        } else {
          console.log("RegisterWithThirdParty component initialized");
          
          this.activatedRoute.queryParamMap.subscribe({
            next: (params: any) => {


              this.provider = this.activatedRoute.snapshot.paramMap.get('provider');
              this.access_token = params.get('access_token');
              this.userId = params.get('userId');

              console.log(`Provider: ${this.provider}, Access Token: ${this.access_token}, User ID: ${this.userId}`);
              if (this.provider && this.access_token && this.userId &&
                (this.provider === 'facebook' || this.provider === 'google')) {

                  this.initializeForm();
              } else {
                this.router.navigateByUrl('/account/register');
              }

             
            }
          })
        }
      }
    })
  }


  initializeForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    });
  }

  register() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.registerForm.valid && this.userId && this.access_token && this.provider) {
      const firstName = this.registerForm.get('firstName')?.value;
      const lastName = this.registerForm.get('lastName')?.value;

      const model = new RegisterWithExternal(firstName, lastName, this.userId, this.access_token, this.provider);
      this.accountService.registerWithThirdParty(model).subscribe({
        next: _ => {
          this.router.navigateByUrl('/');
        }, error: error => {
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error);
          }
        }
      })
    }
  }

}
