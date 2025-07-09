import { Component } from '@angular/core';
import { Account } from '../account';
import { Shared } from '../../shared/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from '../../shared/models/account/user';
import {Confirm_Email} from '../../shared/models/account/confirmEmail';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-email',
  imports: [CommonModule],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css'
})
export class ConfirmEmail {
  success: boolean = true;
  error: string = '';
  
   constructor(private accountService: Account,
    private sharedService: Shared,
    private router: Router,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {

    console.log("Init works");


    
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) =>{
        if (user) {
          this.router.navigateByUrl('/');
        } else {
          this.activatedRoute.queryParamMap.subscribe({
            next: (params: any) => {
              const confirmEmail: Confirm_Email = {
                token: params.get('token'),
                email: params.get('email'),
              }

              console.log(`Token: ${confirmEmail.token}, Email: ${confirmEmail.email}`);
              

              this.accountService.confirmEmail(confirmEmail).subscribe({
                next: (response: any) => {
                  // this.sharedService.noti(true, response.value.title, response.value.message);
                  this.error=response.value.message;
                  console.log(`${response.value.title} : ${response.value.message }`);
                  
                }, error: error => {
                  this.success = false;
                  // this.sharedService.showNotification(false, "Failed", error.error);
                  this.error=error.error;
                  console.error(`Failed to confirm email: ${error.error}`);
                }
              })
            }
          })
        }
      }
    })
    
  }

  resendEmailConfirmationLink() {
    this.router.navigateByUrl('/account/send-email/resend-email-confirmation-link');
  }
  
  goTOLogin(){
    this.router.navigate(['/account/login']);
  }



}
