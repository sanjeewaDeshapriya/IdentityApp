import { Component } from '@angular/core';
import { User } from '../../shared/models/account/user';
import { Account } from '../account';
import { Shared } from '../../shared/shared';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Reset_Password } from '../../shared/models/account/resetPassword';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})


export class ResetPassword {

  resetPasswordForm: FormGroup = new FormGroup({});
  token: string | undefined;
  email: string | undefined;
  submitted = false;
  errorMessages: string[] = [];

  constructor(private accountService: Account,
    private sharedService: Shared,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigateByUrl('/');
        } else {
          this.activatedRoute.queryParamMap.subscribe({
            next: (params: any) => {
              this.token = params.get('token');
              this.email = params.get('email');

              if (this.token && this.email) {
                this.initializeForm(this.email);
              } else {
                this.router.navigateByUrl('/account/login');
              }
            }
          })
        }
      }
    })
  }


  initializeForm(username: string) {
    this.resetPasswordForm = this.formBuilder.group({
      email: [{value: username, disabled: true}],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    })
  }

  resetPassword() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.resetPasswordForm.valid && this.email && this.token) {
      const model: Reset_Password = {
        token: this.token,
        email: this.email,
        newPassword : this.resetPasswordForm.get('newPassword')?.value
      };
     
       

      this.accountService.resetPassword(model).subscribe({
        next: (response: any) => {
          // this.sharedService.showNotification(true, response.value.title, response.value.message);
          alert(response.value.message);
          this.router.navigateByUrl('/account/login');
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
