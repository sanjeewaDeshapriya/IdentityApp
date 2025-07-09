import { Component, OnInit } from '@angular/core';
import { Account } from '../account';
import { Shared } from '../../shared/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../shared/models/account/user';
import { take } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-send-email',
  imports: [CommonModule, ReactiveFormsModule,],
 
  templateUrl: './send-email.html',
  styleUrl: './send-email.css'
})
export class SendEmail implements OnInit {
  emailForm: FormGroup = new FormGroup({});
  submitted = false;
  mode: string | undefined;
  errorMessages: string[] = [];

  constructor(
    private accountService: Account,
    private sharedService: Shared,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log("SendEmail component initialized");
    this.initializeForm();

    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigateByUrl('/');
        } else {
          const mode = this.activatedRoute.snapshot.paramMap.get('mode');
          if (mode) {
            this.mode = mode;
            console.log(`Mode is set to: ${this.mode}`);
          }
        }
      }
    });
  }

  initializeForm(): void {
    this.emailForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
    });
  }

  sendEmail(): void {
    this.submitted = true;
    this.errorMessages = [];

    if (this.emailForm.invalid) {
      this.errorMessages.push("Please enter a valid email address.");
      return;
    }

    console.log("Sending email with form value:", this.emailForm.value);

    if (this.emailForm.valid ) {
      
        this.accountService.resendEmailConfirmationLink(this.emailForm.get('email')?.value).subscribe({
          next: (response: any) => {
            // this.sharedService.showNotification(true, response.value.title, response.value.message);
            alert(`${response.value.title} : ${response.value.message}`);
            this.router.navigateByUrl('/account/login');
          }, error: error => {
            alert("Failed to send email. Please try again.");
            if (error.error.errors) {
              this.errorMessages = error.error.errors;
            } else {
              this.errorMessages.push(error.error);
            }
          }
        })
      } 
  }


  cancel() {
    this.router.navigateByUrl('/account/login');
  }

  resetpasswd(){
  console.log("Forgot Password clicked");
 
        this.accountService.forgotUsernameOrPassword(this.emailForm.get('email')?.value).subscribe({
          next: (response: any) => {
            // this.sharedService.showNotification(true, response.value.title, response.value.message);
            alert(`${response.value.title} : ${response.value.message}`);
            this.router.navigateByUrl('/account/login');
          }, error: error => {
            if (error.error.errors) {
              this.errorMessages = error.error.errors;
            } else {
              this.errorMessages.push(error.error);
            }
          }
        });
  


}
}




